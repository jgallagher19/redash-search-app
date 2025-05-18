import csv
from io import StringIO
import requests

from .config import load_config


def fetch_csv_data():
    """Download CSV from configured URL and return rows."""
    config = load_config()
    response = requests.get(config["redash_csv_url"])
    response.raise_for_status()
    reader = csv.DictReader(StringIO(response.text))
    return list(reader)
