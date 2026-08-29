# ==============================================================================
# MediKiosk Backend — Multi-stage Production Dockerfile
# Optimized for Python 3.11 + uvloop + FastAPI
# ==============================================================================

FROM python:3.11-slim AS builder

WORKDIR /build

# Install build essentials
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv for ultra-fast dependency resolution
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Copy dependency specifications
COPY pyproject.toml .

# Install dependencies into /app/.venv
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy
RUN uv venv /app/.venv && \
    uv pip install --venv /app/.venv \
    fastapi uvicorn uvloop websockets pydantic pydantic-settings \
    redis httpx groq FlagEmbedding pinecone-client \
    google-cloud-documentai Pillow python-dotenv \
    python-jose[cryptography] cryptography numpy rank-bm25 aiofiles

# ------------------------------------------------------------------------------
# Production Runtime Stage
# ------------------------------------------------------------------------------
FROM python:3.11-slim AS runner

WORKDIR /app

# Install runtime system libraries (libgomp for embedding model, ca-certificates)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for hospital security compliance
RUN groupadd -g 1001 medikiosk && \
    useradd -u 1001 -g medikiosk -s /bin/bash -m medikiosk

# Copy virtual environment from builder
COPY --from=builder --chown=medikiosk:medikiosk /app/.venv /app/.venv

# Copy application source code and data directory
COPY --chown=medikiosk:medikiosk app/ /app/app/
COPY --chown=medikiosk:medikiosk data/ /app/data/
COPY --chown=medikiosk:medikiosk pyproject.toml /app/

# Environment configuration
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH="/app"
ENV APP_ENV="production"
ENV PYTHONUNBUFFERED=1

# Ensure writable data and bundle directories
RUN mkdir -p /app/data/bundles && chown -R medikiosk:medikiosk /app/data

USER medikiosk

EXPOSE 8000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health/live || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--loop", "uvloop", "--ws", "websockets"]
