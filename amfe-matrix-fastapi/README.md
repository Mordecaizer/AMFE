# 🏥 Fundación Clínica Infantil Club Noel - Sistema AMFE

Sistema profesional de gestión de matrices AMFE (Análisis de Modo y Efecto de Fallas) para equipos biomédicos, desarrollado con FastAPI, React y PostgreSQL.

## 🌟 Características Principales

- ✅ **Matrices AMFE Modulares** con estructura jerárquica completa
- ✅ **Exportación a Excel** con formato institucional y logo Club Noel
- ✅ **Cálculo automático de RPN** (Severidad × Ocurrencia × Detectabilidad) escala 1-5
- ✅ **Clasificación de riesgos** con código de colores (Alto/Medio/Bajo)
- ✅ **Persistencia en base de datos** PostgreSQL con CRUD completo
- ✅ **Autenticación JWT** con control de roles (Admin/User)
- ✅ **Interfaz moderna y responsive** con React 18
- ✅ **Dockerizado** para fácil instalación y despliegue

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
│   └── reset_admin_password.py
├── frontend/                        # 🌐 App React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   │   └── AdminPanel.js
│   │   │   ├── Auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Register.js
│   │   │   ├── Matrices/
│   │   │   │   ├── MatrixFormModular.js  # ⭐ Editor Modular
│   │   │   │   └── MatrixList.js
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
└── README.md                       # 📖 Este archivo
```

## 🚀 Instalación y Despliegue

### **Requisitos Previos**

Antes de comenzar, asegúrate de tener instalado:

1. **Docker Desktop** (Windows/Mac) o **Docker Engine** (Linux)
   - Descargar desde: https://www.docker.com/products/docker-desktop
   - Versión mínima: 20.10+

2. **Docker Compose**
   - Incluido en Docker Desktop
   - Para Linux: https://docs.docker.com/compose/install/

3. **Git** (opcional, para clonar el repositorio)
   - Descargar desde: https://git-scm.com/downloads

### **Paso 1: Obtener el Código**

#### Opción A: Clonar con Git
```bash
git clone https://github.com/Mordecaizer/AMFE.git
cd AMFE/amfe-matrix-fastapi
```

#### Opción B: Descargar ZIP
1. Ve a https://github.com/Mordecaizer/AMFE
2. Clic en "Code" → "Download ZIP"
3. Extrae el archivo y navega a la carpeta `amfe-matrix-fastapi`

### **Paso 2: Configurar Variables de Entorno**

Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```env
# Base de datos
POSTGRES_USER=amfe_user
POSTGRES_PASSWORD=amfe_password_2024
POSTGRES_DB=amfe_db
DATABASE_URL=postgresql://amfe_user:amfe_password_2024@db:5432/amfe_db

# Seguridad
SECRET_KEY=tu-clave-secreta-super-segura-cambiala
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

⚠️ **IMPORTANTE**: Cambia `SECRET_KEY` por una clave única y segura en producción.

### **Paso 3: Construir e Iniciar los Contenedores**

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
# Construir e iniciar todos los servicios
docker-compose up --build -d
```

Esto creará y arrancará 3 contenedores:
- **backend**: API FastAPI (puerto 5000)
- **frontend**: Aplicación React (puerto 3000)
- **db**: Base de datos PostgreSQL (puerto 5432)

### **Paso 4: Crear Usuario Administrador**

Una vez que los contenedores estén corriendo, crea el usuario admin:

```bash
docker-compose exec backend python create_admin_user.py
```

Credenciales por defecto:
- **Usuario**: `admin`
- **Contraseña**: `admin123`

### **Paso 5: Verificar la Instalación**

1. **Frontend**: Abre http://localhost:3000 en tu navegador
2. **Backend API**: Verifica http://localhost:5000/docs (Swagger UI)
3. **Estado de contenedores**: 
   ```bash
   docker-compose ps
   ```

Deberías ver los 3 contenedores en estado "Up".

### **Paso 6: Iniciar Sesión**

1. Accede a http://localhost:3000
2. Ingresa con las credenciales:
   - Usuario: `admin`
   - Contraseña: `admin123`
3. ¡Listo! Ya puedes crear matrices AMFE

---

## 🛑 Detener y Reiniciar el Sistema

### Detener los contenedores (sin perder datos)
```bash
docker-compose stop
```

### Iniciar los contenedores nuevamente
```bash
docker-compose start
```

### Detener y eliminar contenedores (mantiene volúmenes/datos)
```bash
docker-compose down
```

### Detener y eliminar TODO (⚠️ BORRA LA BASE DE DATOS)
```bash
docker-compose down -v
```

### Reiniciar un servicio específico
```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart db
```

---

## 🔄 Actualizar la Aplicación

Si hay una nueva versión disponible:

```bash
# 1. Detener los contenedores
docker-compose down

