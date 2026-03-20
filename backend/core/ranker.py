"""
Ranker: merges Supabase + Tavily results, deduplicates,
and produces a ranked shortlist for the LLM.

Scoring weights:
  - Supabase vector chunks: similarity score from hybrid_search (0-1)
  - Tavily web results: normalised Tavily score, slightly down-weighted
    (web = supplementary, not primary source)
  - Recency boost: chunks with a year in metadata get a small boost
  - Deduplication: near-identical content (>85% char overlap) is merged
"""
import re
from models.schemas import RetrievedChunk

# Source-type weights
SUPABASE_WEIGHT = 1.0
TAVILY_WEIGHT = 0.75


def _normalise_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower().strip())


def _overlap_ratio(a: str, b: str) -> float:
    """Simple character bigram overlap for near-duplicate detection."""
    def bigrams(s: str) -> set:
        return {s[i:i+2] for i in range(len(s) - 1)}
    bg_a, bg_b = bigrams(a[:500]), bigrams(b[:500])
    if not bg_a or not bg_b:
        return 0.0
    return len(bg_a & bg_b) / max(len(bg_a), len(bg_b))


def _recency_boost(chunk: RetrievedChunk) -> float:
    """Small boost for chunks that reference recent years."""
    content = chunk.content + str(chunk.metadata)
    years = re.findall(r"\b(202[0-9]|201[5-9])\b", content)
    return 0.05 if years else 0.0


def merge_and_rank(
    supabase_chunks: list[RetrievedChunk],
    tavily_chunks: list[RetrievedChunk],
    top_k: int = 6,
) -> list[RetrievedChunk]:
    # Apply source weights
    for c in supabase_chunks:
        c.similarity = round(c.similarity * SUPABASE_WEIGHT + _recency_boost(c), 4)
    for c in tavily_chunks:
        c.similarity = round(c.similarity * TAVILY_WEIGHT + _recency_boost(c), 4)

    all_chunks = supabase_chunks + tavily_chunks

    # Sort descending
    all_chunks.sort(key=lambda c: c.similarity, reverse=True)

    # Deduplicate: skip any chunk that is >85% similar to an already-kept chunk
    kept: list[RetrievedChunk] = []
    for candidate in all_chunks:
        norm = _normalise_text(candidate.content)
        is_dup = any(
            _overlap_ratio(norm, _normalise_text(k.content)) > 0.85
            for k in kept
        )
        if not is_dup:
            kept.append(candidate)
        if len(kept) >= top_k:
            break

    return kept
