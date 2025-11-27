from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
import sqlite3
import pandas as pd
import json
from typing import Optional, List, Dict, Any
from app.database import get_db_connection
from app.cache import get_analytics_cache
from cachetools import Cache
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/advanced-analytics", tags=["advanced-analytics"])

# ============================================================================
# PHASE 1: Publication Timeline Analytics
# ============================================================================

@router.get("/publication-timeline")
def get_publication_timeline_analytics(
    subject: Optional[str] = Query(None, description="Filter by subject"),
    server: Optional[str] = Query(None, description="Filter by server"),
    year_from: Optional[str] = Query(None, description="Start year"),
    year_to: Optional[str] = Query(None, description="End year"),
    conn: sqlite3.Connection = Depends(get_db_connection),
    cache: Cache = Depends(get_analytics_cache)
):
    """
    Comprehensive publication timeline analytics showing:
    - Average time to publish by subject, server, year
    - Publication speed trends over time
    - Distribution of publication times
    """
    cache_key = f"pub_timeline_{subject}_{server}_{year_from}_{year_to}"
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        # Build filters
        filters = ["no_of_days_for_publish IS NOT NULL", "no_of_days_for_publish > 0"]
        params = []
        
        if subject:
            filters.append("preprint_subject LIKE ?")
            params.append(f"%{subject}%")
        if server:
            filters.append("preprint_server LIKE ?")
            params.append(f"%{server}%")
        if year_from:
            filters.append("strftime('%Y', preprint_submission_date) >= ?")
            params.append(year_from)
        if year_to:
            filters.append("strftime('%Y', preprint_submission_date) <= ?")
            params.append(year_to)
        
        where_clause = " AND ".join(filters)
        
        # Average by subject
        subject_query = f"""
            SELECT preprint_subject,
                   COUNT(*) as paper_count,
                   ROUND(AVG(no_of_days_for_publish), 1) as avg_days,
                   MIN(no_of_days_for_publish) as min_days,
                   MAX(no_of_days_for_publish) as max_days,
                   ROUND(AVG(total_citation), 1) as avg_citations
            FROM papers
            WHERE {where_clause}
            GROUP BY preprint_subject
            HAVING paper_count >= 5
            ORDER BY avg_days
        """
        subject_df = pd.read_sql_query(subject_query, conn, params=params)
        
        # Average by server
        server_query = f"""
            SELECT preprint_server,
                   COUNT(*) as paper_count,
                   ROUND(AVG(no_of_days_for_publish), 1) as avg_days,
                   MIN(no_of_days_for_publish) as min_days,
                   MAX(no_of_days_for_publish) as max_days
            FROM papers
            WHERE {where_clause}
            GROUP BY preprint_server
            ORDER BY avg_days
        """
        server_df = pd.read_sql_query(server_query, conn, params=params)
        
        # Trend over years
        trend_query = f"""
            SELECT strftime('%Y', preprint_submission_date) as year,
                   COUNT(*) as paper_count,
                   ROUND(AVG(no_of_days_for_publish), 1) as avg_days,
                   MIN(no_of_days_for_publish) as min_days,
                   MAX(no_of_days_for_publish) as max_days
            FROM papers
            WHERE {where_clause}
            GROUP BY strftime('%Y', preprint_submission_date)
            ORDER BY year
        """
        trend_df = pd.read_sql_query(trend_query, conn, params=params)
        
        # Distribution buckets
        distribution_query = f"""
            SELECT 
                CASE 
                    WHEN no_of_days_for_publish <= 30 THEN '0-30 days'
                    WHEN no_of_days_for_publish <= 90 THEN '31-90 days'
                    WHEN no_of_days_for_publish <= 180 THEN '91-180 days'
                    WHEN no_of_days_for_publish <= 365 THEN '181-365 days'
                    ELSE '365+ days'
                END as time_bucket,
                COUNT(*) as count
            FROM papers
            WHERE {where_clause}
            GROUP BY time_bucket
            ORDER BY 
                CASE time_bucket
                    WHEN '0-30 days' THEN 1
                    WHEN '31-90 days' THEN 2
                    WHEN '91-180 days' THEN 3
                    WHEN '181-365 days' THEN 4
                    ELSE 5
                END
        """
        distribution_df = pd.read_sql_query(distribution_query, conn, params=params)
        
        # Overall statistics
        stats_query = f"""
            SELECT 
                COUNT(*) as total_published,
                ROUND(AVG(no_of_days_for_publish), 1) as overall_avg_days,
                MIN(no_of_days_for_publish) as fastest_publish,
                MAX(no_of_days_for_publish) as slowest_publish
            FROM papers
            WHERE {where_clause}
        """
        stats_df = pd.read_sql_query(stats_query, conn, params=params)
        
        response = {
            "bySubject": subject_df.to_dict("records"),
            "byServer": server_df.to_dict("records"),
            "trendOverTime": trend_df.to_dict("records"),
            "distribution": distribution_df.to_dict("records"),
            "statistics": stats_df.to_dict("records")[0] if not stats_df.empty else {},
            "metadata": {
                "filters": {"subject": subject, "server": server, "year_from": year_from, "year_to": year_to}
            }
        }
        
        cache[cache_key] = response
        return response
        
    except Exception as e:
        logger.error(f"Publication timeline analytics error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch publication timeline analytics")


