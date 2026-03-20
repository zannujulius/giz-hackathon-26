"""
News / general PDF chunker.
Strategy: paragraph-level chunking.
News articles are short and already well-structured by paragraphs.
"""
import re
import fitz
from pathlib import Path

MIN_PARAGRAPH_CHARS = 100
MAX_PARAGRAPH_CHARS = 800


def chunk_news_pdf(pdf_path: Path) -> list[dict]:
    """
    Returns list of dicts:
      { content, page_start, chunk_index }
    """
    doc = fitz.open(str(pdf_path))
    chunks: list[dict] = []

    for page_num in range(len(doc)):
        text = doc[page_num].get_text("text")
        # Split on double newlines (paragraph breaks)
        paragraphs = re.split(r"\n{2,}", text)

        for para in paragraphs:
            para = para.strip()
            if len(para) < MIN_PARAGRAPH_CHARS:
                continue
            # Split long paragraphs at sentence boundary
            while len(para) > MAX_PARAGRAPH_CHARS:
                split_at = para.rfind(". ", 0, MAX_PARAGRAPH_CHARS)
                if split_at == -1:
                    split_at = MAX_PARAGRAPH_CHARS
                chunks.append({
                    "content": para[:split_at + 1].strip(),
                    "page_start": page_num + 1,
                    "chunk_index": len(chunks),
                })
                para = para[split_at + 1:].strip()
            if len(para) >= MIN_PARAGRAPH_CHARS:
                chunks.append({
                    "content": para,
                    "page_start": page_num + 1,
                    "chunk_index": len(chunks),
                })

    doc.close()
    return chunks
