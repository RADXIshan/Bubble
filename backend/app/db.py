import os
from dotenv import load_dotenv
from collections.abc import AsyncGenerator
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Relationship
from fastapi_users.db import SQLAlchemyUserDatabase, SQLAlchemyBaseUserTableUUID
from fastapi import Depends

class Base(DeclarativeBase):
    pass

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

connect_args = {}
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
    if "?sslmode=" in DATABASE_URL:
        DATABASE_URL, ssl_query = DATABASE_URL.split("?", 1)
        if "sslmode=require" in ssl_query:
            connect_args["ssl"] = "require"
elif not DATABASE_URL:
    DATABASE_URL = "sqlite+aiosqlite:///./test.db"


class User(SQLAlchemyBaseUserTableUUID, Base):
    posts = Relationship("Post", back_populates="user", foreign_keys="[Post.user_id]")

class Post(Base):
    __tablename__ = "posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey(User.id), nullable=False)
    caption = Column(Text)
    url = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    user = Relationship("User", back_populates="posts")

engine = create_async_engine(DATABASE_URL, connect_args=connect_args)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session

async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)