@router.get("/submission-type-analytics")
def get_submission_type_analytics(
    subject: Optional[str] = Query(None, description="Filter by subject"),
    year_from: Optional[str] = Query(None, description="Start year"),
    year_to: Optional[str] = Query(None, description="End year"),
    conn: sqlite3.Connection = Depends(get_db_connection),
    cache: Cache = Depends(get_analytics_cache)
):
    """
    Submission type analytics showing:
    - Distribution of submission types
    - Citation patterns by type
    - Trends over time
    """
    cache_key = f"submission_type_{subject}_{year_from}_{year_to}"
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        filters = ["submission_type IS NOT NULL", "submission_type != ''"]
        params = []
        
        if subject:
            filters.append("preprint_subject LIKE ?")
            params.append(f"%{subject}%")
        if year_from:
            filters.append("strftime('%Y', preprint_submission_date) >= ?")
            params.append(year_from)
        if year_to:
            filters.append("strftime('%Y', preprint_submission_date) <= ?")
            params.append(year_to)
        
        where_clause = " AND ".join(filters)
        
        # Distribution by type
        type_dist_query = f"""
            SELECT submission_type,
                   COUNT(*) as count,
                   ROUND(AVG(total_citation), 1) as avg_citations,
                   ROUND(AVG(no_of_days_for_publish), 1) as avg_days_to_publish
            FROM papers
            WHERE {where_clause}
            GROUP BY submission_type
            ORDER BY count DESC
        """
        type_dist_df = pd.read_sql_query(type_dist_query, conn, params=params)
        
        # By subject
        subject_type_query = f"""
            SELECT preprint_subject,
                   submission_type,
                   COUNT(*) as count
            FROM papers
            WHERE {where_clause}
            GROUP BY preprint_subject, submission_type
            ORDER BY preprint_subject, count DESC
        """
        subject_type_df = pd.read_sql_query(subject_type_query, conn, params=params)
        
        # Trend over time
        trend_query = f"""
            SELECT strftime('%Y', preprint_submission_date) as year,
                   submission_type,
                   COUNT(*) as count
            FROM papers
            WHERE {where_clause}
            GROUP BY year, submission_type
            ORDER BY year, submission_type
        """
        trend_df = pd.read_sql_query(trend_query, conn, params=params)
        
        response = {
            "typeDistribution": type_dist_df.to_dict("records"),
            "bySubject": subject_type_df.to_dict("records"),
            "trendOverTime": trend_df.to_dict("records"),
            "metadata": {
                "filters": {"subject": subject, "year_from": year_from, "year_to": year_to}
            }
        }
        
        cache[cache_key] = response
        return response
        
    except Exception as e:
        logger.error(f"Submission type analytics error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch submission type analytics")


