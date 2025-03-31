import os
import sys
import json

def load_config():
    base_path = getattr(sys, '_MEIPASS', os.path.abspath("."))
    with open(os.path.join(base_path, 'config.json')) as f:
        config_data = json.load(f)
    return config_data, base_path