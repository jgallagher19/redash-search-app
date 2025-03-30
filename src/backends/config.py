import os
import sys
import json

def load_config():
    base_path = getattr(sys, '_MEIPASS', os.path.abspath("."))
    with open(os.path.join(base_path, 'config.json')) as f:
        return json.load(f)