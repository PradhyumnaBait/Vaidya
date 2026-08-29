"""
MediKiosk — Folk-Idiom Corpus Loader

Loads vernacular idiom seed data from data/vernacular_idioms/folk_idioms.csv
and data/namaste_codes.csv into the SQLite BM25 FTS5 index used by the
hybrid RAG translator (rag_translator.py).

Usage:
    python -m app.nlp.idiom_corpus_loader         # auto-detects data dir
    python -m app.nlp.idiom_corpus_loader --reset # wipe and reload
    from app.nlp.idiom_corpus_loader import load_corpus, get_bm25_connection

Schema created:
    idioms(id, folk_phrase, language_code, canonical_english, namaste_code,
           icd11_allopathic, clinical_category, severity, dosha_hint,
           alternative_phrasings)
    namaste_codes(namaste_code, category, english_term, hindi_term,
                  marathi_term, synonyms, icd11_tm2_code, icd11_allopathic_code,
                  dosha_association, severity_tier)
    embeddings_meta(namaste_code, chunk_id, text, pinecone_uploaded)
"""
from __future__ import annotations

import argparse
import csv
import logging
import sqlite3
from pathlib import Path
from typing import Iterator

logger = logging.getLogger(__name__)

# ── Paths ─────────────────────────────────────────────────────────────────────
_REPO_ROOT = Path(__file__).parent.parent.parent  # medikiosk-backend/
DATA_DIR = _REPO_ROOT / "data"
IDIOMS_CSV = DATA_DIR / "vernacular_idioms" / "folk_idioms.csv"
NAMASTE_CSV = DATA_DIR / "namaste_codes.csv"
BM25_DB_PATH = DATA_DIR / "bm25_index.db"


# ── Connection helper ─────────────────────────────────────────────────────────

def get_bm25_connection(path: Path = BM25_DB_PATH) -> sqlite3.Connection:
    """Return a SQLite connection to the BM25 FTS5 index (creates if absent)."""
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    return conn


# ── Schema creation ───────────────────────────────────────────────────────────

