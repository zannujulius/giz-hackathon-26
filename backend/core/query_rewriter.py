"""
Query rewriter: uses a fast LLM to reformulate the user's question
into a retrieval-optimised query before fetching from DB / web.
"""
from groq import AsyncGroq
from config import get_settings
import structlog

log = structlog.get_logger()
_SYSTEM = """You are a retrieval query optimiser for a Rwanda gender data platform.
Rewrite the user's question into a concise, keyword-rich search query (max 25 words).
- Expand abbreviations (GBV → gender-based violence)
- Add relevant context terms (Rwanda, women, gender equality, province names if applicable)
- Remove conversational filler ("Can you tell me...", "I want to know...")
- Output ONLY the rewritten query — no explanation, no quotes."""


async def rewrite_query(original: str) -> str:
    settings = get_settings()
    client = AsyncGroq(api_key=settings.groq_api_key)
    try:
        resp = await client.chat.completions.create(
            model=settings.rewrite_model,
            messages=[
                {"role": "system", "content": _SYSTEM},
                {"role": "user", "content": original},
            ],
            max_tokens=60,
            temperature=0.0,
        )
        rewritten = resp.choices[0].message.content.strip()
        log.info("query_rewritten", original=original, rewritten=rewritten)
        return rewritten
    except Exception as exc:
        log.warning("query_rewrite_failed", error=str(exc))
        return original  # fallback: use original query
