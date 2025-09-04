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
router = APIRouter(prefix="/api/papers", tags=["papers"])

@router.get("/search")
def search_papers(
    query: str = Query(..., min_length=1, description="Search query"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=settings.max_page_size, description="Items per page"),
    conn: sqlite3.Connection = Depends(get_db_connection),
    cache: Cache = Depends(get_cache)
):
    """Search papers with pagination"""
    cache_key = f"search_{query}_{page}_{page_size}"
    if cache_key in cache:
        return cache[cache_key]

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
<<<<<<< HEAD
<<<<<<< HEAD
        
=======

        # Handle NaN values in total_citation to prevent Pydantic validation errors
        df['total_citation'] = df['total_citation'].fillna(0).astype(int)

<<<<<<< HEAD
>>>>>>> 07001b1 (cleaning backend (i dont understand))
=======
>>>>>>> 07001b1 (cleaning backend (i dont understand))
=======

>>>>>>> 2018d38 (now works well the (clickable charts))
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
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail="Search failed")

<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 2018d38 (now works well the (clickable charts))
@router.post("/advanced-search")
def advanced_search_papers(
    search_criteria: Dict[str, Any],
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=settings.max_page_size, description="Items per page"),
    conn: sqlite3.Connection = Depends(get_db_connection),
    cache: Cache = Depends(get_cache)
):
    """Advanced search with multiple criteria and operators"""
    cache_key = f"advanced_search_{json.dumps(search_criteria, sort_keys=True)}_{page}_{page_size}"
    if cache_key in cache:
        return cache[cache_key]

    try:
        offset = (page - 1) * page_size

        # Build WHERE clause from search criteria
        conditions = []
        params = []

        # Year range
        if search_criteria.get('year_from') or search_criteria.get('year_to'):
            if search_criteria.get('year_from') and search_criteria.get('year_to'):
                conditions.append("strftime('%Y', preprint_submission_date) BETWEEN ? AND ?")
                params.extend([search_criteria['year_from'], search_criteria['year_to']])
            elif search_criteria.get('year_from'):
                conditions.append("strftime('%Y', preprint_submission_date) >= ?")
                params.append(search_criteria['year_from'])
            elif search_criteria.get('year_to'):
                conditions.append("strftime('%Y', preprint_submission_date) <= ?")
                params.append(search_criteria['year_to'])

        # Month filtering (format: YYYY-MM)
        if search_criteria.get('month'):
            # Extract year and month from YYYY-MM format
            try:
                year_month = search_criteria['month']
                if len(year_month) == 7 and year_month[4] == '-':  # YYYY-MM format
                    year = year_month[:4]
                    month = year_month[5:7]
                    conditions.append("strftime('%Y', preprint_submission_date) = ? AND strftime('%m', preprint_submission_date) = ?")
                    params.extend([year, month])
            except (ValueError, IndexError):
                # If month format is invalid, ignore this filter
                pass

        # Subject
        if search_criteria.get('subject'):
            conditions.append("preprint_subject LIKE ?")
            params.append(f"%{search_criteria['subject']}%")

        # Server
        if search_criteria.get('server'):
            conditions.append("preprint_server LIKE ?")
            params.append(f"%{search_criteria['server']}%")

        # Country
        if search_criteria.get('country'):
            conditions.append("country_name LIKE ?")
            params.append(f"%{search_criteria['country']}%")

        # Authors
        if search_criteria.get('authors'):
            conditions.append("all_authors LIKE ?")
            params.append(f"%{search_criteria['authors']}%")

        # Institution
        if search_criteria.get('institution'):
            conditions.append("corresponding_institution LIKE ?")
            params.append(f"%{search_criteria['institution']}%")

        # License
        if search_criteria.get('license'):
            conditions.append("submission_license LIKE ?")
            params.append(f"%{search_criteria['license']}%")

        # Citation range
        if search_criteria.get('citation_min') is not None:
            conditions.append("total_citation >= ?")
            params.append(search_criteria['citation_min'])
        if search_criteria.get('citation_max') is not None:
            conditions.append("total_citation <= ?")
            params.append(search_criteria['citation_max'])

        # Build WHERE clause
        where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""

        # Count total results
        count_query = f"SELECT COUNT(*) as total FROM papers{where_clause}"
        count_df = pd.read_sql_query(count_query, conn, params=params)
        total = int(count_df.iloc[0]['total'])

        # Get paginated results
        query = f"""
            SELECT * FROM papers{where_clause}
            ORDER BY total_citation DESC
            LIMIT ? OFFSET ?
        """
        df = pd.read_sql_query(query, conn, params=params + [page_size, offset])

<<<<<<< HEAD
        # Handle NaN values in total_citation to prevent Pydantic validation errors
        df['total_citation'] = df['total_citation'].fillna(0).astype(int)

=======
>>>>>>> 2018d38 (now works well the (clickable charts))
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
        logger.error(f"Advanced search error: {e}")
        raise HTTPException(status_code=500, detail="Advanced search failed")

