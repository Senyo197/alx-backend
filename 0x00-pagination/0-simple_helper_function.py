#!/usr/bin/env python3
"""
function named index_range that takes two integer arguments page and page_size
"""
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    A tuple of size two containing a start index and an end index
    corresponding to the range of indexes to return in a list for those
    particular pagination parameters.
    """
    start_page = (page - 1) * page_size
    end_page = start_page + page_size
    return (start_page, end_page)
