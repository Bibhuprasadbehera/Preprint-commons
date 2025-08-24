from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
import sqlite3
import pandas as pd
from typing import Optional, Dict, Any
from app.database import get_db_connection
from app.models import Paper, SearchResponse, PaperSummary
from app.config import settings
from app.cache import get_cache
from cachetools import Cache
import logging
import json

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/authors", tags=["authors"])

@router.get("/search")
def search_authors(
    query: str = Query(..., min_length=1, description="Search query for authors"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=settings.max_page_size, description="Items per page"),
    conn: sqlite3.Connection = Depends(get_db_connection),
    cache: Cache = Depends(get_cache)
):
    """Search papers by author name using submission_contact field"""
    cache_key = f"author_search_{query}_{page}_{page_size}"
    if cache_key in cache:
        return cache[cache_key]

    try:
        offset = (page - 1) * page_size

        # Count total results - search in submission_contact field
        count_query = """
            SELECT COUNT(*) as total
            FROM papers
            WHERE submission_contact LIKE ?
        """
        count_df = pd.read_sql_query(count_query, conn, params=(f"%{query}%",))
        total = int(count_df.iloc[0]['total'])

        # Get paginated results
        search_query = """
            SELECT PPC_Id, preprint_title, preprint_doi, submission_contact,
                   preprint_submission_date, total_citation, preprint_server,
                   preprint_subject, country_name
            FROM papers
            WHERE submission_contact LIKE ?
            ORDER BY total_citation DESC
            LIMIT ? OFFSET ?
        """
        df = pd.read_sql_query(
            search_query,
            conn,
            params=(f"%{query}%", page_size, offset)
        )

        has_next = offset + page_size < total

        response = SearchResponse(
            papers=df.to_dict("records"),
            total=total,
            page=page,
            page_size=page_size,
            has_next=has_next
        )
        cache[cache_key] = response
        return response

    except Exception as e:
        logger.error(f"Author search error: {e}")
        raise HTTPException(status_code=500, detail="Author search failed")

@router.get("/list")
def list_authors(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(50, ge=1, le=200, description="Items per page"),
    conn: sqlite3.Connection = Depends(get_db_connection),
    cache: Cache = Depends(get_cache)
):
    """Get a list of unique authors for autocomplete/suggestions"""
    cache_key = f"authors_list_{page}_{page_size}"
    if cache_key in cache:
        return cache[cache_key]

    try:
        offset = (page - 1) * page_size

        # Count total unique authors
        count_query = """
            SELECT COUNT(DISTINCT submission_contact) as total
            FROM papers
            WHERE submission_contact IS NOT NULL AND submission_contact != ''
        """
        count_df = pd.read_sql_query(count_query, conn)
        total = int(count_df.iloc[0]['total'])

        # Get paginated list of unique authors with paper counts
        query = """
            SELECT submission_contact as author_name,
                   COUNT(*) as paper_count,
                   MAX(total_citation) as max_citations
            FROM papers
            WHERE submission_contact IS NOT NULL AND submission_contact != ''
            GROUP BY submission_contact
            ORDER BY paper_count DESC
            LIMIT ? OFFSET ?
        """
        df = pd.read_sql_query(query, conn, params=(page_size, offset))

        has_next = offset + page_size < total

        response = {
            "authors": df.to_dict("records"),
            "total": total,
            "page": page,
            "page_size": page_size,
            "has_next": has_next
        }
        cache[cache_key] = response
        return response

    except Exception as e:
        logger.error(f"List authors error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve authors list")

@router.get("/{author_name}/papers")
def get_author_papers(
    author_name: str,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=settings.max_page_size, description="Items per page"),
    conn: sqlite3.Connection = Depends(get_db_connection),
    cache: Cache = Depends(get_cache)
):
    """Get all papers by a specific author"""
    cache_key = f"author_papers_{author_name}_{page}_{page_size}"
    if cache_key in cache:
        return cache[cache_key]

    try:
        offset = (page - 1) * page_size

        # Count total papers by this author
        count_query = """
            SELECT COUNT(*) as total
            FROM papers
            WHERE submission_contact LIKE ?
        """
        count_df = pd.read_sql_query(count_query, conn, params=(f"%{author_name}%",))
        total = int(count_df.iloc[0]['total'])

        # Get paginated results
        query = """
            SELECT * FROM papers
            WHERE submission_contact LIKE ?
            ORDER BY total_citation DESC
            LIMIT ? OFFSET ?
        """
        df = pd.read_sql_query(query, conn, params=(f"%{author_name}%", page_size, offset))

        has_next = offset + page_size < total

        response = SearchResponse(
            papers=df.to_dict("records"),
            total=total,
            page=page,
            page_size=page_size,
            has_next=has_next
        )
        cache[cache_key] = response
        return response

    except Exception as e:
        logger.error(f"Get author papers error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve author papers")
