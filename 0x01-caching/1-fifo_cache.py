#!/usr/bin/env python3
"""FIFO caching"""

from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """
    FIFOCache class inherits from BaseCaching and implements a caching system
    using the FIFO algorithm.
    """

    def __init__(self):
        """
        Initializes the FIFOCache object.
        """
        super().__init__()

    def put(self, key, item):
        """
        Puts an item into the cache.

        Args:
            key: The key associated with the item.
            item: The item to be cached.

        Returns:
            None
        """
        if key is None or item is None:
            return

        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            # Get the first item (oldest) inserted into the cache
            oldest_key = next(iter(self.cache_data))
            print(f"DISCARD: {oldest_key}")
            del self.cache_data[oldest_key]

        self.cache_data[key] = item

    def get(self, key):
        """
        Retrieves an item from the cache based on the provided key.

        Args:
            key: The key associated with the item to be retrieved.

        Returns:
            The item associated with the provided key, or None if the key
            doesn't exist in the cache.
        """
        if key is None or key not in self.cache_data:
            return None

        return self.cache_data[key]
