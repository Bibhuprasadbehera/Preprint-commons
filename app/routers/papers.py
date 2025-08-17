from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
import sqlite3
import pandas as pd
from typing import Optional
from app.database import get_db_connection
from app.models import Paper, SearchResponse, PaperSummary
from app.config import settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/papers", tags=["papers"])

@router.get("/search")
def search_papers(
    query: str = Query(..., min_length=1, description="Search query"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=settings.max_page_size, description="Items per page"),
    conn: sqlite3.Connection = Depends(get_db_connection)
):
    """Search papers with pagination"""
    try:
        offset = (page - 1) * page_size
        
        # Count total results
        count_query = """
            SELECT COUNT(*) as total 
            FROM papers 
            WHERE preprint_title LIKE ? OR preprint_doi LIKE ? OR all_authors LIKE ?
        """
        count_df = pd.read_sql_query(count_query, conn, params=(f"%{query}%", f"%{query}%", f"%{query}%"))
        total = int(count_df.iloc[0]['total'])
        
        # Get paginated results
        search_query = """
            SELECT * FROM papers 
            WHERE preprint_title LIKE ? OR preprint_doi LIKE ? OR all_authors LIKE ?
            ORDER BY total_citation DESC
            LIMIT ? OFFSET ?
        """
        df = pd.read_sql_query(
            search_query, 
            conn, 
            params=(f"%{query}%", f"%{query}%", f"%{query}%", page_size, offset)
        )
        
        has_next = offset + page_size < total
        
        return SearchResponse(
            papers=df.to_dict("records"),
            total=total,
            page=page,
            page_size=page_size,
            has_next=has_next
        )
        
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail="Search failed")

@router.get("/{ppc_id}")
def get_paper(ppc_id: str, conn: sqlite3.Connection = Depends(get_db_connection)):
    """Get a specific paper by PPC_Id"""
    try:
        query = "SELECT * FROM papers WHERE PPC_Id = ?"
        df = pd.read_sql_query(query, conn, params=(ppc_id,))
        
        if df.empty:
            raise HTTPException(status_code=404, detail="Paper not found")
            
        return Paper(**df.iloc[0].to_dict())
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get paper error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve paper")

@router.get("/")
def fetch_papers(
    country: Optional[str] = None,
    year: Optional[int] = None,
    subject: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=settings.max_page_size),
    conn: sqlite3.Connection = Depends(get_db_connection)
):
    """Fetch papers with filters and pagination"""
    try:
        # Build dynamic query
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
        
        # Count total
        count_query = f"SELECT COUNT(*) as total FROM papers{where_clause}"
        count_df = pd.read_sql_query(count_query, conn, params=params)
        total = int(count_df.iloc[0]['total'])
        
        # Get paginated results
        offset = (page - 1) * page_size
        query = f"""
            SELECT PPC_Id, preprint_title, total_citation, preprint_submission_date, all_authors
            FROM papers{where_clause}
            ORDER BY total_citation DESC
            LIMIT ? OFFSET ?
        """
        df = pd.read_sql_query(query, conn, params=params + [page_size, offset])
        
        has_next = offset + page_size < total
        
        return SearchResponse(
            papers=df.to_dict("records"),
            total=total,
            page=page,
            page_size=page_size,
            has_next=has_next
        )
        
    except Exception as e:
        logger.error(f"Fetch papers error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch papers")