#!/usr/bin/env python3
"""
Simple runner for your current main.py
"""
import uvicorn

if __name__ == "__main__":
    print("🚀 Starting PPC Backend API...")
    print("📊 API will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔍 Test endpoints:")
    print("   - Health: http://localhost:8000/api/health")
    print("   - Subjects: http://localhost:8000/api/analytics/subjects")
    print("   - Subject Analysis: http://localhost:8000/api/subjects/analysis?time_range=last_5_years&subjects=bioinformatics,neuroscience")
    print("   - Citation Analytics: http://localhost:8000/api/analytics/citations?time_range=last_5_years&subject=bioinformatics")
    print("\n" + "="*50)
    
    uvicorn.run(
        "app.main:app",  # Use the modular FastAPI app with routers
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )