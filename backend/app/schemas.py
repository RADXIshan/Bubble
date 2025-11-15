from pydantic import BaseModel

class ServerStatus(BaseModel):
    status: str
    message: str

class PostResponse(BaseModel):
    title: str
    content: str

class PostCreate(BaseModel):
    title: str
    content: str