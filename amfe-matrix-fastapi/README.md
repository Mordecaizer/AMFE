# 🏥 Fundación Clínica Infantil Club Noel - Sistema AMFE

Sistema profesional de gestión de matrices AMFE (Análisis de Modo y Efecto de Fallas) para equipos biomédicos, desarrollado con FastAPI, React, Handsontable y PostgreSQL.

## 🌟 Características Principales

- ✅ **Matrices AMFE Avanzadas** con Handsontable (interfaz tipo Excel)
- ✅ **Exportación a Excel** con formato profesional y estructura hospitalaria
- ✅ **Cálculo automático de RPN** (Severidad × Ocurrencia × Detectabilidad)
- ✅ **Clasificación de riesgos** con código de colores (Crítico/Alto/Medio/Bajo)
- ✅ **Persistencia en base de datos** PostgreSQL con CRUD completo
- ✅ **Autenticación JWT** con control de roles
- ✅ **Copiar/Pegar desde Excel** con validación de datos
- ✅ **Navegación por teclado** (Tab, Enter, flechas)
- ✅ **Menú contextual** (click derecho)

## 🏗️ Estructura del Proyecto

```
amfe-matrix-fastapi/
├── backend/                         # 🖥️ API FastAPI
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py           # Endpoints de API
│   │   ├── services/
│   │   │   ├── auth_service.py     # Autenticación JWT
│   │   │   └── matrix_service.py   # Lógica AMFE + Excel export
│   │   ├── models.py               # Modelos SQLAlchemy
│   │   ├── schemas.py              # Esquemas Pydantic
│   │   ├── database.py             # Conexión PostgreSQL
│   │   └── main.py                 # App principal
│   ├── alembic/                    # Migraciones de DB
│   ├── Dockerfile
│   ├── requirements.txt            # openpyxl, fastapi, etc.
│   ├── create_admin_user.py
│   └── verify_system.py
├── frontend/                        # 🌐 App React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   │   └── AdminPanel.js
│   │   │   ├── Auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Register.js
│   │   │   ├── Matrices/
│   │   │   │   ├── MatrixFormAdvancedHOT.js  # ⭐ Handsontable
│   │   │   │   ├── MatrixList.js
│   │   │   │   └── MatrixDetail.js
│   │   │   ├── Header.js
│   │   │   └── RoleBasedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   ├── api.js              # Axios + Excel download
│   │   │   └── auth.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   ├── package.json                # handsontable v16.1.1
│   └── Dockerfile
├── docker-compose.yml              # ⚙️ 3 servicios (frontend, backend, db)
├── start_system.ps1                # 🚀 Script de inicio
├── EXCEL_FORMAT_DOCUMENTATION.md   # 📄 Estructura del Excel
├── RESUMEN_CAMBIOS_EXCEL.md        # 📝 Changelog Excel
├── GUIA_PRUEBA_EXCEL.md            # 🧪 Guía de testing
├── HANDSONTABLE_IMPLEMENTATION.md  # 📖 Documentación Handsontable
└── README.md                       # 📖 Este archivo
```

## 🚀 Inicio Rápido

### **Opción 1: Script Automatizado (Windows)**

```powershell
# Iniciar todo el sistema
.\start_system.ps1
```

### **Opción 2: Comandos Manuales**

```bash
# 1. Iniciar contenedores
docker-compose up --build -d

# 2. Crear usuario administrador
docker-compose exec backend python create_admin_user.py

# 3. Verificar que todo esté corriendo
docker-compose ps
```

### **URLs del Sistema**
- 🌐 **Frontend**: http://localhost:3000
- ⚡ **Backend**: http://localhost:5000
- 📚 **API Docs (Swagger)**: http://localhost:5000/docs
- 🗄️ **Base de Datos**: localhost:5432

## 🔐 Credenciales por Defecto

```
Usuario: admin
Contraseña: admin123
```

## 🛠️ Stack Tecnológico

### Backend
- **FastAPI** 0.104.1 - Framework web moderno
- **PostgreSQL** - Base de datos relacional
- **SQLAlchemy** - ORM
- **Alembic** - Migraciones
- **JWT** - Autenticación
- **bcrypt** - Hashing de contraseñas
- **openpyxl** 3.1.5 - Generación de archivos Excel
- **Python** 3.9

### Frontend
- **React** 18 - UI framework
- **Handsontable** 16.1.1 - Tabla tipo Excel
- **@handsontable/react** 16.1.1 - Wrapper React
- **React Router** 6 - Navegación
- **Axios** - Cliente HTTP
- **Node.js** 18

### Infraestructura
- **Docker** + **Docker Compose** - Containerización
- **CORS** habilitado para desarrollo

## 📋 Funcionalidades Detalladas

### 🔐 Autenticación y Usuarios
- ✅ Sistema de login/logout con JWT tokens
- ✅ Roles: Admin y User
- ✅ Rutas protegidas por rol
- ✅ Panel de administración para gestión de usuarios (solo Admin)
- ✅ Registro de nuevos usuarios (solo Admin)

