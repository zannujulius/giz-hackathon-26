"""
Statistical report PDF chunker.
Strategy:
  - Extract tables separately via pdfplumber, store as structured text with caption.
  - Extract surrounding narrative text at paragraph level.
Standard text chunking destroys tabular data; this preserves it.
"""
import re
import fitz
import pdfplumber
from pathlib import Path

MAX_PARAGRAPH_CHARS = 1500
MIN_CONTENT_CHARS = 60


def _table_to_text(table: list[list]) -> str:
    """Convert a pdfplumber table (list of rows) to readable TSV-like text."""
    if not table:
        return ""
    rows = []
    for row in table:
        cells = [str(c).strip() if c else "" for c in row]
        rows.append(" | ".join(cells))
    return "\n".join(rows)


def _find_caption(text_before: str) -> str:
    """Look for a table/figure caption in the 300 chars before the table."""
    matches = re.findall(
        r"(Table\s+\d+[^:\n]*[:.]?[^\n]*|Figure\s+\d+[^:\n]*[:.]?[^\n]*)",
        text_before[-300:],
        re.IGNORECASE,
    )
    return matches[-1].strip() if matches else "Table"


def chunk_stats_pdf(pdf_path: Path) -> list[dict]:
    """
    Returns list of dicts:
      { content, chunk_type ('table'|'text'), caption, page_start, chunk_index }
    """
    chunks: list[dict] = []
    table_page_ranges: set[int] = set()  # pages we already handled as tables

    # ── Pass 1: extract tables via pdfplumber ──────────────────────────────
    with pdfplumber.open(str(pdf_path)) as pdf:
        for page_num, page in enumerate(pdf.pages, start=1):
            tables = page.extract_tables()
            if not tables:
                continue
            page_text = page.extract_text() or ""
            table_page_ranges.add(page_num)
            for table in tables:
                table_text = _table_to_text(table)
                if len(table_text) < MIN_CONTENT_CHARS:
                    continue
                caption = _find_caption(page_text)
                chunks.append({
                    "content": f"{caption}\n\n{table_text}",
                    "chunk_type": "table",
                    "caption": caption,
                    "page_start": page_num,
                    "chunk_index": len(chunks),
                })

    # ── Pass 2: extract narrative text (skip table pages) ─────────────────
    doc = fitz.open(str(pdf_path))
    for page_num in range(len(doc)):
        real_page = page_num + 1
        if real_page in table_page_ranges:
            continue
        text = doc[page_num].get_text("text")
        paragraphs = re.split(r"\n{2,}", text)
        for para in paragraphs:
            para = para.strip()
            if len(para) < MIN_CONTENT_CHARS:
                continue
            # Split long paragraphs at sentence boundary
            while len(para) > MAX_PARAGRAPH_CHARS:
                split_at = para.rfind(". ", 0, MAX_PARAGRAPH_CHARS)
                if split_at == -1:
                    split_at = MAX_PARAGRAPH_CHARS
                chunks.append({
                    "content": para[:split_at + 1].strip(),
                    "chunk_type": "text",
                    "caption": "",
                    "page_start": real_page,
                    "chunk_index": len(chunks),
                })
                para = para[split_at + 1:].strip()
            if len(para) >= MIN_CONTENT_CHARS:
                chunks.append({
                    "content": para,
                    "chunk_type": "text",
                    "caption": "",
                    "page_start": real_page,
                    "chunk_index": len(chunks),
                })
    doc.close()
    return chunks