# ============================================================================
# PHASE 2: Enhanced Citation Analytics
# ============================================================================

@router.get("/citation-network")
def get_citation_network_data(
    limit: int = Query(100, ge=10, le=500, description="Number of papers to analyze"),
    min_citations: int = Query(10, ge=1, description="Minimum citations threshold"),
    conn: sqlite3.Connection = Depends(get_db_connection),
    cache: Cache = Depends(get_analytics_cache)
):
    """
    Citation network data for graph visualization
    Returns nodes (papers) and edges (citation relationships)
    """
    cache_key = f"citation_network_{limit}_{min_citations}"
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        # Get top cited papers with their citation data
        query = """
            SELECT PPC_Id, preprint_title, total_citation, citation, preprint_subject
            FROM papers
            WHERE total_citation >= ? AND citation IS NOT NULL AND citation != ''
            ORDER BY total_citation DESC
            LIMIT ?
        """
        df = pd.read_sql_query(query, conn, params=(min_citations, limit))
        
        nodes = []
        edges = []
        
        for _, row in df.iterrows():
            nodes.append({
                "id": row['PPC_Id'],
                "title": row['preprint_title'],
                "citations": int(row['total_citation']),
                "subject": row['preprint_subject']
            })
            
            # Parse citation JSON to create edges
            try:
                citation_data = row['citation'].replace("'", '"')
                citations = json.loads(citation_data)
                for cite in citations:
                    if isinstance(cite, dict) and 'doi' in cite:
                        edges.append({
                            "source": row['PPC_Id'],
                            "target": cite.get('doi', ''),
                            "count": cite.get('count', 1)
                        })
            except:
                pass
        
        response = {
            "nodes": nodes,
            "edges": edges,
            "metadata": {
                "total_nodes": len(nodes),
                "total_edges": len(edges),
                "min_citations": min_citations
            }
        }
        
        cache[cache_key] = response
        return response
        
    except Exception as e:
        logger.error(f"Citation network error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch citation network data")


@router.get("/citation-sources")
def get_citation_sources_analytics(
    ppc_id: Optional[str] = Query(None, description="Specific paper ID"),
    top_n: int = Query(20, ge=5, le=100, description="Top N papers by citations"),
    conn: sqlite3.Connection = Depends(get_db_connection),
    cache: Cache = Depends(get_analytics_cache)
):
    """
    Analyze citation sources - where citations come from
    """
    cache_key = f"citation_sources_{ppc_id}_{top_n}"
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        if ppc_id:
            # Single paper analysis
            query = """
                SELECT PPC_Id, preprint_title, citation, total_citation
                FROM papers
                WHERE PPC_Id = ? AND citation IS NOT NULL
            """
            df = pd.read_sql_query(query, conn, params=(ppc_id,))
        else:
            # Top papers analysis
            query = """
                SELECT PPC_Id, preprint_title, citation, total_citation
                FROM papers
                WHERE citation IS NOT NULL AND citation != ''
                ORDER BY total_citation DESC
                LIMIT ?
            """
            df = pd.read_sql_query(query, conn, params=(top_n,))
        
        papers_analysis = []
        
        for _, row in df.iterrows():
            try:
                citation_data = row['citation'].replace("'", '"')
                citations = json.loads(citation_data)
                
                citation_sources = []
                for cite in citations:
                    if isinstance(cite, dict):
                        citation_sources.append({
                            "doi": cite.get('doi', 'Unknown'),
                            "count": cite.get('count', 1)
                        })
                
                papers_analysis.append({
                    "ppc_id": row['PPC_Id'],
                    "title": row['preprint_title'],
                    "total_citations": int(row['total_citation']),
                    "citation_sources": citation_sources,
                    "unique_sources": len(citation_sources)
                })
            except:
                continue
        
        response = {
            "papers": papers_analysis,
            "metadata": {
                "total_papers_analyzed": len(papers_analysis)
            }
        }
        
        cache[cache_key] = response
        return response
        
    except Exception as e:
        logger.error(f"Citation sources analytics error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch citation sources analytics")


