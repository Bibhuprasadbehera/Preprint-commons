from fastapi import FastAPI, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import pandas as pd

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8000", "http://localhost:8000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE = 'ppc.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/country-data")
def country_data(conn: sqlite3.Connection = Depends(get_db_connection)):
    query = "SELECT country_name, strftime('%Y', preprint_submission_date) as year, COUNT(*) as count FROM papers GROUP BY country_name, year"
    df = pd.read_sql_query(query, conn)
    conn.close()
    return JSONResponse(content={"data": df.to_dict("records")})

@app.get("/papers")
def fetch_papers(country: str, year: int, conn: sqlite3.Connection = Depends(get_db_connection)):
    query = "SELECT * FROM papers WHERE country_name = ? AND strftime('%Y', preprint_submission_date) = ?"
    df = pd.read_sql_query(query, conn, params=(country, str(year)))
    conn.close()
    return JSONResponse(content={"papers": df.to_dict("records")})

@app.get("/search")
def search_papers(query: str, conn: sqlite3.Connection = Depends(get_db_connection)):
    sql_query = "SELECT * FROM papers WHERE preprint_title LIKE ? OR preprint_doi LIKE ? LIMIT 10"
    df = pd.read_sql_query(sql_query, conn, params=(f"%{query}%", f"%{query}%"))
    conn.close()
    return JSONResponse(content=df.to_dict("records"))

@app.get("/paper/{ppc_id}")
def get_paper(ppc_id: str, conn: sqlite3.Connection = Depends(get_db_connection)):
    query = "SELECT * FROM papers WHERE PPC_Id = ?"
    df = pd.read_sql_query(query, conn, params=(ppc_id,))
    conn.close()
    if df.empty:
        return JSONResponse(content={}, status_code=404)
    return JSONResponse(content=df.iloc[0].to_dict())

@app.get("/citation-data-unified")
def get_unified_citation_data(
    time_range: str = "all",
    subject: str = None,
    limit: int = 10,
    sort_by: str = "citations_desc",
    conn: sqlite3.Connection = Depends(get_db_connection)
):
    """Unified endpoint that returns all citation data for consistency across charts"""
    print(f"🚀 Unified Citation Data API called with time_range={time_range}, subject={subject}, limit={limit}, sort_by={sort_by}")
    
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
    
    # 1. Citation Impact Data (for scatter plot)
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
    
    # 2. Citation Trends Data (for area chart)
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
    
    # 3. Citation Heatmap Data (by year and month)
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
    # Note: Heatmap doesn't use subject filter as it's typically used for temporal patterns
    heatmap_params = [p for p in params if not p.startswith('%')]  # Remove subject params
    heatmap_df = pd.read_sql_query(heatmap_query, conn, params=heatmap_params)
    
    # Convert heatmap columns to integers
    if not heatmap_df.empty:
        heatmap_df['year'] = heatmap_df['year'].astype(int)
        heatmap_df['month'] = heatmap_df['month'].astype(int)
        heatmap_df['day'] = heatmap_df['day'].astype(int)
        heatmap_df['citations'] = heatmap_df['citations'].fillna(0).astype(int)
    
    # 4. Top Cited Papers Data
    # Add sorting logic
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
    
    conn.close()
    
    # Prepare unified response
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
    
    print(f"✅ Unified Citation Data: Returning impact={len(impact_df)}, trends={len(trends_df)}, heatmap={len(heatmap_df)}, top_papers={len(top_papers_df)} records")
    return JSONResponse(content=response_data)


@app.get("/subjects")
def get_subjects(conn: sqlite3.Connection = Depends(get_db_connection)):
    """Get all unique subject areas from the database"""
    print("🚀 Subjects API called")
    
    query = """
        SELECT DISTINCT preprint_subject
        FROM papers 
        WHERE preprint_subject IS NOT NULL 
        AND preprint_subject != ''
        ORDER BY preprint_subject
    """
    
    df = pd.read_sql_query(query, conn)
    conn.close()
    
    subjects = df['preprint_subject'].tolist()
    print(f"✅ Subjects: Returning {len(subjects)} unique subjects")
    
    return JSONResponse(content={"data": subjects})

#bibhu backend