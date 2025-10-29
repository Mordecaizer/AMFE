# Documentación del Formato Excel - AMFE

## Estructura del Excel Exportado

La función `export_matrix_to_excel()` genera un archivo Excel profesional que cumple con los estándares de la **Fundación Clínica Infantil Club Noel**.

### Secciones del Documento

#### 1. FILA 1: Encabezado Principal
- **Celdas**: A1:R1 (merged)
- **Contenido**: "Fundación Clínica Infantil Club Noel"
- **Estilo**: Bold, centrado, borde fino

#### 2. FILA 2: Título del Documento y Metadatos
- **A2:J2** (merged): "Análisis de Modo de Fallos y Efectos (AMFE) de Equipos Biomédicos"
- **K2:L2** (merged): "CÓDIGO:"
- **M2:N2** (merged): Valor del código
- **O2**: "PAGINA"
- **P2**: Número de página
- **Q2**: "DE"
- **R2**: Año

#### 3. FILA 3: Información de Servicio y Versión
- **A3**: "SERVICIO" (header con fondo gris)
- **B3:C3** (merged): Valor del servicio
- **D3**: "ÁREA" (header)
- **E3**: Valor del área
- **F3**: "UCI" (header)
- **G3**: Valor UCI
- **H3**: "ELABORADO POR" (header)
- **I3:J3** (merged): Nombre del elaborador
- **K3:L3** (merged): "VERSIÓN:"
- **M3:N3** (merged): Número de versión
- **O3**: "DIA"
- **P3**: "MES"
- **Q3:R3** (merged): "AÑO"

#### 4. FILA 4: Proceso y Equipo Biomédico
- **A4**: "PROCESO" (header)
- **B4:J4** (merged): Campo vacío para proceso
- **K4:L4** (merged): "EQUIPO BIOMÉDICO"
- **M4:N4** (merged): Nombre del equipo
- **O4**: Día (extraído de fechaEmision)
- **P4**: Mes (extraído de fechaEmision)
- **Q4:R4** (merged): Año (extraído de fechaEmision)

#### 5. FILAS 5-6: Encabezados de Tabla (Doble fila)

**Fila 5** (headers principales con merge):
- **A5:A6**: "PROCESO"
- **B5:B6**: "SUBPROCESO"
- **C5:C6**: "FALLA POTENCIAL DEL SUBPROCESO"
- **D5:D6**: "EFECTO POTENCIAL DE LA FALLA"
- **E5:E6**: "CAUSAS POTENCIALES"
- **F5:F6**: "BARRERAS EXISTENTES"
- **G5:G6**: "Severidad"
- **H5:H6**: "Detectabilidad"
- **I5:I6**: "Ocurrencia"
- **J5:K5**: "RPN" (merged horizontalmente)
- **L5:L6**: "ACCIONES RECOMENDADAS"
- **M5:M6**: "ACCIONES TOMADAS"
- **N5:N6**: "RESPONSABLE"

**Fila 6** (subheaders de RPN):
- **J6**: "TIPO DE RIESGO"
- **K6**: "RPN"

#### 6. FILAS 7+: Datos de la Matriz

