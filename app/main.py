from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import logging
import sys
from contextlib import asynccontextmanager

from app.config import settings
from app.routers import papers, analytics, health

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.debug else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("app.log") if settings.environment == "production" else logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    logger.info("🚀 Starting PPC Backend API")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Debug mode: {settings.debug}")
    yield
    logger.info("🛑 Shutting down PPC Backend API")

# Create FastAPI app
app = FastAPI(
    title="PPC Research Papers API",
    description="API for managing and analyzing research papers data",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None
)

# Add security middleware
if settings.environment == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*"]  # Configure this properly for production
    )

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(papers.router)
app.include_router(analytics.router)

# Legacy endpoints for backward compatibility
@app.get("/country-data")
def legacy_country_data():
    """Legacy endpoint - redirects to new analytics endpoint"""
    from fastapi import Request
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/api/analytics/country-data")

@app.get("/papers")
def legacy_papers():
    """Legacy endpoint - redirects to new papers endpoint"""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/api/papers/")

@app.get("/search")
def legacy_search():
    """Legacy endpoint - redirects to new papers search endpoint"""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/api/papers/search")

@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "PPC Research Papers API",
        "version": "2.0.0",
        "docs": "/docs" if settings.debug else "Documentation disabled in production",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.api_reload and settings.debug,
        log_level="info"
    )