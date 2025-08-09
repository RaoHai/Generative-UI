import os

import uvicorn
from fastapi import FastAPI

app = FastAPI(title="Generative UI Demo Server", version="1.0", description="Generative UI Demo Server")


is_dev = bool(os.environ.get("IS_DEV", False))


@app.get("/")
async def home():
  return {"message": "Hello, World!"}


if __name__ == "__main__":
    if is_dev:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=int(os.environ.get("PETERCAT_PORT", "8080")),
            reload=True,
        )
    else:
        uvicorn.run(
            app, host="0.0.0.0", port=int(os.environ.get("PETERCAT_PORT", "8080"))
        )