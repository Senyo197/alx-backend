#!/usr/bin/env python3
""" LIFO Caching """

from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """
    LIFOCache class inherits from BaseCaching and implements a caching system
    using the LIFO algorithm.
    """

    def __init__(self):
        """
        Initializes the LIFOCache object.
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
            # Get the last item (most recently added) inserted into the cache
            last_key = next(reversed(self.cache_data))
            print(f"DISCARD: {last_key}")
            del self.cache_data[last_key]

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
