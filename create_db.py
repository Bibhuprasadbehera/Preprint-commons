import pandas as pd
import random
import sqlite3
import sys

COUNTRIES = [
    'USA', 'India', 'China', 'Germany', 'Brazil', 'France',
    'Canada', 'Australia', 'Japan', 'UK', 'Mexico', 'Russia', 'Italy'
]
CSV_INPUT = 'filtered_medrxiv_papers.csv'
CSV_OUTPUT = 'Dummydata.csv'
DB_NAME = 'Dummy_Medarxiv.db'
TABLE_NAME = 'entries'

def main():
    try:
        df = pd.read_csv(CSV_INPUT)
    except FileNotFoundError:
        print(f"Error: '{CSV_INPUT}' not found.\nPlease make sure the file is in the same directory as this script.")
        sys.exit(1)

    df['country'] = [random.choice(COUNTRIES) for _ in range(len(df))]
    df.to_csv(CSV_OUTPUT, index=False)

    # Reload to ensure consistency
    df = pd.read_csv(CSV_OUTPUT)

    with sqlite3.connect(DB_NAME) as conn:
        df.to_sql(TABLE_NAME, conn, if_exists='replace', index=False)

    print(f"Database '{DB_NAME}' with table '{TABLE_NAME}' created successfully.")

if __name__ == "__main__":
    main()
