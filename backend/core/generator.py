"""
Generator: builds the LLM prompt from ranked context chunks and produces a grounded
answer with inline citations [1], [2], … plus optional chart data when the question
involves comparisons, trends, or statistics extractable from the documents.
"""
import json
import re
from groq import AsyncGroq
from models.schemas import RetrievedChunk, ChartData
from config import get_settings
import structlog

log = structlog.get_logger()

_SYSTEM = """You are an expert analyst for the Rwanda Gender Data Platform — a tool that helps
civil society, researchers, journalists, and the public understand gender data in Rwanda.

Rules:
1. Answer ONLY from the provided context. Do NOT fabricate statistics or events.
2. Cite your sources inline using [1], [2], … matching the numbered context blocks.
3. If the context is insufficient to answer fully, say so clearly.
4. Be precise: quote specific numbers, years, and province names when present in context.
5. Write for a non-technical audience — clear, factual, and concise (3–6 paragraphs max).
6. If the question is about a specific province or year not in the context, say so.

VISUALIZATION RULE:
If the context contains quantitative data (percentages, counts, rates across years,
provinces, or categories) that would make the answer clearer as a chart, extract those
numbers and append a <chart> block AFTER your text answer.

The <chart> block must be valid JSON with this exact structure:
<chart>
{
  "chart_type": "bar" | "line" | "pie",
  "title": "Short descriptive chart title",
  "x_label": "X axis label",
  "y_label": "Y axis label (with unit, e.g. Percentage (%))",
  "data": [
    {"name": "Category or Year", "value": 42.5},
    ...
  ],
  "series": [
    {"key": "value", "label": "Series label", "color": "#4f86c6"}
  ]
}
</chart>

Use chart_type:
- "bar" for comparisons across categories/provinces
- "line" for trends over time (use "year" as name field)
- "pie" for proportional breakdowns (rarely)

Only include a <chart> block if you have at least 3 concrete data points from the context.
If you cannot produce a chart from the context, omit the <chart> block entirely."""


def _build_context_block(chunks: list[RetrievedChunk]) -> str:
    blocks = []
    for i, chunk in enumerate(chunks, start=1):
        source_label = chunk.source_file.replace(".pdf", "").replace("_", " ").title()
        if chunk.doc_type == "web":
            source_label = f"Web: {chunk.source_file}"
        blocks.append(f"[{i}] Source: {source_label}\n{chunk.content.strip()}")
    return "\n\n---\n\n".join(blocks)


def _parse_chart(raw: str) -> tuple[str, ChartData | None]:
    """Extract <chart>...</chart> block from LLM output. Returns (clean_text, chart_data)."""
    match = re.search(r"<chart>\s*(\{.*?\})\s*</chart>", raw, re.DOTALL)
    if not match:
        return raw.strip(), None
    clean_text = (raw[:match.start()] + raw[match.end():]).strip()
    try:
        payload = json.loads(match.group(1))
        chart = ChartData(
            chart_type=payload.get("chart_type", "bar"),
            title=payload.get("title", ""),
            x_label=payload.get("x_label", ""),
            y_label=payload.get("y_label", ""),
            data=payload.get("data", []),
            series=payload.get("series", [{"key": "value", "label": "Value", "color": "#4f86c6"}]),
        )
        return clean_text, chart
    except Exception as exc:
        log.warning("chart_parse_failed", error=str(exc))
        return clean_text, None


async def generate_answer(
    original_query: str,
    rewritten_query: str,
    context_chunks: list[RetrievedChunk],
    history: list[dict] | None = None,
) -> tuple[str, ChartData | None]:
    if not context_chunks:
        return (
            "I could not find relevant information in the available gender data sources "
            "to answer your question. Try rephrasing or exploring the Data Catalog for "
            "related publications.",
            None,
        )

    settings = get_settings()
    client = AsyncGroq(api_key=settings.groq_api_key)

    context_block = _build_context_block(context_chunks)

    # Build message list: system → past turns (history) → current question
    messages = [{"role": "system", "content": _SYSTEM}]

    # Inject previous conversation turns so LLM can reference earlier answers
    if history:
        messages.extend(history)

    user_message = f"""User question: {original_query}

Context ({len(context_chunks)} sources):

{context_block}

Answer the question using the context above. Cite each source as [number].
If the context contains enough quantitative data for a chart, append a <chart> block."""

    messages.append({"role": "user", "content": user_message})

    try:
        resp = await client.chat.completions.create(
            model=settings.generation_model,
            messages=messages,
            max_tokens=1500,
            temperature=0.1,
        )
        raw = resp.choices[0].message.content.strip()
        answer, chart_data = _parse_chart(raw)
        log.info(
            "answer_generated",
            query=rewritten_query,
            tokens=resp.usage.total_tokens,
            has_chart=chart_data is not None,
        )
        return answer, chart_data

    except Exception as exc:
        log.error("generation_failed", error=str(exc))
        return "An error occurred while generating the answer. Please try again.", None
