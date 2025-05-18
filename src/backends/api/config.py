import json
import os
import sys


def load_config():
    """Load configuration from file or environment."""
    if "REDASH_CSV_URL" in os.environ:
        return {"redash_csv_url": os.environ["REDASH_CSV_URL"]}

    if hasattr(sys, "_MEIPASS"):
        base_path = sys._MEIPASS
    else:
        base_path = os.path.abspath(".")

    config_path = os.path.join(base_path, "config.json")
    with open(config_path) as f:
        return json.load(f)
