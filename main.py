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

#bibhu backend
