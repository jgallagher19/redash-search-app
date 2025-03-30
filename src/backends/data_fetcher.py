import os
import csv
import requests
from io import StringIO
from config import load_config

def fetch_csv_data():
    config = load_config()

    if config.get("use_mock_data"):
        mock_path = config["mock_csv_path"]
        if not os.path.exists(mock_path):
            raise FileNotFoundError(f"Mock CSV file not found at {mock_path}")
        with open(mock_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            return list(reader)

    # Real data fetching
    response = requests.get(config['redash_csv_url'])
    response.raise_for_status()
    reader = csv.DictReader(StringIO(response.text))
    return list(reader)