# ============================================================================
# PHASE 2: Version History Analytics
# ============================================================================

@router.get("/version-analytics")
def get_version_analytics(
    subject: Optional[str] = Query(None, description="Filter by subject"),
    server: Optional[str] = Query(None, description="Filter by server"),
    conn: sqlite3.Connection = Depends(get_db_connection),
    cache: Cache = Depends(get_analytics_cache)
):
    """
    Version history analytics showing:
    - Revision patterns
    - Time between versions
    - Correlation with citations
    """
    cache_key = f"version_analytics_{subject}_{server}"
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        filters = ["versions IS NOT NULL", "versions != ''", "versions != '[]'"]
        params = []
        
        if subject:
            filters.append("preprint_subject LIKE ?")
            params.append(f"%{subject}%")
        if server:
            filters.append("preprint_server LIKE ?")
            params.append(f"%{server}%")
        
        where_clause = " AND ".join(filters)
        
        # Version count distribution
        version_dist_query = f"""
            SELECT 
                json_array_length(versions) as version_count,
                COUNT(*) as paper_count,
                ROUND(AVG(total_citation), 1) as avg_citations,
                ROUND(AVG(no_of_days_for_publish), 1) as avg_days_to_publish
            FROM papers
            WHERE {where_clause}
            GROUP BY json_array_length(versions)
            ORDER BY version_count
        """
        version_dist_df = pd.read_sql_query(version_dist_query, conn, params=params)
        
        # By subject
        subject_version_query = f"""
            SELECT preprint_subject,
                   json_array_length(versions) as version_count,
                   COUNT(*) as paper_count,
                   ROUND(AVG(total_citation), 1) as avg_citations
            FROM papers
            WHERE {where_clause}
            GROUP BY preprint_subject, version_count
            ORDER BY preprint_subject, version_count
        """
        subject_version_df = pd.read_sql_query(subject_version_query, conn, params=params)
        
        # By server
        server_version_query = f"""
            SELECT preprint_server,
                   json_array_length(versions) as version_count,
                   COUNT(*) as paper_count,
                   ROUND(AVG(total_citation), 1) as avg_citations
            FROM papers
            WHERE {where_clause}
            GROUP BY preprint_server, version_count
            ORDER BY preprint_server, version_count
        """
        server_version_df = pd.read_sql_query(server_version_query, conn, params=params)
        
        # Statistics
        stats_query = f"""
            SELECT 
                COUNT(*) as total_papers_with_versions,
                ROUND(AVG(json_array_length(versions)), 1) as avg_versions,
                MAX(json_array_length(versions)) as max_versions,
                SUM(CASE WHEN json_array_length(versions) >= 2 THEN 1 ELSE 0 END) as multi_version_papers
            FROM papers
            WHERE {where_clause}
        """
        stats_df = pd.read_sql_query(stats_query, conn, params=params)
        
        response = {
            "versionDistribution": version_dist_df.to_dict("records"),
            "bySubject": subject_version_df.to_dict("records"),
            "byServer": server_version_df.to_dict("records"),
            "statistics": stats_df.to_dict("records")[0] if not stats_df.empty else {},
            "metadata": {
                "filters": {"subject": subject, "server": server}
            }
        }
        
        cache[cache_key] = response
        return response
        
    except Exception as e:
        logger.error(f"Version analytics error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch version analytics")


# ============================================================================
# PHASE 2: License Analytics
# ============================================================================

