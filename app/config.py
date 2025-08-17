import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Environment
    environment: str = "development"
    debug: bool = True
    
    # Database
    database_url: str = "sqlite:///./ppc.db"
    database_name: str = "ppc.db"
    
    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_reload: bool = True
    
    # CORS
    allowed_origins: List[str] = [
        "http://127.0.0.1:8000",
        "http://localhost:8000", 
        "http://localhost:5173",
        "http://localhost:3000"
    ]
    
    # Pagination
    default_page_size: int = 10
    max_page_size: int = 100
    
    # Cache
    cache_ttl: int = 300
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()