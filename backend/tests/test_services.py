import importlib

import pytest
from fastapi import HTTPException

parse_page_range = importlib.import_module("services.pdf_to_image_service").parse_page_range
get_size_bucket = importlib.import_module("utils.logging_config").get_size_bucket


def test_parse_page_range_empty_string_returns_all_pages():
    assert parse_page_range("", total_pages=5) == [0, 1, 2, 3, 4]


def test_parse_page_range_range_1_3():
    assert parse_page_range("1-3", total_pages=5) == [0, 1, 2]


def test_parse_page_range_list_1_3_5():
    assert parse_page_range("1,3,5", total_pages=5) == [0, 2, 4]


def test_parse_page_range_mix_1_3_5():
    assert parse_page_range("1-3,5", total_pages=5) == [0, 1, 2, 4]


def test_parse_page_range_invalid_format_raises_400():
    with pytest.raises(HTTPException) as exc:
        parse_page_range("1--3", total_pages=5)
    assert exc.value.status_code == 400


def test_parse_page_range_out_of_range_raises_400():
    with pytest.raises(HTTPException) as exc:
        parse_page_range("1-10", total_pages=5)
    assert exc.value.status_code == 400


def test_get_size_bucket_small():
    assert get_size_bucket(1000) == "small"


def test_get_size_bucket_medium_lower_bound():
    assert get_size_bucket(1_048_576) == "medium"


def test_get_size_bucket_medium_upper_bound():
    assert get_size_bucket(10_485_760) == "medium"


def test_get_size_bucket_large():
    assert get_size_bucket(10_485_761) == "large"
