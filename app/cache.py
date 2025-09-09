from cachetools import TTLCache
from app.config import settings

# Initialize a global cache instance for general data
# TTLCache evicts items after a certain time-to-live (ttl) has passed.
cache = TTLCache(maxsize=1024, ttl=settings.cache_ttl)

# Initialize a separate cache instance for analytics data with longer TTL
analytics_cache = TTLCache(maxsize=512, ttl=settings.analytics_cache_ttl)

def get_cache():
    """Dependency to get the general cache instance."""
    return cache

def get_analytics_cache():
    """Dependency to get the analytics cache instance."""
    return analytics_cache
