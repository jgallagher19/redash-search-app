import os
import types

import pytest

from src.backends.api.data import fetch_csv_data


class MockResponse:
    def __init__(self, text=""):
        self.text = text

    def raise_for_status(self):
        pass


def test_fetch_csv_data(monkeypatch):
    csv_text = "a,b\n1,2\n"

    def mock_get(url):
        assert url == "http://example.com/data.csv"
        return MockResponse(csv_text)

    monkeypatch.setenv("REDASH_CSV_URL", "http://example.com/data.csv")
    import requests
    monkeypatch.setattr(requests, "get", mock_get)

    rows = fetch_csv_data()
    assert rows == [{"a": "1", "b": "2"}]
