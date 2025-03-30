import logging
from fastapi import HTTPException


# Example api logic
def completions(data):
    try:
        prompt: str = data["prompt"]
        logging.info(f"[server] Sent prompt: '{prompt}'")
        # Example response
        return {"message": f"query: [{prompt}]\nanswer: [...]"}
    except KeyError:
        logging.error("[server] Error: Expected format {'prompt':'text string here'}")
        raise HTTPException(
            status_code=400, detail="Invalid JSON format: 'prompt' key not found"
        )
