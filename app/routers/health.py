from fastapi import APIRouter, Depends
from datetime import datetime
from app.database import db_manager
from app.models import HealthResponse

router = APIRouter(prefix="/api/health", tags=["health"])

@router.get("/", response_model=HealthResponse)
def health_check():
    """Health check endpoint"""
    db_status = db_manager.health_check()
    
    return HealthResponse(
        status="healthy" if db_status else "unhealthy",
        database=db_status,
        timestamp=datetime.now()
    )