### 📊 Matrices AMFE Avanzadas
- ✅ **Interfaz Handsontable**: Edición tipo Excel con 1000+ filas sin lag
- ✅ **12 Columnas**: Proceso, Subproceso, Falla Potencial, Efecto Potencial, Severidad, Causa Potencial, Ocurrencia, Barrera Existente, Detectabilidad, RPN, Tipo de Riesgo, Acciones Recomendadas
- ✅ **Cálculo automático RPN**: RPN = Severidad × Ocurrencia × Detectabilidad
- ✅ **Validación de datos**: 1-10 para Severidad/Ocurrencia/Detectabilidad
- ✅ **Clasificación automática**:
  - Crítico: RPN ≥ 100 (rojo)
  - Alto: RPN 50-99 (naranja)
  - Medio: RPN 20-49 (amarillo)
  - Bajo: RPN < 20 (verde)
- ✅ **Navegación por teclado**:
  - `Tab`: Siguiente celda
  - `Shift+Tab`: Celda anterior
  - `Enter`: Siguiente fila
  - `Flechas`: Navegar en cualquier dirección
- ✅ **Copy/Paste**: Compatible con Excel (Ctrl+C / Ctrl+V)
- ✅ **Menú contextual**: Click derecho → Insertar/Eliminar filas
- ✅ **Agregar/Eliminar filas**: Botones dedicados
- ✅ **Guardar/Editar/Eliminar**: CRUD completo

### 📥 Exportación a Excel Profesional

Genera archivos `.xlsx` con estructura completa:

**Estructura del Excel:**
- **Fila 1**: Fundación Clínica Infantil Club Noel (header principal)
- **Fila 2**: Título del AMFE + Código, Página, DE
- **Fila 3**: Servicio, Área, UCI, Elaborado Por, Versión, Día, Mes, Año
- **Fila 4**: Proceso, Equipo Biomédico, Fecha parseada
- **Filas 5-6**: Headers de tabla (doble fila con merged cells)
  - RPN dividido en: "TIPO DE RIESGO" y "RPN"
