import requests

BASE_URL = "https://preprintcommons.online/api"

# Replace sample IDs/params with real ones as needed (especially PPC IDs and author names).
ENDPOINTS = [
    # Health
    "/health",

    # Papers router (api/papers/*)
    "/papers/search?query=neuro&page=1&page_size=5",
    "/papers/search?query=covid&page=1&page_size=5",
    "/papers/",  # list
    "/papers/PPC00000001",  # replace with an actual PPC_Id in your DB
    "/papers/subjects",
    "/papers/servers",
    "/papers/countries",
    "/papers/licenses",
    "/papers/advanced-search",  # GET to confirm route exists (POST not exercised here)

    # Analytics router (api/analytics/*)
    "/analytics/subjects",
    "/analytics/country-data",
    "/analytics/dashboard",
    "/analytics/citations?time_range=last_year",
    "/analytics/citations?time_range=last_5_years",
    "/analytics/citations?time_range=last_10_years",
    "/analytics/citations?subject=genomics",
    "/analytics/citations?subject=neuroscience",
    "/analytics/citations?sort_by=citations_desc&limit=20",
    "/analytics/citations?time_range=last_5_years&subject=bioinformatics",

    # Subjects router (api/subjects/*)
    "/subjects/analysis?time_range=last_year&subjects=genomics",
    "/subjects/analysis?time_range=last_5_years&subjects=genomics,neuroscience",
    "/subjects/analysis?time_range=last_10_years&subjects=bioinformatics,neuroscience,genomics",

    # Authors router (api/authors/*)
    "/authors/search?query=smith",
    "/authors/list",
    "/authors/smith/papers",  # replace `smith` with an existing author

    # Advanced Analytics router (api/advanced-analytics/*)
    "/advanced-analytics/publication-timeline",
    "/advanced-analytics/submission-type-analytics",
    "/advanced-analytics/citation-network",
    "/advanced-analytics/citation-sources",
    "/advanced-analytics/version-analytics",
    "/advanced-analytics/license-analytics",
    "/advanced-analytics/publication-status",

    # Legacy endpoints in main.py (no /api prefix)
    "/country-data",
    "/analytics-data",
    "/subjects",
    "/citation-data-unified",
    "/papers",
    "/paper/PPC00000001",  # replace with actual PPC_Id
    "/search?query=neuro",
    "/",
]

def main():
    print("🔍 Running Production Endpoint Diagnostics...\n")
    for endpoint in ENDPOINTS:
        url = f"{BASE_URL}{endpoint}"
        try:
            response = requests.get(url, timeout=8)
            if response.status_code == 200:
                print(f"✅ [200 OK]  -> {endpoint}")
            else:
                snippet = response.text[:200].replace("\n", " ")
                print(f"❌ [{response.status_code}] Error on -> {endpoint}\n   Snippet: {snippet}")
        except Exception as e:
            print(f"💥 [CRASH] Failed to connect to -> {endpoint}. Error: {e}")

    print("\n📊 Diagnostics Complete.")

if __name__ == "__main__":
    main()
