import sqlite3
import logging
import threading
from contextlib import contextmanager
from typing import Generator
from app.config import settings

logger = logging.getLogger(__name__)

class ThreadSafeDatabaseManager:
    def __init__(self, db_path: str = None):
        self.db_path = db_path or settings.database_name
        self._local = threading.local()

    def get_connection(self) -> sqlite3.Connection:
        """Get thread-local database connection"""
        if not hasattr(self._local, 'connection'):
            self._local.connection = sqlite3.connect(self.db_path)
            self._local.connection.row_factory = sqlite3.Row
            # Enable foreign key constraints
            self._local.connection.execute("PRAGMA foreign_keys = ON")
        return self._local.connection

    def close_connection(self):
        """Close thread-local connection"""
        if hasattr(self._local, 'connection'):
            self._local.connection.close()
            delattr(self._local, 'connection')

    @contextmanager
    def connection_context(self) -> Generator[sqlite3.Connection, None, None]:
        """Context manager for database connections with proper error handling"""
        conn = self.get_connection()
        try:
            yield conn
        except sqlite3.Error as e:
            logger.error(f"Database error: {e}")
            conn.rollback()
            raise
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            conn.rollback()
            raise

    def health_check(self) -> bool:
        """Check if database is accessible"""
        try:
            with self.connection_context() as conn:
                conn.execute("SELECT 1")
                return True
        except Exception as e:
            logger.error(f"Database health check failed: {e}")
            return False

# Global database manager instance
db_manager = ThreadSafeDatabaseManager()

def get_db_connection():
    """Dependency for FastAPI to get database connection"""
    with db_manager.connection_context() as conn:
        yield conn
