from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str
    role: Optional[str] = 'user'

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    role: Optional[str] = 'user'

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    username: Optional[str] = None

# Esquemas para matrices AMFE
class MatrixBase(BaseModel):
    name: str
    description: Optional[str] = None
    data: Dict[str, Any]

class MatrixCreate(MatrixBase):
    pass

class MatrixUpdate(MatrixBase):
    pass

class Matrix(MatrixBase):
    id: int
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True