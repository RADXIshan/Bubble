import os
from dotenv import load_dotenv
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

CLIENT_URL = os.getenv("CLIENT_URL") or "http://localhost:5173"
PORT = int(os.getenv("PORT")) or 8000


class ServerStatus(BaseModel):
    status: str
    message: str


app = FastAPI()

origins = [CLIENT_URL]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=ServerStatus, status_code=200)
def server_live():
    return ServerStatus(status="Success", message="Server is live!")


@app.get("/heath", response_model=ServerStatus, status_code=200)
def server_health():
    return ServerStatus(status="Healthy", message="Server is working perfectly")


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=PORT)
