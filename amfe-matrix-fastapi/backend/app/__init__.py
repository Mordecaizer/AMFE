from .database import engine
from .models import Base

# Crea las tablas en la base de datos
def init_db():
    Base.metadata.create_all(bind=engine)

init_db()