from pydantic import BaseModel, Field
from typing import Optional
import uuid


class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=4000)
    conversation_id: Optional[str] = None
    top_k: int = Field(default=6, ge=1, le=20)


class Source(BaseModel):
    title: str
    content_snippet: str
    source_file: str
    doc_type: str
    page_start: int = 0
    url: Optional[str] = None
    score: float


class ChartSeries(BaseModel):
    key: str
    label: str
    color: str = "#4f86c6"


class ChartData(BaseModel):
    chart_type: str          # "bar" | "line" | "pie"
    title: str
    x_label: str = ""
    y_label: str = ""
    data: list[dict]         # [{"name": "...", "value": 42.5, ...}]
    series: list[ChartSeries] = []


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]
    conversation_id: str
    rewritten_query: str
    latency_ms: int
    chart_data: Optional[ChartData] = None


class ConversationSummary(BaseModel):
    id: str
    title: str
    created_at: str
    updated_at: str
    message_count: int = 0


class ConversationMessage(BaseModel):
    role: str           # "user" | "assistant"
    content: str
    created_at: str
    sources: list[Source] = []
    chart_data: Optional[ChartData] = None


class HealthResponse(BaseModel):
    status: str
    environment: str


# Internal pipeline types
class RetrievedChunk(BaseModel):
    content: str
    source_file: str
    doc_type: str
    similarity: float
    metadata: dict = {}
    url: Optional[str] = None

    def to_source(self) -> Source:
        excerpt = self.content[:300] + "..." if len(self.content) > 300 else self.content
        title = (
            self.metadata.get("section_heading")
            or self.metadata.get("caption")
            or self.source_file.replace("_", " ").replace(".pdf", "").title()
        )
        return Source(
            title=title,
            content_snippet=excerpt,
            source_file=self.source_file,
            doc_type=self.doc_type,
            page_start=self.metadata.get("page_start", 0),
            url=self.url,
            score=round(self.similarity, 3),
        )
