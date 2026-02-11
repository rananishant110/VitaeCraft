"""
PostgreSQL Database Configuration and Session Management
"""

import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import event
from sqlalchemy.pool import NullPool

# Database URL
DATABASE_URL = os.environ.get(
    'DATABASE_URL',
    'postgresql+asyncpg://neelam@localhost:5432/vitaecraft'
)

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL logging
    poolclass=NullPool,  # Better for serverless (Vercel)
)

# Session factory
async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)

# Base class for models
Base = declarative_base()


async def get_db():
    """Dependency for getting DB session in routes"""
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    """Initialize database tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database tables created/verified")


async def drop_db():
    """Drop all tables (use with caution)"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    print("⚠️  All database tables dropped")
