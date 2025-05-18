from src.backends.api.search import search_data


def test_search_data_partial():
    data = [
        {"name": "Alice", "age": "30"},
        {"name": "Bob", "age": "25"},
    ]
    results = search_data(data, "ali", columns=["name"], exact=False)
    assert results == [{"name": "Alice", "age": "30"}]


def test_search_data_exact():
    data = [
        {"name": "Alice"},
        {"name": "Alice Smith"},
    ]
    results = search_data(data, "Alice", columns=["name"], exact=True)
    assert results == [{"name": "Alice"}]
