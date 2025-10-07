from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models import User
from app.schemas import UserCreate
from app.database import get_db

# Configuración JWT
SECRET_KEY = "tu_clave_secreta_super_segura_aqui"  # En producción, usar variable de entorno
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def get_password_hash(password: str) -> str:
    hashed = pwd_context.hash(password)
    print(f"DEBUG: Hashing password '{password}' -> '{hashed[:20]}...'")
    return hashed

def verify_password(plain_password: str, hashed_password: str) -> bool:
    result = pwd_context.verify(plain_password, hashed_password)
    print(f"DEBUG: Verificando '{plain_password}' contra hash '{hashed_password[:20]}...' -> {result}")
    return result

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def test_password_hash(password: str) -> bool:
    """Función de test para verificar que el hash funciona correctamente"""
    hashed = get_password_hash(password)
    verified = verify_password(password, hashed)
    print(f"DEBUG TEST: Password '{password}' -> Hash correcto: {verified}")
    return verified

def register_user(db: Session, user: UserCreate):
    existing_user = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()

    if existing_user:
        return None

    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, email=user.email, password=hashed_password, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def verify_user(db: Session, username: str, password: str):
    print(f"DEBUG: Intentando login con username: {username}")
    user = db.query(User).filter_by(username=username).first()
    if user:
        print(f"DEBUG: Usuario encontrado: {user.username}")
        password_match = verify_password(password, user.password)
        print(f"DEBUG: Contraseña coincide: {password_match}")
        if password_match:
            return user
        else:
            print("DEBUG: Contraseña incorrecta")
            return None
    else:
        print("DEBUG: Usuario no encontrado")
        return None

def get_user(db: Session, username: str):
    return db.query(User).filter_by(username=username).first()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verificar y decodificar el token JWT"""
    try:
        token = credentials.credentials
        print(f"DEBUG: Verificando token: {token[:20]}...")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        print(f"DEBUG: Username extraído del token: {username}")
        if username is None:
            print("DEBUG: Username es None")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return username
    except JWTError as e:
        print(f"DEBUG: Error JWT: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(username: str = Depends(verify_token), db: Session = Depends(get_db)):
    """Obtener el usuario actual a partir del token"""
    print(f"DEBUG: Buscando usuario: {username}")
    user = get_user(db, username)
    if user is None:
        print(f"DEBUG: Usuario no encontrado: {username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    print(f"DEBUG: Usuario encontrado: {user.username} ({user.role})")
    return user

def get_current_admin_user(current_user: User = Depends(get_current_user)):
    """Verificar que el usuario current es administrador"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user