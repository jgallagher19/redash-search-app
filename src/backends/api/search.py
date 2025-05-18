def search_data(data, keyword, columns=None, exact=False):
    """Search rows for keyword."""
    results = []
    keyword_lower = keyword.lower()

    for row in data:
        fields = [row[col] for col in columns if col in row] if columns else row.values()
        match_found = False
        for value in fields:
            val_str = str(value).lower()
            if exact:
                if val_str == keyword_lower:
                    match_found = True
                    break
            else:
                if keyword_lower in val_str:
                    match_found = True
                    break
        if match_found:
            results.append(row)
    return results
