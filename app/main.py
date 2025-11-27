from fastapi import FastAPI, Request, Depends, Query
from fastapi.responses import JSONResponse
import sqlite3
import pandas as pd
from app.database import get_db_connection
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import logging
import sys
from contextlib import asynccontextmanager
import time
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import settings
from app.routers import papers, analytics, health, authors, subjects, advanced_analytics

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

class PerformanceMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        
        # Log slow requests
        if process_time > 1.0:  # Log requests taking more than 1 second
            logger.warning(f"Slow request: {request.method} {request.url.path} took {process_time:.3f}s")
        elif process_time > 0.5:  # Log requests taking more than 0.5 seconds
            logger.info(f"Moderate request: {request.method} {request.url.path} took {process_time:.3f}s")
        
        return response

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

# Add performance monitoring middleware
app.add_middleware(PerformanceMiddleware)

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
app.include_router(authors.router)
app.include_router(subjects.router)
app.include_router(advanced_analytics.router)

# Legacy endpoints for backward compatibility
@app.get("/country-data")
def legacy_country_data(conn: sqlite3.Connection = Depends(get_db_connection)):
    """Legacy endpoint - return country data directly for map.html"""
    try:
        query = """
            SELECT country_name, strftime('%Y', preprint_submission_date) as year, COUNT(*) as count 
            FROM papers 
            WHERE country_name IS NOT NULL AND preprint_submission_date IS NOT NULL
            GROUP BY country_name, year
            ORDER BY year, country_name
        """
        df = pd.read_sql_query(query, conn)
        return JSONResponse(content={"data": df.to_dict("records")})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/analytics-data")
def legacy_analytics_data(conn: sqlite3.Connection = Depends(get_db_connection)):
    """Legacy endpoint - return analytics dashboard data directly"""
    try:
        timeline_query = """
            SELECT strftime('%Y-%m', preprint_submission_date) as month,
                   COUNT(*) as submissions
            FROM papers 
            WHERE preprint_submission_date IS NOT NULL
            GROUP BY strftime('%Y-%m', preprint_submission_date)
            ORDER BY month
        """
        timeline_df = pd.read_sql_query(timeline_query, conn)

        subject_query = """
            SELECT preprint_subject as subject,
                   COUNT(*) as count,
                   ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM papers WHERE preprint_subject IS NOT NULL), 1) as percentage
            FROM papers 
            WHERE preprint_subject IS NOT NULL 
            AND preprint_subject != ''
            GROUP BY preprint_subject
            ORDER BY count DESC
            LIMIT 10
        """
        subject_df = pd.read_sql_query(subject_query, conn)

        server_query = """
            SELECT preprint_server as server,
                   COUNT(*) as count
            FROM papers 
            WHERE preprint_server IS NOT NULL 
            AND preprint_server != ''
            GROUP BY preprint_server
            ORDER BY count DESC
        """
        server_df = pd.read_sql_query(server_query, conn)
        total_papers = server_df['count'].sum()
        if total_papers > 0:
            server_df['percentage'] = round(server_df['count'] * 100.0 / total_papers, 1)

        stats_query = """
            SELECT 
                COUNT(*) as total_papers,
                MIN(preprint_submission_date) as earliest_date,
                MAX(preprint_submission_date) as latest_date,
                COUNT(DISTINCT preprint_subject) as active_subjects
            FROM papers 
            WHERE preprint_submission_date IS NOT NULL
        """
        stats_df = pd.read_sql_query(stats_query, conn)

        most_active_query = """
            SELECT strftime('%Y-%m', preprint_submission_date) as period,
                   COUNT(*) as count
            FROM papers 
            WHERE preprint_submission_date IS NOT NULL
            GROUP BY strftime('%Y-%m', preprint_submission_date)
            ORDER BY count DESC
            LIMIT 1
        """
        most_active_df = pd.read_sql_query(most_active_query, conn)

        avg_query = """
            SELECT AVG(monthly_count) as avg_papers_per_month
            FROM (
                SELECT COUNT(*) as monthly_count
                FROM papers 
                WHERE preprint_submission_date IS NOT NULL
                GROUP BY strftime('%Y-%m', preprint_submission_date)
            )
        """
        avg_df = pd.read_sql_query(avg_query, conn)

        response_data = {
            "timelineData": timeline_df.to_dict("records"),
            "subjectData": subject_df.to_dict("records"),
            "serverData": server_df.to_dict("records"),
            "statisticsData": {
                "totalPapers": int(stats_df.iloc[0]['total_papers']) if not stats_df.empty else 0,
                "dateRange": {
                    "startDate": stats_df.iloc[0]['earliest_date'] if not stats_df.empty else None,
                    "endDate": stats_df.iloc[0]['latest_date'] if not stats_df.empty else None
                },
                "mostActivePeriod": {
                    "period": most_active_df.iloc[0]['period'] if not most_active_df.empty else "N/A",
                    "count": int(most_active_df.iloc[0]['count']) if not most_active_df.empty else 0
                },
                "averagePapersPerMonth": int(avg_df.iloc[0]['avg_papers_per_month']) if not avg_df.empty else 0,
                "activeSubjects": int(stats_df.iloc[0]['active_subjects']) if not stats_df.empty else 0,
                "activeServers": int(len(server_df) if server_df is not None else 0)
            },
            "metadata": {
                "lastUpdated": pd.Timestamp.now().isoformat(),
                "totalRecords": int(stats_df.iloc[0]['total_papers']) if not stats_df.empty else 0
            }
        }
        return JSONResponse(content=response_data)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/subjects")
