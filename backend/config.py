from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Groq
    groq_api_key: str

    # Supabase
    supabase_url: str
    supabase_service_key: str

    # Tavily
    tavily_api_key: str

    # App
    environment: str = "development"
    log_level: str = "INFO"
    frontend_url: str = "http://localhost:5173"

    # Models
    rewrite_model: str = "llama-3.1-8b-instant"
    generation_model: str = "llama-3.3-70b-versatile"
    embed_model: str = "all-MiniLM-L6-v2"

    # Retrieval
    supabase_match_count: int = 8
    tavily_max_results: int = 5
    rerank_top_k: int = 6


@lru_cache
def get_settings() -> Settings:
    return Settings()
