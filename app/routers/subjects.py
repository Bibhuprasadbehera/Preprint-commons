from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
import sqlite3
import pandas as pd
from typing import Optional
from app.database import get_db_connection
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/subjects", tags=["subjects"])


def _build_time_subject_filters(time_range: str, subject: Optional[str], subjects_csv: Optional[str]):
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

    if subjects_csv:
        subjects_list = [s.strip() for s in subjects_csv.split(',') if s.strip()]
        if subjects_list:
            placeholders = ",".join(["?"] * len(subjects_list))
            subject_filter = f" AND preprint_subject IN ({placeholders})"
            params.extend(subjects_list)
    elif subject:
        subject_filter = " AND preprint_subject LIKE ?"
        params.append(f"%{subject}%")

    return time_filter, subject_filter, params


@router.get("/analysis")
def get_subject_analysis(
    time_range: str = Query("all", description="Time range filter: all | last_year | last_5_years | last_10_years"),
    subject: Optional[str] = Query(None, description="Subject filter (substring match)"),
    subjects: Optional[str] = Query(None, description="CSV of subjects for comparison, e.g., 'bioinformatics,neuroscience'"),
    top: int = Query(10, ge=1, le=50, description="Top N subjects to include when no specific subject is selected"),
    conn: sqlite3.Connection = Depends(get_db_connection)
):
    """Unified endpoint that returns subject evolution, citations ranking, and version analysis."""
    try:
        time_filter, subject_filter, params = _build_time_subject_filters(time_range, subject, subjects)

        # 1) Subject Citation Ranking (sum and average citations per subject)
        ranking_query = f"""
            SELECT preprint_subject AS subject,
                   COUNT(*) AS paper_count,
                   COALESCE(SUM(total_citation), 0) AS total_citation,
                   ROUND(COALESCE(AVG(total_citation), 0), 2) AS avg_citation
            FROM papers
            WHERE preprint_subject IS NOT NULL AND preprint_subject != ''
              AND total_citation IS NOT NULL
              AND preprint_submission_date IS NOT NULL
              {time_filter}
              {subject_filter}
            GROUP BY preprint_subject
            ORDER BY total_citation DESC
        """
        ranking_df = pd.read_sql_query(ranking_query, conn, params=params)

        # Determine selected subjects
        subjects_list = [s.strip() for s in subjects.split(',')] if subjects else []
        selected_subjects = None
        if subjects_list:
            available = set(ranking_df['subject'].unique().tolist())
            selected_subjects = set([s for s in subjects_list if s in available])
        elif subject:
            selected_subjects = set(ranking_df['subject'].unique().tolist())
        else:
            selected_subjects = set(ranking_df.head(top)['subject'].tolist())

        # 2) Subject Evolution: yearly counts by subject (limited to selected subjects)
        evolution_query = f"""
            SELECT strftime('%Y', preprint_submission_date) AS year,
                   preprint_subject AS subject,
                   COUNT(*) AS count
            FROM papers
            WHERE preprint_submission_date IS NOT NULL
              AND preprint_subject IS NOT NULL AND preprint_subject != ''
              {time_filter}
              {subject_filter}
            GROUP BY strftime('%Y', preprint_submission_date), preprint_subject
            ORDER BY year, subject
        """
        evolution_df = pd.read_sql_query(evolution_query, conn, params=params)

        if not evolution_df.empty and selected_subjects:
            evolution_df = evolution_df[evolution_df['subject'].isin(list(selected_subjects))]

        # 3) Version Analysis: histogram of version counts
        # Use SQLite JSON1 function json_array_length to compute version count
        version_query = f"""
            SELECT json_array_length(versions) AS versions,
                   COUNT(*) AS count
            FROM papers
            WHERE versions IS NOT NULL
              AND preprint_submission_date IS NOT NULL
              {time_filter}
              {subject_filter}
            GROUP BY json_array_length(versions)
            ORDER BY versions
        """
        # For safety, if JSON1 is not available, this query would fail; we assume JSON1 is enabled as DB created locally.
        version_df = pd.read_sql_query(version_query, conn, params=params)

        version_by_subject_query = f"""
            SELECT preprint_subject AS subject,
                   json_array_length(versions) AS versions,
                   COUNT(*) AS count
            FROM papers
            WHERE versions IS NOT NULL
              AND preprint_submission_date IS NOT NULL
              {time_filter}
              {subject_filter}
            GROUP BY preprint_subject, json_array_length(versions)
            ORDER BY subject, versions
        """
        version_by_subject_df = pd.read_sql_query(version_by_subject_query, conn, params=params)

        # 4) Version summary stats
        summary_query = f"""
            SELECT 
                COUNT(*) AS total_papers,
                SUM(CASE WHEN json_array_length(versions) >= 2 THEN 1 ELSE 0 END) AS multi_version_papers
            FROM papers
            WHERE versions IS NOT NULL
              AND preprint_submission_date IS NOT NULL
              {time_filter}
              {subject_filter}
        """
        summary_df = pd.read_sql_query(summary_query, conn, params=params)
        total_papers = int(summary_df.iloc[0]['total_papers']) if not summary_df.empty else 0
        multi_version_papers = int(summary_df.iloc[0]['multi_version_papers']) if not summary_df.empty else 0
        percent_multi = round((multi_version_papers * 100.0 / total_papers), 2) if total_papers > 0 else 0.0

        # 5) Monthly trends: publications per month for selected subjects
        monthly_query = f"""
            SELECT strftime('%Y-%m', preprint_submission_date) AS month,
                   preprint_subject AS subject,
                   COUNT(*) AS count
            FROM papers
            WHERE preprint_submission_date IS NOT NULL
              AND preprint_subject IS NOT NULL AND preprint_subject != ''
              {time_filter}
              {subject_filter}
            GROUP BY strftime('%Y-%m', preprint_submission_date), preprint_subject
            ORDER BY month, subject
        """
        monthly_df = pd.read_sql_query(monthly_query, conn, params=params)
        if not monthly_df.empty and selected_subjects:
            monthly_df = monthly_df[monthly_df['subject'].isin(list(selected_subjects))]

        # 6) Server distribution by subject
        server_query = f"""
            SELECT preprint_subject AS subject,
                   preprint_server AS server,
                   COUNT(*) AS count
            FROM papers
            WHERE preprint_subject IS NOT NULL AND preprint_subject != ''
              AND preprint_server IS NOT NULL AND preprint_server != ''
              AND preprint_submission_date IS NOT NULL
              {time_filter}
              {subject_filter}
            GROUP BY preprint_subject, preprint_server
            ORDER BY subject, count DESC
        """
        server_df = pd.read_sql_query(server_query, conn, params=params)
        if not server_df.empty and selected_subjects:
            server_df = server_df[server_df['subject'].isin(list(selected_subjects))]

        # 7) Citation growth: papers by year with average citations
        citation_growth_query = f"""
            SELECT strftime('%Y', preprint_submission_date) AS year,
                   preprint_subject AS subject,
                   COUNT(*) AS paper_count,
                   ROUND(AVG(total_citation), 2) AS avg_citation,
                   MAX(total_citation) AS max_citation
            FROM papers
            WHERE preprint_submission_date IS NOT NULL
              AND preprint_subject IS NOT NULL AND preprint_subject != ''
              AND total_citation IS NOT NULL
              {time_filter}
              {subject_filter}
            GROUP BY strftime('%Y', preprint_submission_date), preprint_subject
            ORDER BY year, subject
        """
        citation_growth_df = pd.read_sql_query(citation_growth_query, conn, params=params)
        if not citation_growth_df.empty and selected_subjects:
            citation_growth_df = citation_growth_df[citation_growth_df['subject'].isin(list(selected_subjects))]

        response = {
            "evolutionData": evolution_df.to_dict("records"),
            "citationRanking": ranking_df.to_dict("records") if (subject or subjects_list) else ranking_df.head(top).to_dict("records"),
            "versionDistribution": version_df.to_dict("records"),
            "versionDistributionBySubject": version_by_subject_df.to_dict("records"),
            "monthlyTrends": monthly_df.to_dict("records"),
            "serverDistribution": server_df.to_dict("records"),
            "citationGrowth": citation_growth_df.to_dict("records"),
            "versionSummary": {
                "totalPapers": total_papers,
                "multiVersionPapers": multi_version_papers,
                "percentMultiVersion": percent_multi
            },
            "metadata": {
                "time_range": time_range,
                "subject": subject,
                "subjects": subjects_list,
                "top": top,
                "selectedSubjects": sorted(list(selected_subjects)) if selected_subjects else []
            }
        }

        return JSONResponse(content=response)

    except Exception as e:
        logger.error(f"Subject analysis error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch subject analysis data")