def legacy_subjects(conn: sqlite3.Connection = Depends(get_db_connection)):
    """Legacy endpoint - return subjects directly for FilterControls consumption"""
    try:
        query = """
            SELECT DISTINCT preprint_subject
            FROM papers 
            WHERE preprint_subject IS NOT NULL 
            AND preprint_subject != ''
            ORDER BY preprint_subject
        """
        df = pd.read_sql_query(query, conn)
        subjects = df['preprint_subject'].tolist()
        return JSONResponse(content={"data": subjects})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/citation-data-unified")
def legacy_citation_data_unified(
    time_range: str = Query("all"),
    subject: str = Query(None),
    limit: int = Query(10, ge=1, le=100),
    sort_by: str = Query("citations_desc"),
    conn: sqlite3.Connection = Depends(get_db_connection)
):
    """Legacy endpoint - return unified citation data directly"""
    try:
        params = []
        time_filter = ""
        subject_filter = ""
        if time_range != "all":
            current_year = pd.Timestamp.now().year
            if time_range == "last_year":
                time_filter = " AND strftime('%Y', preprint_submission_date) >= ?"
                params.append(str(current_year - 1))
            elif time_range == "last_5_years":
                time_filter = " AND strftime('%Y', preprint_submission_date) >= ?"
                params.append(str(current_year - 5))
            elif time_range == "last_10_years":
                time_filter = " AND strftime('%Y', preprint_submission_date) >= ?"
                params.append(str(current_year - 10))
        if subject:
            subject_filter = " AND preprint_subject LIKE ?"
            params.append(f"%{subject}%")

        impact_query = f"""
            SELECT PPC_Id, preprint_title, preprint_submission_date as publication_date, 
                   total_citation, all_authors, preprint_subject
            FROM papers 
            WHERE total_citation IS NOT NULL
            {time_filter}
            {subject_filter}
            ORDER BY total_citation DESC LIMIT 1000
        """
        impact_df = pd.read_sql_query(impact_query, conn, params=params)

        trends_query = f"""
            SELECT strftime('%Y', preprint_submission_date) as year,
                   SUM(total_citation) as citations,
                   COUNT(*) as papers
            FROM papers 
            WHERE total_citation IS NOT NULL 
            AND preprint_submission_date IS NOT NULL
            {time_filter}
            {subject_filter}
            GROUP BY strftime('%Y', preprint_submission_date) ORDER BY year
        """
        trends_df = pd.read_sql_query(trends_query, conn, params=params)

        heatmap_query = f"""
            SELECT strftime('%Y', preprint_submission_date) as year,
                   strftime('%m', preprint_submission_date) as month,
                   strftime('%d', preprint_submission_date) as day,
                   SUM(total_citation) as citations
            FROM papers 
            WHERE total_citation IS NOT NULL 
            AND preprint_submission_date IS NOT NULL
            {time_filter}
            GROUP BY strftime('%Y', preprint_submission_date), strftime('%m', preprint_submission_date)
        """
        heatmap_params = [p for p in params if not (isinstance(p, str) and p.startswith('%'))]
        heatmap_df = pd.read_sql_query(heatmap_query, conn, params=heatmap_params)
        if not heatmap_df.empty:
            heatmap_df['year'] = heatmap_df['year'].astype(int)
            heatmap_df['month'] = heatmap_df['month'].astype(int)
            heatmap_df['day'] = heatmap_df['day'].astype(int)
            heatmap_df['citations'] = heatmap_df['citations'].fillna(0).astype(int)

        sort_clause = ""
        if sort_by == "citations_desc":
            sort_clause = " ORDER BY total_citation DESC"
        elif sort_by == "citations_asc":
            sort_clause = " ORDER BY total_citation ASC"
        elif sort_by == "date_desc":
            sort_clause = " ORDER BY preprint_submission_date DESC"
        elif sort_by == "date_asc":
            sort_clause = " ORDER BY preprint_submission_date ASC"
        elif sort_by == "title_asc":
            sort_clause = " ORDER BY preprint_title ASC"
        else:
            sort_clause = " ORDER BY total_citation DESC"
        top_papers_query = f"""
            SELECT PPC_Id, preprint_title, preprint_submission_date as publication_date,
                   total_citation, all_authors, preprint_subject
            FROM papers 
            WHERE total_citation IS NOT NULL
            {time_filter}
            {subject_filter}
            {sort_clause}
            LIMIT {limit}
        """
        top_papers_df = pd.read_sql_query(top_papers_query, conn, params=params)

        response_data = {
            "impactData": impact_df.to_dict("records"),
            "trendsData": trends_df.to_dict("records"),
            "heatmapData": heatmap_df.to_dict("records"),
            "topPapersData": top_papers_df.to_dict("records"),
            "metadata": {
                "time_range": time_range,
                "subject": subject,
                "limit": limit,
                "sort_by": sort_by,
                "total_impact_records": len(impact_df),
                "total_trends_records": len(trends_df),
                "total_heatmap_records": len(heatmap_df),
                "total_top_papers_records": len(top_papers_df)
            }
        }
        return JSONResponse(content=response_data)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/papers")