- **Fila 7+**: Datos de la matriz con:
  - Proceso con fondo verde (#C6E0B4)
  - Tipo de Riesgo coloreado (Crítico/Alto/Medio/Bajo)
  - RPN coloreado según valor (rojo/naranja/amarillo/verde)
  - Bordes en todas las celdas
  - Fuente Arial, tamaños apropiados

**Características:**
- ✅ 18 columnas (A-R)
- ✅ Celdas merged estratégicamente
- ✅ Parseo automático de fechas (YYYY-MM-DD → día/mes/año)
- ✅ Código de colores Bootstrap
- ✅ Anchos de columna optimizados
- ✅ Wrap text habilitado
- ✅ Compatible con Excel 2013+, Google Sheets, LibreOffice

### 📝 Formularios de Header

Campos completos:
- Fundación
- Servicio
- Área
- UCI
- Elaborado por
- Equipo Biomédico
- Código
- Versión
- Página
- Fecha de Emisión
- Mes
- Año

## 📦 Comandos Útiles

### Docker

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f backend
docker-compose logs -f frontend

# Reiniciar un servicio
docker-compose restart backend
docker-compose restart frontend

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (⚠️ Borra la base de datos)
docker-compose down -v

# Reconstruir imágenes
docker-compose up --build -d
```

### Backend

```bash
# Entrar al contenedor backend
docker-compose exec backend bash

# Crear migraciones
docker-compose exec backend alembic revision --autogenerate -m "descripcion"

# Aplicar migraciones
docker-compose exec backend alembic upgrade head

# Verificar sistema
docker-compose exec backend python verify_system.py

# Instalar nueva dependencia
docker-compose exec backend pip install nueva-dependencia
# Luego agregarla a requirements.txt
```

### Frontend

```bash
# Entrar al contenedor frontend
docker-compose exec frontend sh

# Instalar nueva dependencia
docker-compose exec frontend npm install nueva-libreria --legacy-peer-deps

# Ver dependencias instaladas
docker-compose exec frontend npm list --depth=0
```

## 📚 Documentación Adicional

Toda la documentación técnica se encuentra en la carpeta **[`docs/`](./docs/)**:

- **[Excel - Formato](./docs/EXCEL_FORMAT_DOCUMENTATION.md)**: Especificación completa del formato Excel exportado
- **[Excel - Changelog](./docs/RESUMEN_CAMBIOS_EXCEL.md)**: Cambios implementados en la exportación Excel
- **[Excel - Guía de Pruebas](./docs/GUIA_PRUEBA_EXCEL.md)**: Testing paso a paso de la exportación
- **[Handsontable - Guía](./docs/HANDSONTABLE_IMPLEMENTATION.md)**: Shortcuts, features y troubleshooting
- **[Changelog General](./docs/CHANGELOG_MATRICES_AVANZADAS.md)**: Historial de cambios del proyecto

## 🧪 Testing

Ver **[Guía de Pruebas Excel](./docs/GUIA_PRUEBA_EXCEL.md)** para una guía completa de testing.

**Checklist Rápido:**
1. ✅ Login con admin/admin123
2. ✅ Crear nueva matriz AMFE
3. ✅ Llenar header con datos de prueba
4. ✅ Agregar 3+ filas con diferentes valores de RPN
5. ✅ Guardar matriz
6. ✅ Descargar Excel
7. ✅ Verificar estructura en Excel:
   - Metadata (filas 1-4)
   - Headers (filas 5-6)
   - Datos con colores correctos

## 🎨 Colores y Estilos

### Tipo de Riesgo

| Tipo | Fondo | Texto | Condición |
|------|-------|-------|-----------|
| Crítico | #f8d7da | #721c24 | RPN ≥ 100 |
| Alto | #fff3cd | #856404 | RPN 50-99 |
| Medio | #d1ecf1 | #0c5460 | RPN 20-49 |
| Bajo | #d4edda | #155724 | RPN < 20 |

### RPN en Excel

| Rango | Fondo | Texto |
|-------|-------|-------|
| ≥100 | #dc3545 (rojo) | Blanco |
| 50-99 | #fd7e14 (naranja) | Blanco |
| 20-49 | #ffc107 (amarillo) | Negro |
| <20 | #28a745 (verde) | Blanco |

## 🔧 Solución de Problemas

### Backend no inicia

```bash
# Ver logs
docker-compose logs backend

# Reconstruir imagen
docker-compose up --build backend
```

### Frontend no carga

```bash
# Verificar que Node.js esté instalado
docker-compose exec frontend node --version

# Reinstalar dependencias
docker-compose exec frontend npm install --legacy-peer-deps

# Reconstruir
docker-compose up --build frontend
```

### Excel no descarga

1. Verificar que backend esté corriendo: `docker-compose ps`
2. Ver logs del backend: `docker-compose logs backend`
3. Verificar endpoint en Swagger: http://localhost:5000/docs
4. Reiniciar backend: `docker-compose restart backend`

### Handsontable: página lenta

- ✅ Ya optimizado con virtualización
- ✅ Maneja 1000+ filas sin lag
- Si persiste: Verificar que `licenseKey: 'non-commercial-and-evaluation'` esté presente

## 📊 Base de Datos

**PostgreSQL 15** con las siguientes tablas:

### Tabla: `users`
- id (PK)
- username (unique)
- hashed_password
- is_admin (boolean)

### Tabla: `amfe_matrices`
- id (PK)
- name
- description
- data (JSON) ← Almacena header + tableData
- created_by (FK → users.id)
- created_at
- updated_at

**Esquema JSON de `data`:**
```json
{
  "header": {
    "fundacion": "string",
    "servicio": "string",
    "area": "string",
    "uci": "string",
    "elaboradoPor": "string",
    "equipoBiomedico": "string",
    "codigo": "string",
    "version": "string",
    "pagina": "string",
    "fechaEmision": "YYYY-MM-DD",
    "mes": "string",
    "año": "string"
  },
  "tableData": [
    ["proceso", "subproceso", "falla", "efecto", sev, "causa", ocu, "barrera", det, rpn, "tipo", "acciones"],
    ...
  ]
}
```

## 🚀 Despliegue en Producción

### Cambios Necesarios

1. **Variables de entorno** en `.env`:
```env
POSTGRES_USER=admin_user
POSTGRES_PASSWORD=strong_password_here
POSTGRES_DB=amfe_production
SECRET_KEY=your-super-secret-key-here
```

2. **docker-compose.yml**:
   - Cambiar puertos si es necesario
   - Habilitar restart: always
   - Configurar volúmenes persistentes

3. **Backend**:
   - Actualizar CORS origins a dominio real
   - Configurar HTTPS/SSL
   - Habilitar rate limiting

4. **Frontend**:
   - Actualizar `REACT_APP_API_URL` al dominio real
   - Build de producción: `npm run build`
   - Servir con Nginx o similar

## 👥 Roles y Permisos

| Funcionalidad | Admin | User |
|--------------|-------|------|
| Login | ✅ | ✅ |
| Ver matrices | ✅ | ✅ |
| Crear matrices | ✅ | ✅ |
| Editar matrices | ✅ | ✅ |
| Eliminar matrices | ✅ | ✅ |
| Descargar Excel | ✅ | ✅ |
| Ver usuarios | ✅ | ❌ |
| Crear usuarios | ✅ | ❌ |
| Eliminar usuarios | ✅ | ❌ |

## 📄 Licencia

Proyecto desarrollado para **Fundación Clínica Infantil Club Noel**.

**Handsontable**: Licencia no comercial y evaluación (`non-commercial-and-evaluation`). Para uso comercial, adquirir licencia en https://handsontable.com/pricing

---

## 🙏 Créditos

Desarrollado con ❤️ para la Fundación Clínica Infantil Club Noel

**Tecnologías principales:**
- FastAPI
- React
- Handsontable
- PostgreSQL
- Docker

---

**Última actualización**: 28 de octubre de 2024
**Versión**: 2.0
