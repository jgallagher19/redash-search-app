import os
import signal
import sys
import asyncio
import threading
from uvicorn import Config, Server

from api import app

PORT_API = 8008
server_instance = None


def kill_process():
    os.kill(os.getpid(), signal.SIGINT)


def start_api_server(**kwargs):
    global server_instance
    port = kwargs.get("port", PORT_API)
    try:
        if server_instance is None:
            print("[sidecar] Starting API server...", flush=True)
            config = Config(app, host="0.0.0.0", port=port, log_level="info")
            server_instance = Server(config)
            asyncio.run(server_instance.serve())
        else:
            print("[sidecar] Server instance already running.", flush=True)
    except Exception as e:
        print(f"[sidecar] Error starting server: {e}", flush=True)


def stdin_loop():
    print("[sidecar] Waiting for commands...", flush=True)
    while True:
        user_input = sys.stdin.readline().strip()
        if user_input == "sidecar shutdown":
            print("[sidecar] Received 'sidecar shutdown' command.", flush=True)
            kill_process()
        else:
            print(f"[sidecar] Invalid command [{user_input}].", flush=True)


def start_input_thread():
    try:
        input_thread = threading.Thread(target=stdin_loop)
        input_thread.daemon = True
        input_thread.start()
    except Exception:
        print("[sidecar] Failed to start input handler.", flush=True)


if __name__ == "__main__":
    start_input_thread()
    start_api_server()