def legacy_papers(country: str = Query(None), year: int = Query(None), subject: str = Query(None),
                 page: int = Query(1, ge=1), page_size: int = Query(10, ge=1, le=100),
                 conn: sqlite3.Connection = Depends(get_db_connection)):
    """Legacy endpoint - return papers list directly"""
    try:
        conditions = []
        params = []
        if country:
            conditions.append("country_name = ?")
            params.append(country)
        if year:
            conditions.append("strftime('%Y', preprint_submission_date) = ?")
            params.append(str(year))
        if subject:
            conditions.append("preprint_subject LIKE ?")
            params.append(f"%{subject}%")
        where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""
        count_query = f"SELECT COUNT(*) as total FROM papers{where_clause}"
        count_df = pd.read_sql_query(count_query, conn, params=params)
        total = int(count_df.iloc[0]['total']) if not count_df.empty else 0
        offset = (page - 1) * page_size
        query = f"""
            SELECT PPC_Id, preprint_title, total_citation, preprint_submission_date, all_authors
            FROM papers{where_clause}
            ORDER BY total_citation DESC
            LIMIT ? OFFSET ?
        """
        df = pd.read_sql_query(query, conn, params=params + [page_size, offset])
        return JSONResponse(content={
            "papers": df.to_dict("records"),
            "total": total,
            "page": page,
            "page_size": page_size,
            "has_next": offset + page_size < total
        })
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/paper/{ppc_id}")
def legacy_get_paper(ppc_id: str, conn: sqlite3.Connection = Depends(get_db_connection)):
    """Legacy endpoint - return single paper by PPC_Id"""
    try:
        query = "SELECT * FROM papers WHERE PPC_Id = ?"
        df = pd.read_sql_query(query, conn, params=(ppc_id,))
        if df.empty:
            return JSONResponse(content={"error": "Paper not found"}, status_code=404)
        return JSONResponse(content=df.iloc[0].to_dict())
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

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