def _create_schema(conn: sqlite3.Connection) -> None:
    cur = conn.cursor()

    # Regular table for NAMASTE codes (used for exact lookups)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS namaste_codes (
            namaste_code        TEXT PRIMARY KEY,
            category            TEXT,
            english_term        TEXT,
            hindi_term          TEXT,
            marathi_term        TEXT,
            synonyms            TEXT,
            icd11_tm2_code      TEXT,
            icd11_allopathic_code TEXT,
            dosha_association   TEXT,
            severity_tier       TEXT
        )
    """)

    # FTS5 virtual table for BM25 full-text search over idioms
    cur.execute("""
        CREATE VIRTUAL TABLE IF NOT EXISTS idioms USING fts5(
            folk_phrase,
            language_code       UNINDEXED,
            canonical_english,
            namaste_code        UNINDEXED,
            icd11_allopathic    UNINDEXED,
            clinical_category   UNINDEXED,
            severity            UNINDEXED,
            dosha_hint          UNINDEXED,
            alternative_phrasings,
            content='',
            tokenize='unicode61'
        )
    """)

    # FTS5 table for NAMASTE terms (for BM25 code lookup by English/synonyms)
    cur.execute("""
        CREATE VIRTUAL TABLE IF NOT EXISTS namaste_fts USING fts5(
            namaste_code        UNINDEXED,
            english_term,
            synonyms,
            hindi_term,
            marathi_term,
            dosha_association   UNINDEXED,
            icd11_allopathic_code UNINDEXED,
            icd11_tm2_code      UNINDEXED,
            severity_tier       UNINDEXED,
            content='',
            tokenize='unicode61'
        )
    """)

    # Metadata table for tracking Pinecone upload status
    cur.execute("""
        CREATE TABLE IF NOT EXISTS embeddings_meta (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            namaste_code        TEXT,
            chunk_id            TEXT UNIQUE,
            text                TEXT,
            pinecone_uploaded   INTEGER DEFAULT 0,
            created_at          TEXT DEFAULT (datetime('now'))
        )
    """)

    conn.commit()
    logger.debug("BM25 schema created/verified.")


# ── CSV readers ───────────────────────────────────────────────────────────────

def _iter_idioms_csv(path: Path) -> Iterator[dict]:
    if not path.exists():
        logger.warning("Idioms CSV not found: %s", path)
        return
    with open(path, encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            yield row


def _iter_namaste_csv(path: Path) -> Iterator[dict]:
    if not path.exists():
        logger.warning("NAMASTE codes CSV not found: %s", path)
        return
    with open(path, encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            yield row


# ── Loader ────────────────────────────────────────────────────────────────────

def load_corpus(
    db_path: Path = BM25_DB_PATH,
    idioms_csv: Path = IDIOMS_CSV,
    namaste_csv: Path = NAMASTE_CSV,
    reset: bool = False,
) -> dict[str, int]:
    """
    Load folk idioms and NAMASTE codes into the BM25 SQLite index.

    Args:
        db_path:     Path to the SQLite database file.
        idioms_csv:  Path to folk_idioms.csv.
        namaste_csv: Path to namaste_codes.csv.
        reset:       If True, drop and recreate all tables before loading.

    Returns:
        Dict with keys 'idioms_loaded', 'namaste_loaded', 'embeddings_queued'.
    """
    conn = get_bm25_connection(db_path)

    if reset:
        cur = conn.cursor()
        for tbl in ("idioms", "namaste_fts", "namaste_codes", "embeddings_meta"):
            cur.execute(f"DROP TABLE IF EXISTS {tbl}")
        conn.commit()
        logger.info("Reset: all tables dropped.")

    _create_schema(conn)
    cur = conn.cursor()

    # ── 1. Load idioms into FTS5 ───────────────────────────────────────────────
    idioms_loaded = 0
    for row in _iter_idioms_csv(idioms_csv):
        cur.execute(
            """INSERT INTO idioms
               (folk_phrase, language_code, canonical_english, namaste_code,
                icd11_allopathic, clinical_category, severity, dosha_hint,
                alternative_phrasings)
               VALUES (?,?,?,?,?,?,?,?,?)""",
            (
                row.get("folk_phrase", ""),
                row.get("language_code", ""),
                row.get("canonical_english", ""),
                row.get("namaste_code", ""),
                row.get("icd11_allopathic", ""),
                row.get("clinical_category", ""),
                row.get("severity", ""),
                row.get("dosha_hint", ""),
                row.get("alternative_phrasings", ""),
            ),
        )
        idioms_loaded += 1

    # ── 2. Load NAMASTE codes ─────────────────────────────────────────────────
    namaste_loaded = 0
    embeddings_queued = 0
    for row in _iter_namaste_csv(namaste_csv):
        # Regular table
        cur.execute(
            """INSERT OR REPLACE INTO namaste_codes
               (namaste_code, category, english_term, hindi_term, marathi_term,
                synonyms, icd11_tm2_code, icd11_allopathic_code,
                dosha_association, severity_tier)
               VALUES (?,?,?,?,?,?,?,?,?,?)""",
            (
                row.get("namaste_code", ""),
                row.get("category", ""),
                row.get("english_term", ""),
                row.get("hindi_term", ""),
                row.get("marathi_term", ""),
                row.get("synonyms", ""),
                row.get("icd11_tm2_code", ""),
                row.get("icd11_allopathic_code", ""),
                row.get("dosha_association", ""),
                row.get("severity_tier", ""),
            ),
        )
        # FTS5 table
        cur.execute(
            """INSERT INTO namaste_fts
               (namaste_code, english_term, synonyms, hindi_term, marathi_term,
                dosha_association, icd11_allopathic_code, icd11_tm2_code,
                severity_tier)
               VALUES (?,?,?,?,?,?,?,?,?)""",
            (
                row.get("namaste_code", ""),
                row.get("english_term", ""),
                row.get("synonyms", ""),
                row.get("hindi_term", ""),
                row.get("marathi_term", ""),
                row.get("dosha_association", ""),
                row.get("icd11_allopathic_code", ""),
                row.get("icd11_tm2_code", ""),
                row.get("severity_tier", ""),
            ),
        )
        namaste_loaded += 1

        # Queue combined text for Pinecone embedding upload
        chunk_text = " | ".join(filter(None, [
            row.get("english_term", ""),
            row.get("hindi_term", ""),
            row.get("marathi_term", ""),
            row.get("synonyms", ""),
        ]))
        chunk_id = f"{row.get('namaste_code', 'X')}-term"
        cur.execute(
            """INSERT OR IGNORE INTO embeddings_meta
               (namaste_code, chunk_id, text) VALUES (?,?,?)""",
            (row.get("namaste_code", ""), chunk_id, chunk_text),
        )
        embeddings_queued += 1

    conn.commit()
    conn.close()

    stats = {
        "idioms_loaded": idioms_loaded,
        "namaste_loaded": namaste_loaded,
        "embeddings_queued": embeddings_queued,
    }
    logger.info("Corpus loaded: %s", stats)
    return stats


# ── Query helpers (used by rag_translator.py) ─────────────────────────────────

def bm25_search_idioms(
    query: str,
    top_k: int = 5,
    conn: sqlite3.Connection | None = None,
) -> list[dict]:
    """
    BM25 full-text search over the folk idiom corpus.

    Returns up to top_k rows ordered by FTS5 BM25 rank (best first).
    Each result dict has keys: namaste_code, canonical_english, icd11_allopathic,
    clinical_category, severity, dosha_hint, score (positive float).
    """
    _own = conn is None
    if _own:
        conn = get_bm25_connection()

    try:
        # Escape FTS5 special chars in query
        safe_query = query.replace('"', '""')
        cur = conn.cursor()
        rows = cur.execute(
            """SELECT namaste_code, canonical_english, icd11_allopathic,
                      clinical_category, severity, dosha_hint,
                      bm25(idioms) AS score
               FROM idioms
               WHERE idioms MATCH ?
               ORDER BY score
               LIMIT ?""",
            (safe_query, top_k),
        ).fetchall()
        return [dict(r) for r in rows]
    except sqlite3.OperationalError as exc:
        logger.warning("BM25 idiom search failed (%s): %s", type(exc).__name__, exc)
        return []
    finally:
        if _own:
            conn.close()


def bm25_search_namaste(
    query: str,
    top_k: int = 5,
    conn: sqlite3.Connection | None = None,
) -> list[dict]:
    """
    BM25 full-text search over NAMASTE code terms (English + Hindi + Marathi + synonyms).

    Returns up to top_k rows with keys: namaste_code, icd11_allopathic_code,
    icd11_tm2_code, dosha_association, severity_tier, score.
    """
    _own = conn is None
    if _own:
        conn = get_bm25_connection()

    try:
        safe_query = query.replace('"', '""')
        cur = conn.cursor()
        rows = cur.execute(
            """SELECT namaste_code, icd11_allopathic_code, icd11_tm2_code,
                      dosha_association, severity_tier,
                      bm25(namaste_fts) AS score
               FROM namaste_fts
               WHERE namaste_fts MATCH ?
               ORDER BY score
               LIMIT ?""",
            (safe_query, top_k),
        ).fetchall()
        return [dict(r) for r in rows]
    except sqlite3.OperationalError as exc:
        logger.warning("BM25 NAMASTE search failed (%s): %s", type(exc).__name__, exc)
        return []
    finally:
        if _own:
            conn.close()


def lookup_namaste_code(code: str) -> dict | None:
    """Direct lookup of a NAMASTE code from the regular table."""
    conn = get_bm25_connection()
    try:
        row = conn.execute(
            "SELECT * FROM namaste_codes WHERE namaste_code = ?", (code,)
        ).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


# ── CLI entry-point ───────────────────────────────────────────────────────────

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    parser = argparse.ArgumentParser(description="Load MediKiosk idiom corpus into SQLite BM25")
    parser.add_argument("--reset", action="store_true", help="Drop tables and reload from scratch")
    parser.add_argument("--db", default=str(BM25_DB_PATH), help="Path to SQLite DB")
    args = parser.parse_args()

    stats = load_corpus(db_path=Path(args.db), reset=args.reset)
    print(f"[OK] Idioms loaded:      {stats['idioms_loaded']}")
    print(f"[OK] NAMASTE codes:      {stats['namaste_loaded']}")
    print(f"[OK] Embeddings queued:  {stats['embeddings_queued']}")
    print(f"     DB path: {args.db}")