@router.get("/license-analytics")
def get_license_analytics(
    subject: Optional[str] = Query(None, description="Filter by subject"),
    year_from: Optional[str] = Query(None, description="Start year"),
    year_to: Optional[str] = Query(None, description="End year"),
    conn: sqlite3.Connection = Depends(get_db_connection),
    cache: Cache = Depends(get_analytics_cache)
):
    """
    License analytics showing:
    - License distribution
    - Citation impact by license
    - Trends over time
    - Subject preferences
    """
    cache_key = f"license_analytics_{subject}_{year_from}_{year_to}"
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        filters = ["submission_license IS NOT NULL", "submission_license != ''"]
        params = []
        
        if subject:
            filters.append("preprint_subject LIKE ?")
            params.append(f"%{subject}%")
        if year_from:
            filters.append("strftime('%Y', preprint_submission_date) >= ?")
            params.append(year_from)
        if year_to:
            filters.append("strftime('%Y', preprint_submission_date) <= ?")
            params.append(year_to)
        
        where_clause = " AND ".join(filters)
        
        # License distribution with impact
        license_dist_query = f"""
            SELECT submission_license,
                   COUNT(*) as paper_count,
                   ROUND(AVG(total_citation), 1) as avg_citations,
                   MAX(total_citation) as max_citations,
                   ROUND(AVG(no_of_days_for_publish), 1) as avg_days_to_publish,
                   ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM papers WHERE {where_clause}), 1) as percentage
            FROM papers
            WHERE {where_clause}
            GROUP BY submission_license
            ORDER BY paper_count DESC
        """
        license_dist_df = pd.read_sql_query(license_dist_query, conn, params=params)
        
        # By subject
        subject_license_query = f"""
            SELECT preprint_subject,
                   submission_license,
                   COUNT(*) as paper_count,
                   ROUND(AVG(total_citation), 1) as avg_citations
            FROM papers
            WHERE {where_clause}
            GROUP BY preprint_subject, submission_license
            ORDER BY preprint_subject, paper_count DESC
        """
        subject_license_df = pd.read_sql_query(subject_license_query, conn, params=params)
        
        # Trend over time
        trend_query = f"""
            SELECT strftime('%Y', preprint_submission_date) as year,
                   submission_license,
                   COUNT(*) as paper_count
            FROM papers
            WHERE {where_clause}
            GROUP BY year, submission_license
            ORDER BY year, submission_license
        """
        trend_df = pd.read_sql_query(trend_query, conn, params=params)
        
        # Open access vs others
        oa_query = f"""
            SELECT 
                CASE 
                    WHEN submission_license LIKE '%CC%' OR submission_license LIKE '%Creative Commons%' THEN 'Open Access'
                    ELSE 'Other'
                END as license_category,
                COUNT(*) as paper_count,
                ROUND(AVG(total_citation), 1) as avg_citations
            FROM papers
            WHERE {where_clause}
            GROUP BY license_category
        """
        oa_df = pd.read_sql_query(oa_query, conn, params=params)
        
        response = {
            "licenseDistribution": license_dist_df.to_dict("records"),
            "bySubject": subject_license_df.to_dict("records"),
            "trendOverTime": trend_df.to_dict("records"),
            "openAccessComparison": oa_df.to_dict("records"),
            "metadata": {
                "filters": {"subject": subject, "year_from": year_from, "year_to": year_to}
            }
        }
        
        cache[cache_key] = response
        return response
        
    except Exception as e:
        logger.error(f"License analytics error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch license analytics")


# ============================================================================
# Publication Status Analytics
# ============================================================================