Cada fila de datos contiene:
- **A**: Proceso (fondo verde #C6E0B4 si tiene valor)
- **B**: Subproceso
- **C**: Falla Potencial
- **D**: Efecto Potencial
- **E**: Causas Potenciales
- **F**: Barreras Existentes
- **G**: Severidad (1-10, centrado)
- **H**: Detectabilidad (1-10, centrado)
- **I**: Ocurrencia (1-10, centrado)
- **J**: Tipo de Riesgo (con color según tipo)
- **K**: RPN (con color según valor)
- **L**: Acciones Recomendadas
- **M**: Acciones Tomadas (vacío)
- **N**: Responsable (vacío)

### Mapeo de Datos desde Handsontable

La estructura de datos en Handsontable (12 columnas) se mapea al Excel (14 columnas) de la siguiente manera:

| Handsontable Index | Columna | Descripción | Excel Columna |
|-------------------|---------|-------------|---------------|
| 0 | Proceso | Proceso | A |
| 1 | Subproceso | Subproceso | B |
| 2 | Falla Potencial | Falla Potencial del Subproceso | C |
| 3 | Efecto Potencial | Efecto Potencial de la Falla | D |
| 4 | Severidad | Severidad (1-10) | G |
| 5 | Causa Potencial | Causas Potenciales | E |
| 6 | Ocurrencia | Ocurrencia (1-10) | I |
| 7 | Barrera Existente | Barreras Existentes | F |
| 8 | Detectabilidad | Detectabilidad (1-10) | H |
| 9 | RPN | RPN (calculado) | K |
| 10 | Tipo de Riesgo | Tipo de Riesgo | J |
| 11 | Acciones Recomendadas | Acciones Recomendadas | L |

### Colores y Estilos

#### Tipo de Riesgo (Columna J)
- **Crítico**: Fondo #f8d7da (rojo claro), texto #721c24 (rojo oscuro), bold
- **Alto**: Fondo #fff3cd (amarillo claro), texto #856404 (amarillo oscuro), bold
- **Medio**: Fondo #d1ecf1 (azul claro), texto #0c5460 (azul oscuro), bold
- **Bajo**: Fondo #d4edda (verde claro), texto #155724 (verde oscuro), bold

#### RPN (Columna K)
- **≥100**: Fondo #dc3545 (rojo), texto blanco, bold
- **50-99**: Fondo #fd7e14 (naranja), texto blanco, bold
- **20-49**: Fondo #ffc107 (amarillo), texto negro, bold
- **<20**: Fondo #28a745 (verde), texto blanco, bold

#### Proceso (Columna A)
- Fondo verde #C6E0B4 cuando tiene valor

#### Headers
- Fondo gris #CCCCCC
- Texto Arial 9pt bold, centrado

### Anchos de Columnas

```python
{
    'A': 15,  # Proceso
    'B': 15,  # Subproceso
    'C': 25,  # Falla Potencial
    'D': 25,  # Efecto Potencial
    'E': 25,  # Causas
    'F': 25,  # Barreras
    'G': 10,  # Severidad
    'H': 12,  # Detectabilidad
    'I': 10,  # Ocurrencia
    'J': 15,  # Tipo de Riesgo
    'K': 8,   # RPN
    'L': 30,  # Acciones Recomendadas
    'M': 30,  # Acciones Tomadas
    'N': 20,  # Responsable
    'O': 8,   # DIA
    'P': 8,   # MES
    'Q': 8,   # AÑO
    'R': 8    # AÑO
}
```

### Alturas de Filas

- **Fila 5** (primera fila de headers): 30 puntos
- **Fila 6** (segunda fila de headers): 20 puntos

### Parseo de Fecha

Si existe `header.fechaEmision` en formato `YYYY-MM-DD`:
- Se extrae el día → Columna O (fila 4)
- Se extrae el mes → Columna P (fila 4)
- Se extrae el año → Columnas Q:R (fila 4)

Si no existe, se usan los valores individuales:
- `header.mes` → Columna P
- `header.año` → Columnas Q:R

### Ejemplo de Uso

```python
# En el endpoint
from app.services.matrix_service import export_matrix_to_excel

@router.get("/matrices/{matrix_id}/export")
async def export_matrix(matrix_id: int, db: Session = Depends(get_db)):
    matrix = get_matrix(db, matrix_id)
    if not matrix:
        raise HTTPException(status_code=404, detail="Matrix not found")
    
    excel_file = export_matrix_to_excel(matrix)
    
    return StreamingResponse(
        excel_file,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f"attachment; filename=AMFE_{matrix.name}.xlsx"
        }
    )
```

### Frontend - Descarga

```javascript
// En MatrixList.js
import { downloadMatrixExcel } from '../../services/api';

const handleDownloadExcel = async (matrixId, matrixName) => {
  try {
    await downloadMatrixExcel(matrixId, matrixName);
    // Archivo descargado automáticamente
  } catch (error) {
    console.error('Error descargando Excel:', error);
  }
};
```

### Notas Importantes

1. **Celdas Merged**: Las celdas combinadas requieren que solo se escriba en la celda superior izquierda
2. **Bordes**: Todos los bordes son de estilo 'thin' en todos los lados
3. **Wrap Text**: Está habilitado en celdas de texto para permitir múltiples líneas
4. **Fuente**: Arial es la fuente estándar en todos los estilos
5. **Alineación**: Centrada para headers y números, izquierda para texto descriptivo

### Diferencias con la Versión Anterior

La nueva versión:
- ✅ Usa la estructura exacta de la imagen proporcionada por el usuario
- ✅ Incluye 4 filas de metadata antes de los headers de la tabla
- ✅ Headers de tabla en doble fila (filas 5-6)
- ✅ RPN dividido en dos columnas (Tipo de Riesgo y RPN)
- ✅ Columnas adicionales para Acciones Tomadas y Responsable
- ✅ Parseo automático de fechas
- ✅ Color verde en celdas de PROCESO
- ✅ Estructura de 18 columnas (A-R)

### Mantenimiento

Para modificar el formato:
1. Editar `backend/app/services/matrix_service.py`
2. Modificar la función `export_matrix_to_excel()`
3. Reiniciar el contenedor backend: `docker-compose restart backend`
4. Probar la descarga desde el frontend
