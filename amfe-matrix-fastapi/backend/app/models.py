from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, func
from app.database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String, default='user')

class AMFEMatrix(Base):
    __tablename__ = 'amfe_matrices'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    data = Column(JSON, nullable=False)
    created_by = Column(Integer, nullable=True)

    def __repr__(self):
        return f'<AMFEMatrix {self.name}>'