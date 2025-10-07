# CLUB NOEL - Sistema de Gestión AMFE

Sistema web para la gestión de matrices AMFE (Análisis de Modo y Efecto de Fallas) desarrollado con FastAPI, React y PostgreSQL.

## 🏗️ Estructura del Proyecto

```
amfe-matrix-fastapi/
├── backend/                    # 🖥️ API FastAPI
│   ├── app/                   # Código de la aplicación
│   │   ├── api/              # Rutas de la API
│   │   ├── services/         # Lógica de negocio
│   │   ├── models.py         # Modelos de base de datos
│   │   ├── schemas.py        # Esquemas Pydantic
│   │   ├── database.py       # Configuración de DB
│   │   └── main.py          # Aplicación principal
│   ├── alembic/             # Migraciones de DB
│   ├── Dockerfile           # Imagen Docker del backend
│   ├── requirements.txt     # Dependencias Python
│   ├── create_admin_user.py # Script para crear usuario admin
│   └── verify_system.py     # Script de verificación
├── frontend/                # 🌐 Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # Servicios API
│   │   ├── context/         # Context de autenticación
│   │   └── App.js          # Componente principal
│   ├── public/             # Archivos estáticos
│   └── Dockerfile          # Imagen Docker del frontend
├── docker-compose.yml      # ⚙️ Configuración de servicios
├── start_system.ps1        # 🚀 Script de inicio rápido
└── README.md              # 📖 Esta documentación
```

## 🚀 Inicio Rápido

### **Usando Docker (Recomendado)**

```bash
# 1. Iniciar todo el sistema
.\start_system.ps1

# O manualmente:
docker-compose up --build -d
docker-compose exec backend python create_admin_user.py
```

### **URLs del Sistema**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000/docs
- **Base de Datos**: localhost:5432

## 🔐 Credenciales por Defecto

- **Usuario**: `admin`
- **Contraseña**: `admin123`

## 🛠️ Tecnologías

- **Backend**: FastAPI + PostgreSQL + SQLAlchemy + JWT
- **Frontend**: React + React Router + Context API
- **Base de Datos**: PostgreSQL
- **Containerización**: Docker + Docker Compose

## 📋 Funcionalidades

### ✅ Autenticación y Usuarios
- Login/logout con JWT
- Control de roles (Admin/User)
- Solo admins pueden crear usuarios

### ✅ Matrices AMFE
- Crear, editar, eliminar matrices
- Campos completos: severidad, ocurrencia, detección, RPN
- Acciones recomendadas y seguimiento
- Estados y responsables

### ✅ Panel de Administración
- Gestión de usuarios
- Estadísticas del sistema

## � Comandos Útiles

```bash
# Detener sistema
docker-compose down

# Ver logs
docker-compose logs backend
docker-compose logs frontend

# Reiniciar servicios
docker-compose restart

# Limpiar volúmenes
docker-compose down -v
```

## 📄 Licencia

Proyecto desarrollado para CLUB NOEL.
