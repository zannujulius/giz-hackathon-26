"""
Policy / Legal PDF chunker.
Strategy: chunk by section heading, preserving full sections as one chunk.
These documents have clear hierarchical numbering (1., 1.1, Chapter X, Article X).
"""
import re
import fitz  # PyMuPDF
from pathlib import Path

# Patterns that mark a new section heading
_HEADING_PATTERNS = [
    re.compile(r"^(CHAPTER|SECTION|ARTICLE|PART)\s+[IVXLCDM\d]+", re.IGNORECASE),
    re.compile(r"^\d+\.\s+[A-Z]"),           # 1. Title
    re.compile(r"^\d+\.\d+\s+[A-Z]"),        # 1.1 Title
    re.compile(r"^[A-Z][A-Z\s]{4,}$"),        # ALL CAPS heading (min 5 chars)
]

MAX_CHUNK_CHARS = 3000   # hard cap — split at sentence if exceeded
MIN_CHUNK_CHARS = 80     # discard tiny fragments


def _is_heading(line: str) -> bool:
    line = line.strip()
    if len(line) < 3 or len(line) > 120:
        return False
    return any(p.match(line) for p in _HEADING_PATTERNS)


def chunk_policy_pdf(pdf_path: Path) -> list[dict]:
    """
    Returns list of dicts:
      { content, section_heading, page_start, chunk_index }
    """
    doc = fitz.open(str(pdf_path))

    # Extract raw text with page info
    pages_text: list[tuple[int, str]] = []
    for page_num in range(len(doc)):
        text = doc[page_num].get_text("text")
        pages_text.append((page_num + 1, text))
    doc.close()

    # Split into lines across pages
    lines: list[tuple[int, str]] = []
    for page_num, text in pages_text:
        for line in text.split("\n"):
            stripped = line.strip()
            if stripped:
                lines.append((page_num, stripped))

    # Group lines under section headings
    chunks: list[dict] = []
    current_heading = "Introduction"
    current_lines: list[str] = []
    current_page = 1

    def flush(heading: str, body_lines: list[str], page: int, idx: int):
        content = "\n".join(body_lines).strip()
        if len(content) < MIN_CHUNK_CHARS:
            return
        # Hard-cap: split at MAX_CHUNK_CHARS on sentence boundary
        while len(content) > MAX_CHUNK_CHARS:
            split_at = content.rfind(". ", 0, MAX_CHUNK_CHARS)
            if split_at == -1:
                split_at = MAX_CHUNK_CHARS
            chunks.append({
                "content": content[:split_at + 1].strip(),
                "section_heading": heading,
                "page_start": page,
                "chunk_index": idx,
            })
            content = content[split_at + 1:].strip()
            idx += 1
        if len(content) >= MIN_CHUNK_CHARS:
            chunks.append({
                "content": content,
                "section_heading": heading,
                "page_start": page,
                "chunk_index": idx,
            })

    chunk_idx = 0
    for page_num, line in lines:
        if _is_heading(line):
            flush(current_heading, current_lines, current_page, chunk_idx)
            chunk_idx = len(chunks)
            current_heading = line
            current_lines = []
            current_page = page_num
        else:
            current_lines.append(line)

    flush(current_heading, current_lines, current_page, chunk_idx)
    return chunks
