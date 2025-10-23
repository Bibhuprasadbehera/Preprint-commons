import pandas as pd
import sqlite3
import sys
import logging

CSV_INPUT = 'combined_db_with_updated_country.csv'
DB_NAME = 'ppc.db'
TABLE_NAME = 'papers'

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def create_indexes(conn):
    """Create database indexes for performance optimization"""
    try:
        cursor = conn.cursor()
        
        logger.info("Creating database indexes for performance optimization...")
        
        # List of indexes to create
        indexes = [
            # Core search fields
            "CREATE INDEX IF NOT EXISTS idx_papers_preprint_submission_date ON papers(preprint_submission_date)",
            "CREATE INDEX IF NOT EXISTS idx_papers_preprint_subject ON papers(preprint_subject)",
            "CREATE INDEX IF NOT EXISTS idx_papers_country_name ON papers(country_name)",
            "CREATE INDEX IF NOT EXISTS idx_papers_total_citation ON papers(total_citation)",
            "CREATE INDEX IF NOT EXISTS idx_papers_preprint_title ON papers(preprint_title)",
            "CREATE INDEX IF NOT EXISTS idx_papers_all_authors ON papers(all_authors)",
            "CREATE INDEX IF NOT EXISTS idx_papers_preprint_server ON papers(preprint_server)",
            
            # Composite indexes for common query patterns
            "CREATE INDEX IF NOT EXISTS idx_papers_subject_date ON papers(preprint_subject, preprint_submission_date)",
            "CREATE INDEX IF NOT EXISTS idx_papers_citation_date ON papers(total_citation, preprint_submission_date)",
            "CREATE INDEX IF NOT EXISTS idx_papers_country_date ON papers(country_name, preprint_submission_date)",
            
            # Index for search functionality
            "CREATE INDEX IF NOT EXISTS idx_papers_search ON papers(preprint_title, preprint_doi, all_authors)",
        ]
        
        for index_sql in indexes:
            cursor.execute(index_sql)
            logger.info(f"Created index: {index_sql.split('ON')[1].strip()}")
        
        conn.commit()
        logger.info("Database optimization completed successfully!")
        
        # Show index information
        cursor.execute("SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%'")
        indexes_created = cursor.fetchall()
        logger.info(f"Total indexes created: {len(indexes_created)}")
        
        for idx in indexes_created:
            logger.info(f"  - {idx[0]}")
            
    except Exception as e:
        logger.error(f"Error creating indexes: {e}")
        raise

def main():
    try:
        df = pd.read_csv(CSV_INPUT, low_memory=False)
    except FileNotFoundError:
        print(f"Error: '{CSV_INPUT}' not found.\nPlease make sure the file is in the same directory as this script.")
        sys.exit(1)

    with sqlite3.connect(DB_NAME) as conn:
        # Create the main table
        df.to_sql(TABLE_NAME, conn, if_exists='replace', index=False)
        logger.info(f"Database '{DB_NAME}' with table '{TABLE_NAME}' created successfully.")
        
        # Create indexes for performance optimization
        create_indexes(conn)

    print(f"\n✅ Database creation and optimization completed!")
    print(f"📊 Database: {DB_NAME}")
    print(f"📋 Table: {TABLE_NAME}")
    print("🚀 Performance indexes: All performance indexes created successfully")

if __name__ == "__main__":
    main()
