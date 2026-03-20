"""
Retriever: parallel fetch from Supabase (hybrid vector+keyword)
and Tavily (web search with Rwanda context + domain filtering).
Both run concurrently via asyncio.gather for minimum latency.
"""
import asyncio
from typing import Optional
from sentence_transformers import SentenceTransformer
from tavily import AsyncTavilyClient
from db.supabase_client import get_supabase
from models.schemas import RetrievedChunk
from config import get_settings
import structlog

log = structlog.get_logger()

# Domain whitelist: trusted sources for Rwanda gender data
TRUSTED_DOMAINS = [
    "migeprof.gov.rw",
    "minagri.gov.rw",
    "minaloc.gov.rw",
    "mifotra.gov.rw",
    "minict.gov.rw",
    "minijust.gov.rw",
    "minisports.gov.rw",
    "gmo.gov.rw",
    "statistics.gov.rw",
    "nisr.gov.rw",
    "unhcr.org",
    "unwomen.org",
    "unfpa.org",
    "who.int",
    "worldbank.org",
]

_embed_model: Optional[SentenceTransformer] = None


def get_embed_model() -> SentenceTransformer:
    global _embed_model
    if _embed_model is None:
        settings = get_settings()
        _embed_model = SentenceTransformer(settings.embed_model)
    return _embed_model


async def fetch_from_supabase(
    query: str,
    match_count: int = 8,
) -> list[RetrievedChunk]:
    """Hybrid vector + full-text search via Supabase RPC."""
    try:
        model = get_embed_model()
        embedding = model.encode(query, normalize_embeddings=True).tolist()

        supabase = get_supabase()
        # Run in thread pool since supabase-py is synchronous
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            lambda: supabase.rpc(
                "hybrid_search",
                {
                    "query_embedding": embedding,
                    "query_text": query,
                    "match_count": match_count,
                },
            ).execute(),
        )

        chunks = []
        for row in (result.data or []):
            chunks.append(
                RetrievedChunk(
                    content=row["content"],
                    source_file=row.get("source_file", ""),
                    doc_type=row.get("doc_type", "unknown"),
                    similarity=float(row.get("similarity", 0.0)),
                    metadata=row.get("metadata") or {},
                )
            )

        log.info("supabase_retrieved", count=len(chunks))
        return chunks

    except Exception as exc:
        log.error("supabase_retrieval_failed", error=str(exc))
        return []


async def fetch_from_tavily(query: str, max_results: int = 5) -> list[RetrievedChunk]:
    """Web search via Tavily, prefixed with 'Rwanda' + domain-filtered."""
    settings = get_settings()
    try:
        client = AsyncTavilyClient(api_key=settings.tavily_api_key)
        rwanda_query = f"Rwanda gender {query}"

        response = await client.search(
            query=rwanda_query,
            search_depth="advanced",
            max_results=max_results,
            include_domains=TRUSTED_DOMAINS,
            include_answer=False,
        )

        chunks = []
        for item in response.get("results", []):
            content = item.get("content", "").strip()
            if not content:
                continue
            chunks.append(
                RetrievedChunk(
                    content=content,
                    source_file=item.get("title", "Web result"),
                    doc_type="web",
                    similarity=float(item.get("score", 0.5)),
                    metadata={"url": item.get("url", "")},
                    url=item.get("url"),
                )
            )

        log.info("tavily_retrieved", count=len(chunks))
        return chunks

    except Exception as exc:
        log.error("tavily_retrieval_failed", error=str(exc))
        return []


async def retrieve_parallel(
    query: str,
    supabase_count: int = 8,
    tavily_count: int = 5,
) -> tuple[list[RetrievedChunk], list[RetrievedChunk]]:
    """Run Supabase and Tavily fetches in parallel."""
    supabase_results, tavily_results = await asyncio.gather(
        fetch_from_supabase(query, supabase_count),
        fetch_from_tavily(query, tavily_count),
        return_exceptions=False,
    )
    return supabase_results, tavily_results
