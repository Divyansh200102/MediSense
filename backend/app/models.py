from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)

    medical_profile = relationship("MedicalProfile", back_populates="user", uselist=False)
    health_logs = relationship("HealthLog", back_populates="user", order_by="HealthLog.created_at.desc()")


class MedicalProfile(Base):
    __tablename__ = "medical_profile"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    age = Column(Integer)
    primary_condition = Column(String(255), default="")
    current_treatments = Column(String(500), default="")
    allergies = Column(String(500), default="")

    user = relationship("User", back_populates="medical_profile")


class HealthLog(Base):
    __tablename__ = "health_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    module_used = Column(String(50), nullable=False)
    user_input = Column(Text, nullable=False)
    ai_response = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="health_logs")
