from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import sqlite3
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

app = FastAPI()



# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8000", "http://localhost:8000"],  # Allow frontend origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)



# Database query function
def get_country_counts():
    conn = sqlite3.connect('Dummy_Medarxiv.db')
    cursor = conn.cursor()

    # Query to count the entries per country
    cursor.execute("SELECT country, year, COUNT(*) FROM entries GROUP BY country, year")
    rows = cursor.fetchall()

    conn.close()
    return rows

# Database query function to fetch papers for a country and year
def get_papers_by_country_and_year(country: str, year: int):
    conn = sqlite3.connect('Dummy_Medarxiv.db')
    cursor = conn.cursor()

    # Query to fetch paper details
    cursor.execute("""
        SELECT title, doi, authors 
        FROM entries 
        WHERE country = ? AND year = ?
    """, (country, year))
    rows = cursor.fetchall()

    conn.close()
    return rows

@app.get("/papers")
def fetch_papers(country: str, year: int):
    papers = get_papers_by_country_and_year(country, year)
    return JSONResponse(content={
        "papers": [
            {"title": row[0], "doi": row[1], "authors": row[2].split(", ")} for row in papers
        ]
    })


@app.get("/country-data")
def country_data():
    data = get_country_counts()
    # Convert the data into a dictionary format suitable for D3.js
    return JSONResponse(content={
        "data": [
            {"country": row[0], "year": row[1], "count": row[2]} for row in data
        ]
    })


app.mount("/", StaticFiles(directory="static", html=True), name="static")


#bibhu backend
