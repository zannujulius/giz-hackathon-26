"""
Main RAG pipeline:
  user query
    → rewrite query
    → parallel: Supabase hybrid search + Tavily web search
    → merge & rank
    → LLM generates grounded answer with citations (+ optional chart)
    → store Q&A + conversation for history
    → return response
"""
import asyncio
import time
import uuid
from models.schemas import ChatRequest, ChatResponse, ChartData
from core.query_rewriter import rewrite_query
from core.retriever import retrieve_parallel
from core.ranker import merge_and_rank
from core.generator import generate_answer
from db.supabase_client import get_supabase
from config import get_settings
import structlog

log = structlog.get_logger()

HISTORY_TURNS = 5   # number of past Q&A pairs to pass to LLM as context


async def _fetch_history(conversation_id: str) -> list[dict]:
    """Return last N Q&A turns for a conversation as [{role, content}] pairs."""
    try:
        supabase = get_supabase()
        loop = asyncio.get_event_loop()
        rows = await loop.run_in_executor(
            None,
            lambda: supabase.table("chat_analytics")
                .select("original_query, answer")
                .eq("conversation_id", conversation_id)
                .order("created_at", desc=False)
                .limit(HISTORY_TURNS)
                .execute(),
        )
        history = []
        for row in (rows.data or []):
            history.append({"role": "user", "content": row["original_query"]})
            history.append({"role": "assistant", "content": row["answer"]})
        return history
    except Exception as exc:
        log.warning("fetch_history_failed", error=str(exc))
        return []


async def _upsert_conversation(conversation_id: str, title: str) -> None:
    """Create or update the conversation record (fire-and-forget)."""
    try:
        supabase = get_supabase()
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            lambda: supabase.table("conversations").upsert({
                "id": conversation_id,
                "title": title,
                "updated_at": "now()",
            }, on_conflict="id").execute(),
        )
    except Exception as exc:
        log.warning("upsert_conversation_failed", error=str(exc))


async def _store_analytics(
    conversation_id: str,
    original_query: str,
    rewritten_query: str,
    answer: str,
    sources: list,
    chart_data: ChartData | None,
    supabase_hits: int,
    tavily_hits: int,
    latency_ms: int,
    model: str,
) -> None:
    """Fire-and-forget: store Q&A pair to Supabase for analytics + history."""
    try:
        supabase = get_supabase()
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            lambda: supabase.table("chat_analytics").insert({
                "conversation_id": conversation_id,
                "original_query": original_query,
                "rewritten_query": rewritten_query,
                "answer": answer,
                "sources": [s.model_dump() for s in sources],
                "chart_data": chart_data.model_dump() if chart_data else None,
                "supabase_hits": supabase_hits,
                "tavily_hits": tavily_hits,
                "latency_ms": latency_ms,
                "model": model,
            }).execute(),
        )
    except Exception as exc:
        log.warning("analytics_store_failed", error=str(exc))


async def run_pipeline(request: ChatRequest) -> ChatResponse:
    t_start = time.monotonic()
    settings = get_settings()

    is_new = request.conversation_id is None
    conversation_id = request.conversation_id or str(uuid.uuid4())

    log.info("pipeline_start", query=request.query, conversation_id=conversation_id)

    # Step 1: Fetch conversation history (if continuing an existing conversation)
    history = []
    if not is_new:
        history = await _fetch_history(conversation_id)

    # Step 2: Rewrite query
    rewritten = await rewrite_query(request.query)

    # Step 3: Parallel retrieval
    supabase_chunks, tavily_chunks = await retrieve_parallel(
        rewritten,
        supabase_count=settings.supabase_match_count,
        tavily_count=settings.tavily_max_results,
    )

    # Step 4: Merge & rank
    ranked = merge_and_rank(
        supabase_chunks,
        tavily_chunks,
        top_k=request.top_k or settings.rerank_top_k,
    )

    # Step 5: Generate answer (returns text + optional chart data)
    answer, chart_data = await generate_answer(
        request.query, rewritten, ranked, history=history
    )

    latency_ms = int((time.monotonic() - t_start) * 1000)
    sources = [c.to_source() for c in ranked]

    log.info(
        "pipeline_complete",
        latency_ms=latency_ms,
        supabase_hits=len(supabase_chunks),
        tavily_hits=len(tavily_chunks),
        ranked_count=len(ranked),
        has_chart=chart_data is not None,
    )

    # Step 6: Persist conversation + analytics (fire-and-forget)
    title = request.query[:80] + ("…" if len(request.query) > 80 else "")
    asyncio.create_task(_upsert_conversation(conversation_id, title))
    asyncio.create_task(
        _store_analytics(
            conversation_id=conversation_id,
            original_query=request.query,
            rewritten_query=rewritten,
            answer=answer,
            sources=sources,
            chart_data=chart_data,
            supabase_hits=len(supabase_chunks),
            tavily_hits=len(tavily_chunks),
            latency_ms=latency_ms,
            model=settings.generation_model,
        )
    )

    return ChatResponse(
        answer=answer,
        sources=sources,
        conversation_id=conversation_id,
        rewritten_query=rewritten,
        latency_ms=latency_ms,
        chart_data=chart_data,
    )
