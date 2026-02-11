"""
SQLAlchemy ORM Models
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer, Float, Text, ForeignKey, JSON, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from database import Base


class User(Base):
    """User Model"""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    is_premium = Column(Boolean, default=False)
    subscription_type = Column(String(50), default=None)  # 'early_bird', 'lifetime'
    email_verified = Column(Boolean, default=False)
    verification_token = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    cover_letters = relationship("CoverLetter", back_populates="user", cascade="all, delete-orphan")
    password_resets = relationship("PasswordReset", back_populates="user", cascade="all, delete-orphan")
    payments = relationship("PaymentTransaction", back_populates="user", cascade="all, delete-orphan")


class Resume(Base):
    """Resume Model"""
    __tablename__ = "resumes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    template = Column(String(50), default="professional")  # professional, modern, minimalist
    data = Column(JSON, nullable=False, default={})  # Structured resume data
    ats_score = Column(Float, default=0)
    version = Column(Integer, default=1)
    is_public = Column(Boolean, default=False)
    public_slug = Column(String(255), unique=True, nullable=True, index=True)
    public_password = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="resumes")
    versions = relationship("ResumeVersion", back_populates="resume", cascade="all, delete-orphan")
    analytics = relationship("ResumeAnalytics", back_populates="resume", cascade="all, delete-orphan", uselist=False)


class ResumeVersion(Base):
    """Resume Version History"""
    __tablename__ = "resume_versions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id = Column(UUID(as_uuid=True), ForeignKey("resumes.id"), nullable=False, index=True)
    version = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    template = Column(String(50), nullable=False)
    data = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    resume = relationship("Resume", back_populates="versions")

    # Index for fast lookup
    __table_args__ = (Index('ix_resume_versions_resume_version', 'resume_id', 'version', unique=True),)


class CoverLetter(Base):
    """Cover Letter Model"""
    __tablename__ = "cover_letters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    resume_id = Column(UUID(as_uuid=True), ForeignKey("resumes.id"), nullable=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    company_name = Column(String(255), nullable=True)
    job_description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="cover_letters")


class PasswordReset(Base):
    """Password Reset Tokens"""
    __tablename__ = "password_resets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    token = Column(String(255), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="password_resets")


class PaymentTransaction(Base):
    """Payment Transaction History"""
    __tablename__ = "payment_transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String(255), unique=True, nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    plan = Column(String(50), nullable=False)  # 'early_bird', 'lifetime'
    status = Column(String(50), default="pending")  # pending, completed, failed
    payment_status = Column(String(50), default="pending")  # open, complete, expired
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="payments")


class ResumeAnalytics(Base):
    """Resume View/Download Analytics"""
    __tablename__ = "resume_analytics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id = Column(UUID(as_uuid=True), ForeignKey("resumes.id"), unique=True, nullable=False, index=True)
    view_count = Column(Integer, default=0)
    download_count = Column(Integer, default=0)
    ats_score_history = Column(JSON, default=[])
    last_viewed = Column(DateTime(timezone=True), nullable=True)
    last_downloaded = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    resume = relationship("Resume", back_populates="analytics")


class UserPreferences(Base):
    """User Preferences (theme, etc.)"""
    __tablename__ = "user_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False, index=True)
    theme = Column(String(20), default="light")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class PublicResume(Base):
    """Public Resume Sharing"""
    __tablename__ = "public_resumes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id = Column(UUID(as_uuid=True), ForeignKey("resumes.id"), unique=True, nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)
    is_password_protected = Column(Boolean, default=False)
    view_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
