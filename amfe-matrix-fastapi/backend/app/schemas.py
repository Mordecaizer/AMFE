from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any, List
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

# ========================================
# Esquemas para Matriz AMFE Modular
# ========================================

class ItemBase(BaseModel):
    """Base para elementos con descripción"""
    id: str
    descripcion: str

class EfectoPotencial(ItemBase):
    """Efecto potencial de una falla"""
    pass

class CausaPotencial(ItemBase):
    """Causa potencial de una falla"""
    pass

class BarreraExistente(ItemBase):
    """Barrera existente para una falla"""
    pass

class AccionRecomendada(ItemBase):
    """Acción recomendada para mitigar una falla"""
    pass

class AccionTomada(ItemBase):
    """Acción ya tomada para mitigar una falla"""
    pass

class Evaluacion(BaseModel):
    """Evaluación de riesgo de una falla"""
    severidad: int = Field(..., ge=1, le=10, description="Severidad (1-10)")
    detectabilidad: int = Field(..., ge=1, le=10, description="Detectabilidad (1-10)")
    ocurrencia: int = Field(..., ge=1, le=10, description="Ocurrencia (1-10)")
    rpn: Optional[int] = Field(None, description="RPN calculado automáticamente")

    @validator('rpn', always=True)
    def calcular_rpn(cls, v, values):
        """Calcula RPN automáticamente como S × D × O"""
        if 'severidad' in values and 'detectabilidad' in values and 'ocurrencia' in values:
            return values['severidad'] * values['detectabilidad'] * values['ocurrencia']
        return v

class FallaPotencial(BaseModel):
    """Falla potencial de un subproceso"""
    id: str
    descripcion: str
    efectosPotenciales: List[EfectoPotencial] = Field(..., min_items=1, description="Mínimo 1 efecto")
    causasPotenciales: List[CausaPotencial] = Field(..., min_items=1, description="Mínimo 1 causa")
    barrerasExistentes: List[BarreraExistente] = Field(..., min_items=1, description="Mínimo 1 barrera")
    evaluacion: Evaluacion
    accionesRecomendadas: List[AccionRecomendada] = Field(default_factory=list)
    accionesTomadas: List[AccionTomada] = Field(default_factory=list)
    responsable: Optional[str] = None

class Subproceso(BaseModel):
    """Subproceso dentro de un proceso"""
    id: str
    nombre: str
    fallasPotenciales: List[FallaPotencial] = Field(..., min_items=1, description="Mínimo 1 falla potencial")

class Proceso(BaseModel):
    """Proceso principal de la matriz AMFE"""
    id: str
    nombre: str
    color: Optional[str] = "#C6E0B4"  # Verde claro por defecto
    subprocesos: List[Subproceso] = Field(..., min_items=1, description="Mínimo 1 subproceso")

class MatrixHeaderModular(BaseModel):
    """Encabezado de la matriz modular"""
    fundacion: str = "Fundación Clínica Infantil Club Noel"
    codigo: Optional[str] = None
    version: Optional[str] = "1"
    pagina: Optional[str] = "1"
    mes: Optional[str] = None
    año: Optional[str] = None
    servicio: str
    area: str
    elaboradoPor: str
    equipo: str
    fechaEmision: Optional[str] = None

class MatrixModularData(BaseModel):
    """Datos completos de una matriz modular"""
    header: MatrixHeaderModular
    procesos: List[Proceso] = Field(..., min_items=1, description="Mínimo 1 proceso")

class MatrixModularCreate(BaseModel):
    """Crear matriz modular"""
    name: str
    description: Optional[str] = None
    data: MatrixModularData

class MatrixModularUpdate(BaseModel):
    """Actualizar matriz modular"""
    name: Optional[str] = None
    description: Optional[str] = None
    data: Optional[MatrixModularData] = None

class MatrixModular(BaseModel):
    """Matriz modular completa"""
    id: int
    name: str
    description: Optional[str] = None
    data: MatrixModularData
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
