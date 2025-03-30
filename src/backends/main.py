import os
import signal
import sys
import asyncio
import threading
import json
import requests
import csv
import logging

from io import StringIO
from typing import TypedDict
from fastapi import FastAPI, Body, Query
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import Config, Server

logging.basicConfig(
    level=logging.INFO,
    format='[%(levelname)s] %(asctime)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

PORT_API = 8008
server_instance = None

app = FastAPI(
    title="Redash CSV Search API",
    version="0.1.0",
)

# Configure CORS settings (for dev/testing purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load configuration from config.json
def load_config():
    # Correctly handles PyInstaller bundles
    if hasattr(sys, '_MEIPASS'):
        base_path = sys._MEIPASS
    else:
        base_path = os.path.abspath(".")

    config_path = os.path.join(base_path, 'config.json')

    with open(config_path) as f:
        return json.load(f)

# CSV fetching logic
def fetch_csv_data():
    config = load_config()
    if config.get("use_mock_data"):
        mock_path = config.get("mock_csv_path")
        if not os.path.exists(mock_path):
            raise FileNotFoundError(f"Mock CSV file not found at {mock_path}")
        with open(mock_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            return list(reader)
    else:
        response = requests.get(config['redash_csv_url'])
        response.raise_for_status()
        reader = csv.DictReader(StringIO(response.text))
        return list(reader)

# Your provided CSV search logic (copied from searcher.py)
def search_data(data, keyword, columns=None, exact=False):
    results = []
    keyword_lower = keyword.lower()

    for row in data:
        if columns:
            fields_to_check = [row[col] for col in columns if col in row]
        else:
            fields_to_check = row.values()

        match_found = False
        for value in fields_to_check:
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

# API endpoint to search your CSV
@app.get("/api/search")
def api_search(keyword: str = Query(...), exact: bool = False):
    try:
        data = fetch_csv_data()
        results = search_data(data, keyword, exact=exact)
        return {"results": results, "count": len(results)}
    except FileNotFoundError as e:
        logging.error(f"File not found: {e}")
        raise HTTPException(status_code=500, detail="Data file not found.")
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")

# Simple health check endpoint
@app.get("/api/health")
def api_health():
    return {"status": "API running", "port": PORT_API}

# --- (Rest of the server code below remains unchanged) ---

def kill_process():
    os.kill(os.getpid(), signal.SIGINT)

def start_api_server(**kwargs):
    global server_instance
    port = kwargs.get("port", PORT_API)
    try:
        if server_instance is None:
            logging.info("[sidecar] Starting API server...")
            config = Config(app, host="0.0.0.0", port=port, log_level="info")
            server_instance = Server(config)
            asyncio.run(server_instance.serve())
        else:
            logging.info("[sidecar] Server instance already running.")
    except Exception as e:
        logging.error(f"[sidecar] Error starting server: {e}")

def stdin_loop():
    logging.info("[sidecar] Waiting for commands...")
    while True:
        user_input = sys.stdin.readline().strip()
        match user_input:
            case "sidecar shutdown":
                logging.info("[sidecar] Received 'sidecar shutdown' command.")
                kill_process()
            case _:
                logging.warning(f"[sidecar] Invalid command [{user_input}].")

def start_input_thread():
    try:
        input_thread = threading.Thread(target=stdin_loop)
        input_thread.daemon = True
        input_thread.start()
    except:
        print("[sidecar] Failed to start input handler.", flush=True)

if __name__ == "__main__":
    start_input_thread()
    start_api_server()