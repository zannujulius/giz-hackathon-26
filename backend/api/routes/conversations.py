"""
Conversation history endpoints.
  GET  /api/conversations          → list all conversations (newest first)
  GET  /api/conversations/{id}     → get all messages in a conversation
  DELETE /api/conversations/{id}   → delete conversation + its messages
"""
import asyncio
from fastapi import APIRouter, HTTPException
from db.supabase_client import get_supabase
from models.schemas import ConversationSummary, ConversationMessage, Source, ChartData
import structlog

log = structlog.get_logger()
router = APIRouter()


@router.get("/conversations", response_model=list[ConversationSummary])
async def list_conversations():
    try:
        supabase = get_supabase()
        loop = asyncio.get_event_loop()

        # Fetch conversations with message counts
        convs = await loop.run_in_executor(
            None,
            lambda: supabase.table("conversations")
                .select("id, title, created_at, updated_at")
                .order("updated_at", desc=True)
                .limit(50)
                .execute(),
        )

        if not convs.data:
            return []

        # Fetch message counts per conversation
        ids = [c["id"] for c in convs.data]
        counts_resp = await loop.run_in_executor(
            None,
            lambda: supabase.table("chat_analytics")
                .select("conversation_id")
                .in_("conversation_id", ids)
                .execute(),
        )
        count_map: dict[str, int] = {}
        for row in (counts_resp.data or []):
            cid = row["conversation_id"]
            count_map[cid] = count_map.get(cid, 0) + 1

        return [
            ConversationSummary(
                id=c["id"],
                title=c["title"],
                created_at=c["created_at"],
                updated_at=c["updated_at"],
                message_count=count_map.get(c["id"], 0),
            )
            for c in convs.data
        ]

    except Exception as exc:
        log.error("list_conversations_failed", error=str(exc))
        raise HTTPException(status_code=500, detail="Failed to load conversations.")


@router.get("/conversations/{conversation_id}", response_model=list[ConversationMessage])
async def get_conversation(conversation_id: str):
    try:
        supabase = get_supabase()
        loop = asyncio.get_event_loop()

        rows = await loop.run_in_executor(
            None,
            lambda: supabase.table("chat_analytics")
                .select("original_query, answer, sources, chart_data, created_at")
                .eq("conversation_id", conversation_id)
                .order("created_at", desc=False)
                .execute(),
        )

        if not rows.data:
            raise HTTPException(status_code=404, detail="Conversation not found.")

        messages: list[ConversationMessage] = []
        for row in rows.data:
            # User message
            messages.append(ConversationMessage(
                role="user",
                content=row["original_query"],
                created_at=row["created_at"],
            ))
            # Assistant message
            raw_sources = row.get("sources") or []
            sources = []
            for s in raw_sources:
                try:
                    sources.append(Source(**s))
                except Exception:
                    pass

            chart_data = None
            if row.get("chart_data"):
                try:
                    chart_data = ChartData(**row["chart_data"])
                except Exception:
                    pass

            messages.append(ConversationMessage(
                role="assistant",
                content=row["answer"],
                created_at=row["created_at"],
                sources=sources,
                chart_data=chart_data,
            ))

        return messages

    except HTTPException:
        raise
    except Exception as exc:
        log.error("get_conversation_failed", error=str(exc))
        raise HTTPException(status_code=500, detail="Failed to load conversation.")


@router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    try:
        supabase = get_supabase()
        loop = asyncio.get_event_loop()

        await loop.run_in_executor(
            None,
            lambda: supabase.table("chat_analytics")
                .delete()
                .eq("conversation_id", conversation_id)
                .execute(),
        )
        await loop.run_in_executor(
            None,
            lambda: supabase.table("conversations")
                .delete()
                .eq("id", conversation_id)
                .execute(),
        )
        return {"success": True}

    except Exception as exc:
        log.error("delete_conversation_failed", error=str(exc))
        raise HTTPException(status_code=500, detail="Failed to delete conversation.")
