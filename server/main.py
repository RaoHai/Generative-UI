import os

import uvicorn
from fastapi import FastAPI
from dotenv import load_dotenv

from agents.router import router

app = FastAPI(title="Generative UI Demo Server", version="1.0", description="Generative UI Demo Server")

is_dev = bool(os.environ.get("IS_DEV", False))

load_dotenv()

@app.get("/api/greetings")
def home():
  return {"message": "Hello, World!"}

app.include_router(router)

if __name__ == "__main__":
    if is_dev:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=int(os.environ.get("PORT", "8080")),
            reload=True,
        )
    else:
        uvicorn.run(
            app, host="0.0.0.0", port=int(os.environ.get("PORT", "8080"))
        )