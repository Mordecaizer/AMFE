from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
from app.schemas import UserCreate, UserLogin, User, Token, Matrix, MatrixCreate, MatrixUpdate
from app.models import User as UserModel, AMFEMatrix
from app.services.auth_service import (
    register_user, verify_user, get_user, test_password_hash, 
    create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_user, get_current_admin_user
)
from app.services.matrix_service import get_matrices, get_matrix, create_matrix, update_matrix, delete_matrix
from app.database import get_db

router = APIRouter()

@router.get("/test-hash/{password}")
async def test_hash(password: str):
    """Endpoint de test para verificar que el hash funciona"""
    result = test_password_hash(password)
    return {"password": password, "hash_works": result}

@router.post("/auth/register", response_model=User)
async def register(
    user: UserCreate, 
    db: Session = Depends(get_db),
    current_admin: UserModel = Depends(get_current_admin_user)
):
    """Registrar un nuevo usuario (solo administradores)"""
    created_user = register_user(db, user)
    if created_user is None:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    return created_user

@router.post("/auth/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    verified_user = verify_user(db, user_credentials.username, user_credentials.password)
    if verified_user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": verified_user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": verified_user
    }

@router.get("/users/{username}", response_model=User)
async def read_user(username: str, db: Session = Depends(get_db)):
    user = get_user(db, username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/users", response_model=List[User])
async def list_users(
    db: Session = Depends(get_db),
    current_admin: UserModel = Depends(get_current_admin_user),
    skip: int = 0,
    limit: int = 100
):
    """Listar todos los usuarios (solo administradores)"""
    users = db.query(UserModel).offset(skip).limit(limit).all()
    return users

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: UserModel = Depends(get_current_admin_user)
):
    """Eliminar un usuario (solo administradores)"""
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevenir que el admin se elimine a sí mismo
    if user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@router.get("/matrices", response_model=List[Matrix])
async def read_matrices(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Obtener todas las matrices AMFE"""
    matrices = get_matrices(db, skip=skip, limit=limit)
    return matrices

@router.post("/matrices", response_model=Matrix)
async def create_new_matrix(
    matrix: MatrixCreate, 
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Crear una nueva matriz AMFE"""
    return create_matrix(db=db, matrix=matrix, user_id=current_user.id)

@router.get("/matrices/{matrix_id}", response_model=Matrix)
async def read_matrix(
    matrix_id: int, 
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Obtener una matriz específica"""
    db_matrix = get_matrix(db, matrix_id=matrix_id)
    if db_matrix is None:
        raise HTTPException(status_code=404, detail="Matrix not found")
    return db_matrix

@router.put("/matrices/{matrix_id}", response_model=Matrix)
async def update_existing_matrix(
    matrix_id: int, 
    matrix: MatrixUpdate, 
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Actualizar una matriz existente"""
    db_matrix = update_matrix(db, matrix_id=matrix_id, matrix=matrix)
    if db_matrix is None:
        raise HTTPException(status_code=404, detail="Matrix not found")
    return db_matrix

@router.delete("/matrices/{matrix_id}")
async def delete_existing_matrix(
    matrix_id: int, 
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Eliminar una matriz"""
    success = delete_matrix(db, matrix_id=matrix_id)
    if not success:
        raise HTTPException(status_code=404, detail="Matrix not found")
    return {"message": "Matrix deleted successfully"}