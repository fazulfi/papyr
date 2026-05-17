# Stage 1: Build dependencies
FROM python:3.11-slim AS builder
WORKDIR /app
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim
WORKDIR /app

# Install Ghostscript for server-side PDF compression
# Install LibreOffice headless for PDF-to-Word conversion (PAPYR-128)
# Install Tesseract OCR with Indonesian + English language packs (PAPYR-138)
# Install unpaper for ocrmypdf clean=True preprocessing
# Note: camelot-py uses pdfium backend (no ghostscript/apt required) for PDF-to-Excel (PAPYR-146)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ghostscript \
        libreoffice-writer \
        libreoffice-common \
        unpaper \
        tesseract-ocr \
        tesseract-ocr-ind \
        tesseract-ocr-eng && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy installed dependencies from builder
COPY --from=builder /root/.local /root/.local
COPY . .

# Ensure local bin is on PATH for uvicorn
ENV PATH=/root/.local/bin:$PATH

ENV PORT=8080
EXPOSE ${PORT}

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT} --workers 1