@router.get("/publication-status")
def get_publication_status_analytics(
    subject: Optional[str] = Query(None, description="Filter by subject"),
    server: Optional[str] = Query(None, description="Filter by server"),
    year_from: Optional[str] = Query(None, description="Start year"),
    year_to: Optional[str] = Query(None, description="End year"),
    conn: sqlite3.Connection = Depends(get_db_connection),
    cache: Cache = Depends(get_analytics_cache)
):
    """
    Publication status analytics showing:
    - Publication success rate
    - Unpublished high-citation papers
    - Publication patterns
    """
    cache_key = f"pub_status_{subject}_{server}_{year_from}_{year_to}"
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        filters = []
        params = []
        
        if subject:
            filters.append("preprint_subject LIKE ?")
            params.append(f"%{subject}%")
        if server:
            filters.append("preprint_server LIKE ?")
            params.append(f"%{server}%")
        if year_from:
            filters.append("strftime('%Y', preprint_submission_date) >= ?")
            params.append(year_from)
        if year_to:
            filters.append("strftime('%Y', preprint_submission_date) <= ?")
            params.append(year_to)
        
        where_clause = " AND ".join(filters) if filters else "1=1"
        
        # Overall publication rate
        pub_rate_query = f"""
            SELECT 
                COUNT(*) as total_preprints,
                SUM(CASE WHEN published_DOI IS NOT NULL AND published_DOI != '' THEN 1 ELSE 0 END) as published_count,
                ROUND(SUM(CASE WHEN published_DOI IS NOT NULL AND published_DOI != '' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) as publication_rate
            FROM papers
            WHERE {where_clause}
        """
        pub_rate_df = pd.read_sql_query(pub_rate_query, conn, params=params)
        
        # By subject
        subject_pub_query = f"""
            SELECT preprint_subject,
                   COUNT(*) as total_preprints,
                   SUM(CASE WHEN published_DOI IS NOT NULL AND published_DOI != '' THEN 1 ELSE 0 END) as published_count,
                   ROUND(SUM(CASE WHEN published_DOI IS NOT NULL AND published_DOI != '' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) as publication_rate
            FROM papers
            WHERE {where_clause}
            GROUP BY preprint_subject
            HAVING total_preprints >= 10
            ORDER BY publication_rate DESC
        """
        subject_pub_df = pd.read_sql_query(subject_pub_query, conn, params=params)
        
        # By server
        server_pub_query = f"""
            SELECT preprint_server,
                   COUNT(*) as total_preprints,
                   SUM(CASE WHEN published_DOI IS NOT NULL AND published_DOI != '' THEN 1 ELSE 0 END) as published_count,
                   ROUND(SUM(CASE WHEN published_DOI IS NOT NULL AND published_DOI != '' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) as publication_rate
            FROM papers
            WHERE {where_clause}
            GROUP BY preprint_server
            ORDER BY publication_rate DESC
        """
        server_pub_df = pd.read_sql_query(server_pub_query, conn, params=params)
        
        # Unpublished gems (high citations but not published)
        unpublished_gems_query = f"""
            SELECT PPC_Id, preprint_title, total_citation, preprint_submission_date, preprint_subject
            FROM papers
            WHERE (published_DOI IS NULL OR published_DOI = '')
              AND total_citation >= 10
              AND {where_clause}
            ORDER BY total_citation DESC
            LIMIT 50
        """
        unpublished_gems_df = pd.read_sql_query(unpublished_gems_query, conn, params=params)
        
        # Trend over time
        trend_query = f"""
            SELECT strftime('%Y', preprint_submission_date) as year,
                   COUNT(*) as total_preprints,
                   SUM(CASE WHEN published_DOI IS NOT NULL AND published_DOI != '' THEN 1 ELSE 0 END) as published_count,
                   ROUND(SUM(CASE WHEN published_DOI IS NOT NULL AND published_DOI != '' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) as publication_rate
            FROM papers
            WHERE {where_clause}
            GROUP BY year
            ORDER BY year
        """
        trend_df = pd.read_sql_query(trend_query, conn, params=params)
        
        response = {
            "overallRate": pub_rate_df.to_dict("records")[0] if not pub_rate_df.empty else {},
            "bySubject": subject_pub_df.to_dict("records"),
            "byServer": server_pub_df.to_dict("records"),
            "unpublishedGems": unpublished_gems_df.to_dict("records"),
            "trendOverTime": trend_df.to_dict("records"),
            "metadata": {
                "filters": {"subject": subject, "server": server, "year_from": year_from, "year_to": year_to}
            }
        }
        
        cache[cache_key] = response
        return response
        
    except Exception as e:
        logger.error(f"Publication status analytics error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch publication status analytics")