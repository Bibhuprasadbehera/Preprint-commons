from cachetools import TTLCache
from app.config import settings

# Initialize a global cache instance
# TTLCache evicts items after a certain time-to-live (ttl) has passed.
# The maxsize parameter defines the maximum number of items the cache can hold.
cache = TTLCache(maxsize=1024, ttl=settings.cache_ttl)

def get_cache():
    """Dependency to get the cache instance."""
    return cache