@router.get("/subjects")
def get_subjects(conn: sqlite3.Connection = Depends(get_db_connection), cache: Cache = Depends(get_cache)):
    """Get unique subjects for filter dropdown"""
    cache_key = "subjects_list"
    if cache_key in cache:
        return cache[cache_key]

    try:
        query = "SELECT DISTINCT preprint_subject FROM papers WHERE preprint_subject IS NOT NULL AND preprint_subject != '' ORDER BY preprint_subject"
        df = pd.read_sql_query(query, conn)
        subjects = df['preprint_subject'].tolist()
        cache[cache_key] = subjects
        return subjects
    except Exception as e:
        logger.error(f"Get subjects error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get subjects")

@router.get("/servers")
def get_servers(conn: sqlite3.Connection = Depends(get_db_connection), cache: Cache = Depends(get_cache)):
    """Get unique servers for filter dropdown"""
    cache_key = "servers_list"
    if cache_key in cache:
        return cache[cache_key]

    try:
        query = "SELECT DISTINCT preprint_server FROM papers WHERE preprint_server IS NOT NULL AND preprint_server != '' ORDER BY preprint_server"
        df = pd.read_sql_query(query, conn)
        servers = df['preprint_server'].tolist()
        cache[cache_key] = servers
        return servers
    except Exception as e:
        logger.error(f"Get servers error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get servers")

@router.get("/countries")
def get_countries(conn: sqlite3.Connection = Depends(get_db_connection), cache: Cache = Depends(get_cache)):
    """Get unique countries for filter dropdown"""
    cache_key = "countries_list"
    if cache_key in cache:
        return cache[cache_key]

    try:
        query = "SELECT DISTINCT country_name FROM papers WHERE country_name IS NOT NULL AND country_name != '' ORDER BY country_name"
        df = pd.read_sql_query(query, conn)
        countries = df['country_name'].tolist()
        cache[cache_key] = countries
        return countries
    except Exception as e:
        logger.error(f"Get countries error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get countries")

@router.get("/licenses")
def get_licenses(conn: sqlite3.Connection = Depends(get_db_connection), cache: Cache = Depends(get_cache)):
    """Get unique licenses for filter dropdown"""
    cache_key = "licenses_list"
    if cache_key in cache:
        return cache[cache_key]

    try:
        query = "SELECT DISTINCT submission_license FROM papers WHERE submission_license IS NOT NULL AND submission_license != '' ORDER BY submission_license"
        df = pd.read_sql_query(query, conn)
        licenses = df['submission_license'].tolist()
        cache[cache_key] = licenses
        return licenses
    except Exception as e:
        logger.error(f"Get licenses error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get licenses")

<<<<<<< HEAD
>>>>>>> 07001b1 (cleaning backend (i dont understand))
=======
>>>>>>> 2018d38 (now works well the (clickable charts))
@router.get("/{ppc_id}")
def get_paper(ppc_id: str, conn: sqlite3.Connection = Depends(get_db_connection), cache: Cache = Depends(get_cache)):
    """Get a specific paper by PPC_Id"""
    cache_key = f"paper_{ppc_id}"
    if cache_key in cache:
        return cache[cache_key]

    try:
        query = "SELECT * FROM papers WHERE PPC_Id = ?"
        df = pd.read_sql_query(query, conn, params=(ppc_id,))

        if df.empty:
            raise HTTPException(status_code=404, detail="Paper not found")

        # Handle NaN values in total_citation to prevent Pydantic validation errors
        df['total_citation'] = df['total_citation'].fillna(0).astype(int)

        row = df.iloc[0].to_dict()
        # Ensure all expected fields exist (fallbacks)
        row.setdefault('publication_date', row.get('preprint_submission_date'))
        row.setdefault('preprint_abstract', row.get('preprint_abstract'))
        row.setdefault('citation', row.get('citation'))
        row.setdefault('versions', row.get('versions'))
        row.setdefault('submission_contact', row.get('submission_contact'))
        row.setdefault('corresponding_institution', row.get('corresponding_institution'))
        row.setdefault('published_DOI', row.get('published_DOI'))

        paper = Paper(**row)
        cache[cache_key] = paper
        return paper
        
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
    conn: sqlite3.Connection = Depends(get_db_connection),
    cache: Cache = Depends(get_cache)
):
    """Fetch papers with filters and pagination"""
    params_dict = {"country": country, "year": year, "subject": subject, "page": page, "page_size": page_size}
    cache_key = "fetch_" + json.dumps(params_dict, sort_keys=True)
    if cache_key in cache:
        return cache[cache_key]

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
            SELECT PPC_Id, preprint_title, total_citation, preprint_submission_date, all_authors, preprint_subject, preprint_server, country_name
            FROM papers{where_clause}
            ORDER BY total_citation DESC
            LIMIT ? OFFSET ?
        """
        df = pd.read_sql_query(query, conn, params=params + [page_size, offset])

        # Handle NaN values in total_citation to prevent Pydantic validation errors
        df['total_citation'] = df['total_citation'].fillna(0).astype(int)

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
        logger.error(f"Fetch papers error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch papers")
