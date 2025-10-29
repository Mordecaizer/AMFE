from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router
from app.database import engine
from app.models import Base
import traceback
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(debug=True)

# Configuración de CORS más específica
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes temporalmente
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Middleware para logging de requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    try:
        response = await call_next(request)
        logger.info(f"Response: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        logger.error(traceback.format_exc())
        raise

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Incluir las rutas de la API
app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de amfe-matrix!"}