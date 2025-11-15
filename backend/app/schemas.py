from pydantic import BaseModel
from fastapi_users import schemas
import uuid

class ServerStatus(BaseModel):
    status: str
    message: str

class PostResponse(BaseModel):
    title: str
    content: str

class PostCreate(BaseModel):
    title: str
    content: str

class UserRead(schemas.BaseUser[uuid.UUID]):
    id: uuid.UUID
    email: str
    is_active: bool
    is_superuser: bool

class UserCreate(schemas.BaseUserCreate):
    email: str
    password: str

class UserUpdate(schemas.BaseUserUpdate):
    pass