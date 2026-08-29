#!/usr/bin/env python
"""
MediKiosk — Pinecone Vector DB Seeder

Reads the embeddings_meta table from the BM25 SQLite index (populated by
idiom_corpus_loader.py), computes BGE-m3 embeddings for each un-uploaded
chunk, and upserts them into Pinecone with NAMASTE metadata.

Also re-indexes folk idioms from folk_idioms.csv as individual Pinecone
vectors for dense semantic retrieval.

Prerequisites:
    1. Run idiom corpus loader first:
       uv run python -m app.nlp.idiom_corpus_loader [--reset]
    2. Set environment variables in .env:
       PINECONE_API_KEY, PINECONE_INDEX_NAME, APP_ENV (not 'test')

Usage:
    uv run python scripts/seed_pinecone.py [--batch-size N] [--dry-run]
"""
from __future__ import annotations

import argparse
import csv
import logging
import os
import sys
import time
from pathlib import Path

# ── Ensure project root is on sys.path when running as a script ───────────────
_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(_ROOT))

from app.nlp.idiom_corpus_loader import (
    BM25_DB_PATH,
    DATA_DIR,
    get_bm25_connection,
    load_corpus,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)-8s %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("seed_pinecone")

IDIOMS_CSV = DATA_DIR / "vernacular_idioms" / "folk_idioms.csv"
NAMASTE_CSV = DATA_DIR / "namaste_codes.csv"


# ── Helpers ────────────────────────────────────────────────────────────────────

def _load_bge_model():
    """Load BGE-m3 model (FlagEmbedding). Returns model or None on failure."""
    try:
        from FlagEmbedding import FlagModel  # type: ignore[import]
        model = FlagModel(
            "BAAI/bge-m3",
            use_fp16=True,
            normalize_embeddings=True,
        )
        logger.info("BGE-m3 model loaded.")
        return model
    except ImportError:
        logger.warning(
            "FlagEmbedding not installed — using sentence-transformers fallback."
        )
    try:
        from sentence_transformers import SentenceTransformer  # type: ignore[import]
        model = SentenceTransformer("BAAI/bge-m3")
        model._is_st = True
        logger.info("sentence-transformers BGE-m3 fallback loaded.")
        return model
    except ImportError:
        logger.error(
            "Neither FlagEmbedding nor sentence-transformers found. "
            "Install with: uv add FlagEmbedding"
        )
        return None


def _embed(model, texts: list[str]) -> list[list[float]]:
    """Compute embeddings for a list of texts."""
    if hasattr(model, "_is_st") and model._is_st:
        return model.encode(texts, normalize_embeddings=True).tolist()
    return model.encode(texts).tolist()


def _get_pinecone_index(api_key: str, index_name: str):
    """Connect to Pinecone and return the index handle."""
    try:
        from pinecone import Pinecone, ServerlessSpec  # type: ignore[import]
        pc = Pinecone(api_key=api_key)
        if index_name not in [i.name for i in pc.list_indexes()]:
            logger.info("Creating Pinecone index '%s' (dimension=1024)...", index_name)
            pc.create_index(
                name=index_name,
                dimension=1024,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )
            # Wait for index to be ready
            while not pc.describe_index(index_name).status["ready"]:
                logger.info("Waiting for index to be ready...")
                time.sleep(5)
        return pc.Index(index_name)
    except ImportError:
        logger.error(
            "pinecone-client not installed. Install with: uv add pinecone-client"
        )
        return None


def _mark_uploaded(conn, chunk_ids: list[str]) -> None:
    """Mark chunks as uploaded in embeddings_meta."""
    if not chunk_ids:
        return
    placeholders = ",".join("?" * len(chunk_ids))
    conn.execute(
        f"UPDATE embeddings_meta SET pinecone_uploaded=1 WHERE chunk_id IN ({placeholders})",
        chunk_ids,
    )
    conn.commit()


# ── Main seeding logic ─────────────────────────────────────────────────────────

def seed_namaste_codes(
    index,
    model,
    conn,
    batch_size: int = 50,
    dry_run: bool = False,
) -> int:
    """Upload NAMASTE code embeddings from embeddings_meta."""
    rows = conn.execute(
        "SELECT namaste_code, chunk_id, text FROM embeddings_meta WHERE pinecone_uploaded = 0"
    ).fetchall()

    if not rows:
        logger.info("No pending NAMASTE embeddings to upload.")
        return 0

    total = 0
    for i in range(0, len(rows), batch_size):
        batch = rows[i : i + batch_size]
        texts = [r["text"] for r in batch]
        chunk_ids = [r["chunk_id"] for r in batch]
        namaste_codes = [r["namaste_code"] for r in batch]

        logger.info(
            "Embedding NAMASTE batch %d–%d (%d items)...",
            i + 1, i + len(batch), len(batch),
        )
        vectors = _embed(model, texts)

        pinecone_vectors = [
            {
                "id": chunk_ids[j],
                "values": vectors[j],
                "metadata": {
                    "namaste_code": namaste_codes[j],
                    "text": texts[j],
                    "type": "namaste",
                },
            }
            for j in range(len(batch))
        ]

        if not dry_run:
            index.upsert(vectors=pinecone_vectors)
            _mark_uploaded(conn, chunk_ids)
        total += len(batch)
        logger.info("Upserted %d NAMASTE vectors (cumulative: %d).", len(batch), total)

    return total


