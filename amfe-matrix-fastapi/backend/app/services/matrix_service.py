from sqlalchemy.orm import Session
from app.models import AMFEMatrix, User
from app.schemas import MatrixCreate
from typing import List

def get_matrices(db: Session, skip: int = 0, limit: int = 100) -> List[AMFEMatrix]:
    """Obtener todas las matrices AMFE"""
    return db.query(AMFEMatrix).offset(skip).limit(limit).all()

def get_matrix(db: Session, matrix_id: int) -> AMFEMatrix:
    """Obtener una matriz específica por ID"""
    return db.query(AMFEMatrix).filter(AMFEMatrix.id == matrix_id).first()

def create_matrix(db: Session, matrix: MatrixCreate, user_id: int) -> AMFEMatrix:
    """Crear una nueva matriz AMFE"""
    db_matrix = AMFEMatrix(
        name=matrix.name,
        description=matrix.description,
        data=matrix.data,
        created_by=user_id
    )
    db.add(db_matrix)
    db.commit()
    db.refresh(db_matrix)
    return db_matrix

def update_matrix(db: Session, matrix_id: int, matrix: MatrixCreate) -> AMFEMatrix:
    """Actualizar una matriz existente"""
    db_matrix = db.query(AMFEMatrix).filter(AMFEMatrix.id == matrix_id).first()
    if db_matrix:
        db_matrix.name = matrix.name
        db_matrix.description = matrix.description
        db_matrix.data = matrix.data
        db.commit()
        db.refresh(db_matrix)
    return db_matrix

def delete_matrix(db: Session, matrix_id: int) -> bool:
    """Eliminar una matriz"""
    db_matrix = db.query(AMFEMatrix).filter(AMFEMatrix.id == matrix_id).first()
    if db_matrix:
        db.delete(db_matrix)
        db.commit()
        return True
    return False
