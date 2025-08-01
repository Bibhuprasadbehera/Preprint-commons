from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import pandas as pd

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the CSV data into a pandas DataFrame
try:
    df = pd.read_csv("combined_db_with_ppc_id.csv")
    df["preprint_submission_date"] = pd.to_datetime(df["preprint_submission_date"])
    df["year"] = df["preprint_submission_date"].dt.year
except FileNotFoundError:
    df = pd.DataFrame()  # Create an empty DataFrame if the file is not found

@app.get("/country-data")
def country_data():
    if df.empty:
        return JSONResponse(content={"data": []})

    # Group by country and year, then count the number of preprints
    country_counts = df.groupby(["country_name", "year"]).size().reset_index(name="count")
    
    # Convert the DataFrame to a list of dictionaries
    data = country_counts.to_dict("records")
    
    return JSONResponse(content={"data": data})

@app.get("/papers")
def fetch_papers(country: str, year: int):
    if df.empty:
        return JSONResponse(content={"papers": []})

    # Filter papers by country and year
    papers = df[(df["country_name"] == country) & (df["year"] == year)]
    
    # Convert the filtered DataFrame to a list of dictionaries
    papers_data = papers.to_dict("records")
    
    return JSONResponse(content={"papers": papers_data})


app.mount("/", StaticFiles(directory="static", html=True), name="static")


#bibhu backend
