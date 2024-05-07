#!/usr/bin/env python3
"""basic caching """
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """
    BasicCache class inherits from BaseCaching and implements a simple caching
    system.
    """

    def __init__(self):
        """
        Initializes the BasicCache object.
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