def seed_folk_idioms(
    index,
    model,
    batch_size: int = 50,
    dry_run: bool = False,
) -> int:
    """Upload folk idiom embeddings directly from folk_idioms.csv."""
    if not IDIOMS_CSV.exists():
        logger.warning("Idioms CSV not found: %s", IDIOMS_CSV)
        return 0

    rows = []
    with open(IDIOMS_CSV, encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            folk = row.get("folk_phrase", "")
            alts = row.get("alternative_phrasings", "")
            canonical = row.get("canonical_english", "")
            # Combine all textual signals
            text = " | ".join(filter(None, [folk, alts, canonical]))
            rows.append({
                "id": f"idiom-{row.get('namaste_code','X')}-{row.get('language_code','?')}-{len(rows)}",
                "text": text,
                "namaste_code": row.get("namaste_code", ""),
                "icd11": row.get("icd11_allopathic", ""),
                "severity": row.get("severity", ""),
                "dosha": row.get("dosha_hint", ""),
                "language": row.get("language_code", ""),
            })

    total = 0
    for i in range(0, len(rows), batch_size):
        batch = rows[i : i + batch_size]
        texts = [r["text"] for r in batch]
        logger.info(
            "Embedding idiom batch %d–%d (%d items)...",
            i + 1, i + len(batch), len(batch),
        )
        vectors = _embed(model, texts)

        pinecone_vectors = [
            {
                "id": batch[j]["id"],
                "values": vectors[j],
                "metadata": {
                    "namaste_code": batch[j]["namaste_code"],
                    "icd11_allopathic": batch[j]["icd11"],
                    "severity": batch[j]["severity"],
                    "dosha": batch[j]["dosha"],
                    "language": batch[j]["language"],
                    "text": texts[j],
                    "type": "folk_idiom",
                },
            }
            for j in range(len(batch))
        ]

        if not dry_run:
            index.upsert(vectors=pinecone_vectors)
        total += len(batch)
        logger.info("Upserted %d idiom vectors (cumulative: %d).", len(batch), total)

    return total


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Seed MediKiosk RAG vector DB (Pinecone) from CSV seed data"
    )
    parser.add_argument("--batch-size", type=int, default=50, metavar="N",
                        help="Vectors per Pinecone upsert call (default: 50)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Compute embeddings but do NOT upload to Pinecone")
    parser.add_argument("--reload-corpus", action="store_true",
                        help="Re-run idiom_corpus_loader before seeding")
    parser.add_argument("--reset-corpus", action="store_true",
                        help="Reset corpus DB (implies --reload-corpus)")
    args = parser.parse_args()

    # ── Step 0: Ensure BM25 corpus is populated ────────────────────────────────
    if args.reset_corpus or args.reload_corpus or not BM25_DB_PATH.exists():
        logger.info("Loading corpus into BM25 index...")
        stats = load_corpus(reset=args.reset_corpus)
        logger.info("Corpus stats: %s", stats)

    # ── Step 1: Load embedding model ───────────────────────────────────────────
    model = _load_bge_model()
    if model is None:
        logger.error("Cannot proceed without an embedding model.")
        sys.exit(1)

    # ── Step 2: Connect to Pinecone ────────────────────────────────────────────
    api_key = os.getenv("PINECONE_API_KEY", "")
    index_name = os.getenv("PINECONE_INDEX_NAME", "medikiosk-rag")
    if not api_key and not args.dry_run:
        logger.error(
            "PINECONE_API_KEY not set. Either set the env var or use --dry-run."
        )
        sys.exit(1)

    index = None
    if not args.dry_run:
        index = _get_pinecone_index(api_key, index_name)
        if index is None:
            sys.exit(1)

    # ── Step 3: Upload NAMASTE code embeddings ─────────────────────────────────
    conn = get_bm25_connection()
    n_namaste = seed_namaste_codes(index, model, conn, args.batch_size, args.dry_run)
    conn.close()

    # ── Step 4: Upload folk idiom embeddings ───────────────────────────────────
    n_idioms = seed_folk_idioms(index, model, args.batch_size, args.dry_run)

    print("\n" + "=" * 60)
    print(f"  MediKiosk Pinecone Seeder — {'DRY RUN' if args.dry_run else 'COMPLETE'}")
    print("=" * 60)
    print(f"  NAMASTE vectors upserted : {n_namaste}")
    print(f"  Folk idiom vectors       : {n_idioms}")
    print(f"  Total                    : {n_namaste + n_idioms}")
    if args.dry_run:
        print("\n  [DRY RUN] No data was written to Pinecone.")
    else:
        print(f"\n  Pinecone index: {index_name}")
    print("=" * 60)


if __name__ == "__main__":
    main()
