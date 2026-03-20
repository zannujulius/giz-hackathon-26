"""
Ingestion script: processes all PDFs in pdfs_for_vecDB/,
applies the right chunking strategy per document type,
generates embeddings, and upserts into Supabase.

Usage (from backend/ folder):
    python -m ingestion.ingest

Doc-type classification by filename:
  stats   → Gender_Statistics_Profile_*, The_State_of_Gender_*, The_2024_Global_*
  legal   → Law_*, The_Law_*, Ministerial_*, UN -*
  policy  → *_Policy_*, *_Strategy_*, *_Guidelines_*, *_Guidlines_*, *_Guideline_*
  news    → anything else
"""
import sys
import os
from pathlib import Path

# Allow imports from backend root
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
load_dotenv()

from sentence_transformers import SentenceTransformer
from tqdm import tqdm
from db.supabase_client import get_supabase
from config import get_settings
from ingestion.chunkers.policy_chunker import chunk_policy_pdf
from ingestion.chunkers.stats_chunker import chunk_stats_pdf
from ingestion.chunkers.news_chunker import chunk_news_pdf
import structlog

log = structlog.get_logger()

PDFS_DIR = Path(__file__).parent.parent.parent / "pdfs_for_vecDB"

STATS_PATTERNS   = ["gender_statistics_profile", "the_state_of_gender", "the_2024_global_gender"]
LEGAL_PATTERNS   = ["law_n", "the_law_n", "ministerial_instructions", "un -", "gazette"]
POLICY_PATTERNS  = ["_policy_", "_strategy_", "_guidelines_", "_guidlines_", "_guideline_",
                    "_mainstreaming_", "_transformative_"]


def classify_pdf(filename: str) -> str:
    name_lower = filename.lower()
    if any(p in name_lower for p in STATS_PATTERNS):
        return "stats"
    if any(p in name_lower for p in LEGAL_PATTERNS):
        return "legal"
    if any(p in name_lower for p in POLICY_PATTERNS):
        return "policy"
    return "news"


def get_chunks(pdf_path: Path, doc_type: str) -> list[dict]:
    if doc_type == "stats":
        return chunk_stats_pdf(pdf_path)
    elif doc_type in ("policy", "legal"):
        return chunk_policy_pdf(pdf_path)
    else:
        return chunk_news_pdf(pdf_path)


def run_ingestion(batch_size: int = 32):
    settings = get_settings()
    supabase = get_supabase()

    log.info("loading_embed_model", model=settings.embed_model)
    model = SentenceTransformer(settings.embed_model)

    pdf_files = sorted(PDFS_DIR.glob("*.pdf"))
    if not pdf_files:
        log.error("no_pdfs_found", path=str(PDFS_DIR))
        return

    log.info("pdfs_found", count=len(pdf_files))

    total_chunks = 0
    for pdf_path in pdf_files:
        doc_type = classify_pdf(pdf_path.name)
        log.info("processing_pdf", file=pdf_path.name, doc_type=doc_type)

        try:
            chunks = get_chunks(pdf_path, doc_type)
        except Exception as exc:
            log.error("chunking_failed", file=pdf_path.name, error=str(exc))
            continue

        if not chunks:
            log.warning("no_chunks_extracted", file=pdf_path.name)
            continue

        log.info("chunks_extracted", file=pdf_path.name, count=len(chunks))

        # Generate embeddings in batches
        texts = [c["content"] for c in chunks]
        embeddings = model.encode(
            texts,
            batch_size=batch_size,
            normalize_embeddings=True,
            show_progress_bar=False,
        )

        # Build rows for Supabase
        rows = []
        for i, (chunk, emb) in enumerate(zip(chunks, embeddings)):
            metadata = {k: v for k, v in chunk.items()
                        if k not in ("content", "chunk_index")}
            rows.append({
                "content": chunk["content"],
                "embedding": emb.tolist(),
                "doc_type": doc_type,
                "source_file": pdf_path.name,
                "chunk_index": chunk.get("chunk_index", i),
                "metadata": metadata,
            })

        # Upsert to Supabase in batches of 50
        for i in range(0, len(rows), 50):
            batch = rows[i:i+50]
            try:
                supabase.table("documents").insert(batch).execute()
            except Exception as exc:
                log.error("supabase_insert_failed", file=pdf_path.name, error=str(exc))

        total_chunks += len(chunks)
        log.info("pdf_ingested", file=pdf_path.name, chunks=len(chunks))

    log.info("ingestion_complete", total_chunks=total_chunks)
    print(f"\n✅ Ingestion complete — {total_chunks} chunks from {len(pdf_files)} PDFs.")


if __name__ == "__main__":
    run_ingestion()
