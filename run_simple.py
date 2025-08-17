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
    print("   - Health: http://localhost:8000/country-data")
    print("   - Search: http://localhost:8000/search?query=covid")
    print("   - Analytics: http://localhost:8000/analytics-data")
    print("\n" + "="*50)
    
    uvicorn.run(
        "main:app",  # This points to your existing main.py
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload on file changes
        log_level="info"
    )