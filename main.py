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

@app.get("/citation-impact")
def get_citation_impact(
    time_range: str = "all", 
    subject: str = None, 
    conn: sqlite3.Connection = Depends(get_db_connection)
):
    """Get citation impact data for scatter plot visualization"""
    print(f"🚀 Citation Impact API called with time_range={time_range}, subject={subject}")
    base_query = """
        SELECT PPC_Id, preprint_title, preprint_submission_date as publication_date, 
               total_citation, all_authors, preprint_subject
        FROM papers 
        WHERE total_citation IS NOT NULL
    """
    
    params = []
    
    # Add time range filter
    if time_range != "all":
        current_year = pd.Timestamp.now().year
        if time_range == "last_year":
            base_query += " AND strftime('%Y', preprint_submission_date) >= ?"
            params.append(str(current_year - 1))
        elif time_range == "last_5_years":
            base_query += " AND strftime('%Y', preprint_submission_date) >= ?"
            params.append(str(current_year - 5))
        elif time_range == "last_10_years":
            base_query += " AND strftime('%Y', preprint_submission_date) >= ?"
            params.append(str(current_year - 10))
    
    # Add subject filter
    if subject:
        base_query += " AND preprint_subject LIKE ?"
        params.append(f"%{subject}%")
    
    base_query += " ORDER BY total_citation DESC LIMIT 1000"
    
    df = pd.read_sql_query(base_query, conn, params=params)
    conn.close()
    
    print(f"✅ Citation Impact: Returning {len(df)} records")
    return JSONResponse(content={"data": df.to_dict("records")})

@app.get("/citation-trends")
def get_citation_trends(
    time_range: str = "all", 
    subject: str = None, 
    conn: sqlite3.Connection = Depends(get_db_connection)
):
    """Get citation trends over time for area chart"""
    print(f"🚀 Citation Trends API called with time_range={time_range}, subject={subject}")
    base_query = """
        SELECT strftime('%Y', preprint_submission_date) as year,
               SUM(total_citation) as citations,
               COUNT(*) as papers
        FROM papers 
        WHERE total_citation IS NOT NULL 
        AND preprint_submission_date IS NOT NULL
    """
    
    params = []
    
    # Add time range filter
    if time_range != "all":
        current_year = pd.Timestamp.now().year
        if time_range == "last_year":
            base_query += " AND strftime('%Y', preprint_submission_date) >= ?"
            params.append(str(current_year - 1))
        elif time_range == "last_5_years":
            base_query += " AND strftime('%Y', preprint_submission_date) >= ?"
            params.append(str(current_year - 5))
        elif time_range == "last_10_years":
            base_query += " AND strftime('%Y', preprint_submission_date) >= ?"
            params.append(str(current_year - 10))
    
    # Add subject filter
    if subject:
        base_query += " AND preprint_subject LIKE ?"
        params.append(f"%{subject}%")
    
    base_query += " GROUP BY strftime('%Y', preprint_submission_date) ORDER BY year"
    
    df = pd.read_sql_query(base_query, conn, params=params)
    conn.close()
    
    print(f"✅ Citation Trends: Returning {len(df)} records")
    return JSONResponse(content={"data": df.to_dict("records")})

@app.get("/citation-heatmap")
def get_citation_heatmap(
    time_range: str = "all",
    conn: sqlite3.Connection = Depends(get_db_connection)
):
    """Get citation heatmap data by year and month"""
    print(f"🚀 Citation Heatmap API called with time_range={time_range}")
    base_query = """
        SELECT strftime('%Y', preprint_submission_date) as year,
               strftime('%m', preprint_submission_date) as month,
               strftime('%d', preprint_submission_date) as day,
               SUM(total_citation) as citations
        FROM papers 
        WHERE total_citation IS NOT NULL 
        AND preprint_submission_date IS NOT NULL
    """
    
    params = []
    
    # Add time range filter
    if time_range != "all":
        current_year = pd.Timestamp.now().year
        if time_range == "last_year":
            base_query += " AND strftime('%Y', preprint_submission_date) >= ?"
            params.append(str(current_year - 1))
        elif time_range == "last_5_years":
            base_query += " AND strftime('%Y', preprint_submission_date) >= ?"
            params.append(str(current_year - 5))
        elif time_range == "last_10_years":
            base_query += " AND strftime('%Y', preprint_submission_date) >= ?"
            params.append(str(current_year - 10))
    
    base_query += " GROUP BY strftime('%Y', preprint_submission_date), strftime('%m', preprint_submission_date)"
    
    df = pd.read_sql_query(base_query, conn, params=params)
    
    # Convert string columns to integers
    if not df.empty:
        df['year'] = df['year'].astype(int)
        df['month'] = df['month'].astype(int)
        df['day'] = df['day'].astype(int)
        df['citations'] = df['citations'].fillna(0).astype(int)
    
    conn.close()
    
    print(f"✅ Citation Heatmap: Returning {len(df)} records")
    return JSONResponse(content={"data": df.to_dict("records")})

@app.get("/top-cited-papers")
def get_top_cited_papers(
    limit: int = 10,
    sort_by: str = "citations_desc",
    time_range: str = "all",
    subject: str = None,
    conn: sqlite3.Connection = Depends(get_db_connection)
):
    """Get top cited papers with sorting options"""
    print(f"🚀 Top Cited Papers API called with limit={limit}, sort_by={sort_by}, time_range={time_range}, subject={subject}")
    base_query = """
        SELECT PPC_Id, preprint_title, preprint_submission_date as publication_date,
               total_citation, all_authors, preprint_subject
        FROM papers 
        WHERE total_citation IS NOT NULL
    """
    
    params = []
    
    # Add time range filter
    if time_range != "all":
        current_year = pd.Timestamp.now().year
        if time_range == "last_year":
            base_query += " AND strftime('%Y', preprint_submission_date) >= ?"
            params.append(str(current_year - 1))
        elif time_range == "last_5_years":
            base_query += " AND strftime('%Y', preprint_submission_date) >= ?"
            params.append(str(current_year - 5))
        elif time_range == "last_10_years":
            base_query += " AND strftime('%Y', preprint_submission_date) >= ?"
            params.append(str(current_year - 10))
    
    # Add subject filter
    if subject:
        base_query += " AND preprint_subject LIKE ?"
        params.append(f"%{subject}%")
    
    # Add sorting
    if sort_by == "citations_desc":
        base_query += " ORDER BY total_citation DESC"
    elif sort_by == "citations_asc":
        base_query += " ORDER BY total_citation ASC"
    elif sort_by == "date_desc":
        base_query += " ORDER BY preprint_submission_date DESC"
    elif sort_by == "date_asc":
        base_query += " ORDER BY preprint_submission_date ASC"
    elif sort_by == "title_asc":
        base_query += " ORDER BY preprint_title ASC"
    else:
        base_query += " ORDER BY total_citation DESC"
    
    base_query += f" LIMIT {limit}"
    
    df = pd.read_sql_query(base_query, conn, params=params)
    conn.close()
    
    print(f"✅ Top Cited Papers: Returning {len(df)} records")
    return JSONResponse(content={"data": df.to_dict("records")})

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