# 2. Obtener la última versión
git pull origin main

# 3. Reconstruir con la nueva versión
docker-compose up --build -d
```

---

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
- **FastAPI** - Framework web moderno y rápido
- **PostgreSQL** - Base de datos relacional
- **SQLAlchemy** - ORM para Python
- **Alembic** - Migraciones de base de datos
- **JWT** - Autenticación segura con tokens
- **bcrypt** - Hashing de contraseñas
- **openpyxl** - Generación de archivos Excel
- **Pillow** - Procesamiento de imágenes (logo en Excel)
- **Python** 3.9

### Frontend
- **React** 18 - Librería UI moderna
- **React Router** 6 - Navegación entre páginas
- **Axios** - Cliente HTTP
- **Context API** - Manejo de estado global
- **Node.js** 18

### Infraestructura
- **Docker** - Contenedorización
- **Docker Compose** - Orquestación de contenedores
- **Nginx** - Servidor web (opcional para producción)

## 📋 Funcionalidades Detalladas

### 🔐 Autenticación y Usuarios
- ✅ Sistema de login/logout con JWT tokens
- ✅ Roles: Admin y User
- ✅ Rutas protegidas por rol
- ✅ Panel de administración para gestión de usuarios (solo Admin)
- ✅ Registro de nuevos usuarios (solo Admin)

### 📊 Matrices AMFE Modulares

- ✅ **Estructura jerárquica completa**: Proceso → Subproceso → Falla → Efecto → Causa → Barrera
- ✅ **Formulario modular intuitivo**: Agregar/eliminar elementos con botones "+/-"
- ✅ **Cálculo automático RPN**: RPN = Severidad × Detectabilidad × Ocurrencia
- ✅ **Escala 1-5**: Validación para cada parámetro (Severidad, Detectabilidad, Ocurrencia)
- ✅ **Selectores dropdown**: Previene errores de entrada de datos
- ✅ **Clasificación automática con colores**:
  - 🔴 **Alto**: RPN 33-125 (Rojo)
  - 🟠 **Medio**: RPN 13-32 (Naranja)
  - 🟢 **Bajo**: RPN 1-12 (Verde)
- ✅ **Múltiples elementos por falla**: Varios efectos, causas, barreras y acciones
- ✅ **Campos personalizables**: Acciones recomendadas, tomadas, responsables
- ✅ **Guardar/Editar/Eliminar**: CRUD completo para todas las matrices

### 📥 Exportación a Excel con Formato Institucional

Genera archivos `.xlsx` profesionales con la estructura exacta de Club Noel:

**Características del Excel:**
- 🖼️ **Logo Club Noel** en la celda A1
- 📋 **Fila 1-2**: Título institucional y metadata (código, versión, página)
- 📋 **Fila 3**: Subtítulo del AMFE + Fecha de emisión
- 📋 **Fila 4**: Valores de fecha (Día, Mes, Año)
- 📋 **Fila 5**: Información del servicio (Servicio, Área, Elaborado por, Equipo)
- 📋 **Fila 6**: Headers de la tabla de datos
- 📊 **Fila 7+**: Datos jerárquicos con:
  - Proceso con fondo verde claro (#C6E0B4)
  - Merge automático de celdas para estructura jerárquica
  - **Colores RPN automáticos**:
    - 🔴 Rojo: RPN 33-125 (Alto)
    - 🟠 Naranja: RPN 13-32 (Medio)
    - 🟢 Verde: RPN 1-12 (Bajo)
  - Tipo de Riesgo con fondos de colores claros
  - Bordes en todas las celdas
  - Fuente Arial tamaños profesionales

**Formato técnico:**
- ✅ 14 columnas (A-N)
- ✅ Celdas combinadas estratégicamente
- ✅ Parseo automático de fechas
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

### Tipo de Riesgo (RPN)

| Nivel | Rango RPN | Color | Aplicación |
|-------|-----------|-------|------------|
| 🟢 **Bajo** | 1-12 | Verde (#28a745) | Badge web + Celdas Excel |
| 🟠 **Medio** | 13-32 | Naranja (#fd7e14) | Badge web + Celdas Excel |
| 🔴 **Alto** | 33-125 | Rojo (#dc3545) | Badge web + Celdas Excel |

### Colores en Excel

**Columna J (RPN):**
- Fondo del color correspondiente
- Texto blanco en negrita

**Columna K (Tipo de Riesgo):**
- Bajo: Fondo verde claro (#d4edda) + texto verde oscuro (#155724)
- Medio: Fondo naranja claro (#ffe5d0) + texto marrón (#8b4513)
- Alto: Fondo rojo claro (#f8d7da) + texto rojo oscuro (#721c24)

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

### Logo no aparece en Excel

1. Verificar que Pillow esté instalado:
   ```bash
   docker-compose exec backend pip list | findstr Pillow
   ```
2. Si no está instalado:
   ```bash
   docker-compose exec backend pip install Pillow
   docker-compose restart backend
   ```

### Error "Port already in use"

Si los puertos 3000, 5000 o 5432 están ocupados:

1. Detener otros servicios que usen esos puertos
2. O modificar `docker-compose.yml` para usar otros puertos:
   ```yaml
   ports:
     - "3001:3000"  # Frontend en puerto 3001
     - "5001:8000"  # Backend en puerto 5001
   ```

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

**Esquema JSON de `data` (Matrices Modulares):**
```json
{
  "header": {
    "fundacion": "Fundación Clínica Infantil Club Noel",
    "servicio": "UCI",
    "area": "Cuidados Intensivos",
    "elaboradoPor": "Dr. Juan Pérez",
    "equipo": "Ventilador Mecánico",
    "codigo": "AMFE-001",
    "version": "1.0",
    "pagina": "1/1",
    "fechaEmision": "2025-11-12"
  },
  "procesos": [
    {
      "id": 1234567890,
      "nombre": "VENTILACIÓN",
      "subprocesos": [
        {
          "id": 1234567891,
          "nombre": "Inicio de ventilación",
          "fallasPotenciales": [
            {
              "id": 1234567892,
              "descripcion": "Fallo en tubería de oxígeno",
              "efectosPotenciales": [
                {"id": 1234567893, "descripcion": "Hipoxia del paciente"}
              ],
              "causasPotenciales": [
                {"id": 1234567894, "descripcion": "Desconexión accidental"}
              ],
              "barrerasExistentes": [
                {"id": 1234567895, "descripcion": "Alarma de desconexión"}
              ],
              "evaluacion": {
                "severidad": 5,
                "detectabilidad": 2,
                "ocurrencia": 4,
                "rpn": 40
              },
              "accionesRecomendadas": [
                {"id": 1234567896, "descripcion": "Mejorar sistema de fijación"}
              ],
              "accionesTomadas": [
                {"id": 1234567897, "descripcion": "Instalado clip de seguridad"}
              ],
              "responsable": "Ing. Biomédico"
            }
          ]
        }
      ]
    }
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

---

## 🙏 Créditos

Desarrollado con ❤️ para la Fundación Clínica Infantil Club Noel

**Tecnologías principales:**
- FastAPI
- React 18
- PostgreSQL
- Docker
- openpyxl

---

## 📞 Soporte

Para reportar problemas o solicitar nuevas funcionalidades:
- **GitHub Issues**: https://github.com/Mordecaizer/AMFE/issues
- **Email**: [tu-email@ejemplo.com]

---

**Última actualización**: 11 de noviembre de 2025
**Versión**: 3.0
