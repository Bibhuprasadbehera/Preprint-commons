import pandas as pd
import sqlite3
import sys

CSV_INPUT = 'combined_db_with_ppc_id.csv'
DB_NAME = 'ppc.db'
TABLE_NAME = 'papers'

def main():
    try:
        df = pd.read_csv(CSV_INPUT, low_memory=False)
    except FileNotFoundError:
        print(f"Error: '{CSV_INPUT}' not found.\nPlease make sure the file is in the same directory as this script.")
        sys.exit(1)

    with sqlite3.connect(DB_NAME) as conn:
        df.to_sql(TABLE_NAME, conn, if_exists='replace', index=False)

    print(f"Database '{DB_NAME}' with table '{TABLE_NAME}' created successfully.")

if __name__ == "__main__":
    main()
