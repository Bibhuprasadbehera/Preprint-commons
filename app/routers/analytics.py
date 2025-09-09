from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
import sqlite3
import pandas as pd
from typing import Optional
from app.database import get_db_connection
from app.models import AnalyticsResponse, CitationDataResponse
from app.config import settings
from app.cache import get_analytics_cache
from cachetools import Cache
import logging
import json

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/country-data")
def country_data(conn: sqlite3.Connection = Depends(get_db_connection), cache: Cache = Depends(get_analytics_cache)):
    """Get country-wise paper distribution by year"""
    cache_key = "country_data"
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        query = """
            SELECT country_name, strftime('%Y', preprint_submission_date) as year, COUNT(*) as count 
            FROM papers 
            WHERE country_name IS NOT NULL AND preprint_submission_date IS NOT NULL
            GROUP BY country_name, year
            ORDER BY year, country_name
        """
        df = pd.read_sql_query(query, conn)
        response = JSONResponse(content={"data": df.to_dict("records")})
        cache[cache_key] = response
        return response
        
    except Exception as e:
        logger.error(f"Country data error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch country data")

@router.get("/subjects")
def get_subjects(conn: sqlite3.Connection = Depends(get_db_connection), cache: Cache = Depends(get_analytics_cache)):
    """Get all unique subject areas"""
    cache_key = "analytics_subjects"
    if cache_key in cache:
        return cache[cache_key]
    
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
        response = JSONResponse(content={"data": subjects})
        cache[cache_key] = response
        return response
        
    except Exception as e:
        logger.error(f"Subjects error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch subjects")

@router.get("/dashboard")
def get_analytics_data(conn: sqlite3.Connection = Depends(get_db_connection), cache: Cache = Depends(get_analytics_cache)):
    """Get comprehensive analytics dashboard data"""
    cache_key = "analytics_dashboard"
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        # Publication Timeline Data
        timeline_query = """
            SELECT strftime('%Y-%m', preprint_submission_date) as month,
                   COUNT(*) as submissions
            FROM papers 
            WHERE preprint_submission_date IS NOT NULL
            GROUP BY strftime('%Y-%m', preprint_submission_date)
            ORDER BY month
        """
        timeline_df = pd.read_sql_query(timeline_query, conn)
        
        # Subject Distribution Data
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
        
        # Server Distribution Data
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
        
        # Calculate percentages for server data
        total_papers = server_df['count'].sum()
        if total_papers > 0:
            server_df['percentage'] = round(server_df['count'] * 100.0 / total_papers, 1)
        
        # Key Statistics
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
        
        # Most active period
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
        
        # Average papers per month
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
        
        # Prepare response
        response_data = AnalyticsResponse(
            timelineData=timeline_df.to_dict("records"),
            subjectData=subject_df.to_dict("records"),
            serverData=server_df.to_dict("records"),
            statisticsData={
                "totalPapers": int(stats_df.iloc[0]['total_papers']),
                "dateRange": {
                    "startDate": stats_df.iloc[0]['earliest_date'],
                    "endDate": stats_df.iloc[0]['latest_date']
                },
                "mostActivePeriod": {
                    "period": most_active_df.iloc[0]['period'] if not most_active_df.empty else "N/A",
                    "count": int(most_active_df.iloc[0]['count']) if not most_active_df.empty else 0
                },
                "averagePapersPerMonth": int(avg_df.iloc[0]['avg_papers_per_month']) if not avg_df.empty else 0,
                "activeSubjects": int(stats_df.iloc[0]['active_subjects']),
                "activeServers": len(server_df)
            },
            metadata={
                "lastUpdated": pd.Timestamp.now().isoformat(),
                "totalRecords": int(stats_df.iloc[0]['total_papers'])
            }
        )
        
        cache[cache_key] = response_data
        return response_data
        
    except Exception as e:
        logger.error(f"Analytics data error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch analytics data")

@router.get("/citations")
def get_unified_citation_data(
    time_range: str = Query("all", description="Time range filter"),
    subject: Optional[str] = Query(None, description="Subject filter"),
    limit: int = Query(10, ge=1, le=100, description="Limit for top papers"),
    sort_by: str = Query("citations_desc", description="Sort order"),
    conn: sqlite3.Connection = Depends(get_db_connection),
    cache: Cache = Depends(get_analytics_cache)
):
    """Get unified citation data for all citation-related charts"""
    cache_key = f"citations_{time_range}_{subject}_{limit}_{sort_by}"
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        # Build common filter conditions
        params = []
        time_filter = ""
        subject_filter = ""
        
        # Add time range filter
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
        
        # Add subject filter
        if subject:
            subject_filter = " AND preprint_subject LIKE ?"
            params.append(f"%{subject}%")
        
        # Citation Impact Data - Optimized to only fetch necessary fields
        impact_query = f"""
            SELECT PPC_Id, preprint_title, preprint_submission_date as publication_date, 
                   total_citation, preprint_subject
            FROM papers 
            WHERE total_citation IS NOT NULL
            {time_filter}
            {subject_filter}
            ORDER BY total_citation DESC LIMIT 500
        """
        impact_df = pd.read_sql_query(impact_query, conn, params=params)
        
        # Citation Trends Data
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
        
        # Citation Heatmap Data
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
        heatmap_params = [p for p in params if not p.startswith('%')]
        heatmap_df = pd.read_sql_query(heatmap_query, conn, params=heatmap_params)
        
        # Convert heatmap columns to integers
        if not heatmap_df.empty:
            heatmap_df['year'] = heatmap_df['year'].astype(int)
            heatmap_df['month'] = heatmap_df['month'].astype(int)
            heatmap_df['day'] = heatmap_df['day'].astype(int)
            heatmap_df['citations'] = heatmap_df['citations'].fillna(0).astype(int)
        
        # Top Cited Papers Data
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
                   total_citation, preprint_subject
            FROM papers 
            WHERE total_citation IS NOT NULL
            {time_filter}
            {subject_filter}
            {sort_clause}
            LIMIT {limit}
        """
        top_papers_df = pd.read_sql_query(top_papers_query, conn, params=params)
        
        # Prepare unified response
        response_data = CitationDataResponse(
            impactData=impact_df.to_dict("records"),
            trendsData=trends_df.to_dict("records"),
            heatmapData=heatmap_df.to_dict("records"),
            topPapersData=top_papers_df.to_dict("records"),
            metadata={
                "time_range": time_range,
                "subject": subject,
                "limit": limit,
                "sort_by": sort_by,
                "total_impact_records": len(impact_df),
                "total_trends_records": len(trends_df),
                "total_heatmap_records": len(heatmap_df),
                "total_top_papers_records": len(top_papers_df)
            }
        )
        
        cache[cache_key] = response_data
        return response_data
        
    except Exception as e:
        logger.error(f"Citation data error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch citation data")