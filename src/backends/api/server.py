import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from .data import fetch_csv_data
from .search import search_data

PORT_API = int(os.environ.get("PORT", 8008))

app = FastAPI(title="Redash CSV Search API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/api/search")
def api_search(keyword: str = Query(...), exact: bool = False):
    data = fetch_csv_data()
    results = search_data(data, keyword, exact=exact)
    return {"results": results, "count": len(results)}


@app.get("/api/health")
def api_health():
    return {"status": "API running", "port": PORT_API}


def main():
    uvicorn.run(app, host="0.0.0.0", port=PORT_API, log_level="info")


if __name__ == "__main__":
    main()
