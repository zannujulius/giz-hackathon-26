-- ─────────────────────────────────────────────────────────────────────────────
-- Rwanda Gender Data Platform — Supabase Schema
-- Run this once in the Supabase SQL editor before ingestion.
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ── Documents (chunk store) ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content         TEXT        NOT NULL,
    embedding       VECTOR(384),              -- matches all-MiniLM-L6-v2 output dim
    doc_type        TEXT        NOT NULL,     -- 'policy' | 'legal' | 'stats' | 'news'
    source_file     TEXT        NOT NULL,
    chunk_index     INTEGER     NOT NULL,
    metadata        JSONB       DEFAULT '{}', -- section_heading, table_caption, page, etc.
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Vector similarity index (IVFFlat — fast for ~100k chunks)
CREATE INDEX IF NOT EXISTS documents_embedding_idx
    ON documents USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- Full-text search index for keyword retrieval
CREATE INDEX IF NOT EXISTS documents_content_fts
    ON documents USING gin (to_tsvector('english', content));

-- ── Conversations (one row per chat session) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
    id          TEXT        PRIMARY KEY,          -- UUID string
    title       TEXT        NOT NULL,             -- first user question (truncated)
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS conversations_updated_idx
    ON conversations (updated_at DESC);

-- ── Chat analytics ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_analytics (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id     TEXT        NOT NULL,
    original_query      TEXT        NOT NULL,
    rewritten_query     TEXT,
    answer              TEXT        NOT NULL,
    sources             JSONB       DEFAULT '[]',
    supabase_hits       INTEGER     DEFAULT 0,
    tavily_hits         INTEGER     DEFAULT 0,
    latency_ms          INTEGER,
    model               TEXT,
    chart_data          JSONB       DEFAULT NULL,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chat_analytics_conversation_idx
    ON chat_analytics (conversation_id);
CREATE INDEX IF NOT EXISTS chat_analytics_created_idx
    ON chat_analytics (created_at DESC);

-- ── Hybrid search RPC ─────────────────────────────────────────────────────────
-- Combines vector cosine similarity (70%) + BM25/full-text (30%)
CREATE OR REPLACE FUNCTION hybrid_search(
    query_embedding  VECTOR(384),
    query_text       TEXT,
    match_count      INTEGER DEFAULT 8,
    doc_type_filter  TEXT    DEFAULT NULL   -- optional: filter by doc_type
)
RETURNS TABLE (
    id          UUID,
    content     TEXT,
    metadata    JSONB,
    source_file TEXT,
    doc_type    TEXT,
    similarity  FLOAT
)
LANGUAGE SQL STABLE
AS $$
    WITH vector_hits AS (
        SELECT
            id,
            content,
            metadata,
            source_file,
            doc_type,
            1 - (embedding <=> query_embedding) AS vec_score
        FROM documents
        WHERE (doc_type_filter IS NULL OR doc_type = doc_type_filter)
        ORDER BY embedding <=> query_embedding
        LIMIT match_count * 2
    ),
    text_hits AS (
        SELECT
            id,
            content,
            metadata,
            source_file,
            doc_type,
            ts_rank_cd(
                to_tsvector('english', content),
                plainto_tsquery('english', query_text),
                32  -- normalization: divide by document length
            ) AS text_score
        FROM documents
        WHERE
            (doc_type_filter IS NULL OR doc_type = doc_type_filter)
            AND to_tsvector('english', content) @@ plainto_tsquery('english', query_text)
        LIMIT match_count * 2
    ),
    combined AS (
        SELECT
            COALESCE(v.id, t.id)              AS id,
            COALESCE(v.content, t.content)    AS content,
            COALESCE(v.metadata, t.metadata)  AS metadata,
            COALESCE(v.source_file, t.source_file) AS source_file,
            COALESCE(v.doc_type, t.doc_type)  AS doc_type,
            COALESCE(v.vec_score, 0.0) * 0.7  +
            COALESCE(t.text_score, 0.0) * 0.3 AS similarity
        FROM vector_hits v
        FULL OUTER JOIN text_hits t ON v.id = t.id
    )
    SELECT DISTINCT ON (id) id, content, metadata, source_file, doc_type, similarity
    FROM combined
    ORDER BY id, similarity DESC
    LIMIT match_count;
$$;
