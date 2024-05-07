#!/usr/bin/env python3
"""LRU Caching"""

from collections import OrderedDict
from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """
    LRUCache class inherits from BaseCaching and implements a caching system
    using the LRU algorithm.
    """

    def __init__(self):
        """
        Initializes the LRUCache object.
        """
        super().__init__()
        self.cache_data = OrderedDict()

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

        if key in self.cache_data:
            self.cache_data.move_to_end(key)
        elif len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            discarded_key, _ = self.cache_data.popitem(last=False)
            print(f"DISCARD: {discarded_key}")

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

        # Move the accessed key to the end to indicate it was recently used
        self.cache_data.move_to_end(key)
        return self.cache_data[key]
