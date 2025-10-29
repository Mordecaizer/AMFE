# Guía de Prueba Rápida - Excel AMFE

## Objetivo
Verificar que la exportación a Excel funciona correctamente con la nueva estructura.

---

## Pasos de Prueba

### 1. Acceder a la Aplicación
1. Abrir navegador en: http://localhost:3000
2. Iniciar sesión:
   - Usuario: `admin`
   - Contraseña: `admin123`

### 2. Crear una Nueva Matriz de Prueba

1. Click en **"Nueva Matriz AMFE"**
2. Llenar el formulario del header:

```
Fundación: Fundación Clínica Infantil Club Noel
Servicio: Unidad de Cuidados Intensivos
Área: UCI Pediátrica
UCI: Sí
Elaborado por: Dr. Juan Pérez
Equipo Biomédico: Monitor de Signos Vitales
Código: AMFE-TEST-001
Versión: 1
Página: 1
Fecha Emisión: 2024-10-28
Mes: 10
Año: 2024
```

3. Hacer click en **"Continuar a la Tabla"**

### 3. Agregar Datos de Prueba

Agregar las siguientes filas en la tabla Handsontable:

**Fila 1:**
- Proceso: `Mantenimiento Preventivo`
- Subproceso: `Calibración de sensores`
- Falla Potencial: `Descalibración del sensor de temperatura`
- Efecto Potencial: `Lectura incorrecta de temperatura del paciente`
- Severidad: `9` (alta)
- Causa Potencial: `Desgaste del sensor por uso continuo`
- Ocurrencia: `5` (media)
- Barrera Existente: `Calibración mensual programada`
- Detectabilidad: `3` (baja)
- RPN: `135` (se calcula automáticamente: 9 × 5 × 3)
- Tipo de Riesgo: `Crítico` (automático por RPN ≥ 100)
- Acciones Recomendadas: `Reemplazar sensor cada 6 meses`

**Fila 2:**
- Proceso: `Mantenimiento Preventivo`
- Subproceso: `Limpieza externa`
- Falla Potencial: `Acumulación de polvo en ventilación`
- Efecto Potencial: `Sobrecalentamiento del equipo`
- Severidad: `6`
- Causa Potencial: `Falta de limpieza regular`
- Ocurrencia: `4`
- Barrera Existente: `Limpieza semanal programada`
- Detectabilidad: `2`
- RPN: `48` (6 × 4 × 2)
- Tipo de Riesgo: `Medio` (automático por RPN 20-49)
- Acciones Recomendadas: `Aumentar frecuencia de limpieza a 2 veces por semana`

**Fila 3:**
- Proceso: `Operación Normal`
- Subproceso: `Monitoreo continuo`
- Falla Potencial: `Batería de respaldo descargada`
- Efecto Potencial: `Pérdida de monitoreo durante corte de energía`
- Severidad: `8`
- Causa Potencial: `Batería al final de su vida útil`
- Ocurrencia: `3`
- Barrera Existente: `Alarma de batería baja`
- Detectabilidad: `2`
- RPN: `48` (8 × 3 × 2)
- Tipo de Riesgo: `Medio`
- Acciones Recomendadas: `Reemplazar batería cada 2 años`

### 4. Guardar la Matriz

1. Click en el botón **"Guardar Matriz"** (abajo a la derecha)
2. Verificar mensaje de éxito: "Matriz guardada exitosamente"
3. La aplicación regresará a la lista de matrices

### 5. Descargar el Excel

1. En la lista de matrices, localizar la matriz recién creada
2. Click en el botón **"📥 Descargar Excel"** 
3. El archivo se descargará automáticamente como: `AMFE_Nueva_Matriz.xlsx`

### 6. Verificar el Excel Generado

Abrir el archivo descargado en Excel/Google Sheets/LibreOffice y verificar:

#### ✅ Fila 1 - Header Principal
- [ ] Muestra "Fundación Clínica Infantil Club Noel"
- [ ] Está centrado y en bold
- [ ] Ocupa todas las columnas (A-R merged)

#### ✅ Fila 2 - Título y Metadata
- [ ] Título: "Análisis de Modo de Fallos y Efectos (AMFE) de Equipos Biomédicos" (A-J)
- [ ] Muestra "CÓDIGO:" (K-L) y valor "AMFE-TEST-001" (M-N)
- [ ] Muestra "PAGINA" (O) y valor "1" (P)
- [ ] Muestra "DE" (Q) y año "2024" (R)

#### ✅ Fila 3 - Información de Servicio
- [ ] Muestra "SERVICIO" con fondo gris (A)
- [ ] Valor "Unidad de Cuidados Intensivos" (B-C)
- [ ] Muestra "ÁREA" con fondo gris (D)
- [ ] Valor "UCI Pediátrica" (E)
- [ ] Muestra "UCI" con fondo gris (F)
- [ ] Valor "Sí" (G)
- [ ] Muestra "ELABORADO POR" con fondo gris (H)
- [ ] Valor "Dr. Juan Pérez" (I-J)
- [ ] Muestra "VERSIÓN:" (K-L) y valor "1" (M-N)
- [ ] Muestra "DIA" (O), "MES" (P), "AÑO" (Q-R)

#### ✅ Fila 4 - Proceso y Equipo
- [ ] Muestra "PROCESO" con fondo gris (A)
- [ ] Campo vacío (B-J)
- [ ] Muestra "EQUIPO BIOMÉDICO" (K-L)
- [ ] Valor "Monitor de Signos Vitales" (M-N)
- [ ] Muestra día "28" (O)
- [ ] Muestra mes "10" (P)
- [ ] Muestra año "2024" (Q-R)

#### ✅ Filas 5-6 - Headers de Tabla
- [ ] Fila 5 tiene headers principales con fondo gris
- [ ] Headers verticalmente merged: PROCESO, SUBPROCESO, FALLA POTENCIAL, etc.
- [ ] Header "RPN" ocupa J5:K5
- [ ] Fila 6 tiene subheaders: "TIPO DE RIESGO" (J6) y "RPN" (K6)
- [ ] Altura de fila 5: ~30 puntos
- [ ] Altura de fila 6: ~20 puntos

#### ✅ Fila 7 - Primera Fila de Datos (RPN Crítico)
- [ ] Columna A: "Mantenimiento Preventivo" con **fondo verde** (#C6E0B4)
- [ ] Columna B: "Calibración de sensores"
- [ ] Columna C: "Descalibración del sensor de temperatura"
- [ ] Columna D: "Lectura incorrecta de temperatura del paciente"
- [ ] Columna E: "Desgaste del sensor por uso continuo"
- [ ] Columna F: "Calibración mensual programada"
- [ ] Columna G: "9" (centrado)
- [ ] Columna H: "3" (centrado)
- [ ] Columna I: "5" (centrado)
- [ ] Columna J: "Crítico" con **fondo rojo claro** (#f8d7da) y texto rojo oscuro
- [ ] Columna K: "135" con **fondo rojo** (#dc3545) y texto blanco bold
- [ ] Columna L: "Reemplazar sensor cada 6 meses"
- [ ] Columnas M y N: Vacías

#### ✅ Fila 8 - Segunda Fila de Datos (RPN Medio)
- [ ] Columna A: "Mantenimiento Preventivo" con **fondo verde** (#C6E0B4)
- [ ] Columna J: "Medio" con **fondo azul claro** (#d1ecf1)
- [ ] Columna K: "48" con **fondo amarillo** (#ffc107) y texto negro bold

#### ✅ Fila 9 - Tercera Fila de Datos (RPN Medio)
- [ ] Columna A: "Operación Normal" con **fondo verde** (#C6E0B4)
- [ ] Columna J: "Medio" con **fondo azul claro** (#d1ecf1)
- [ ] Columna K: "48" con **fondo amarillo** (#ffc107) y texto negro bold

#### ✅ Formato General
- [ ] Todas las celdas tienen bordes (thin)
- [ ] Fuente Arial en todo el documento
- [ ] Texto descriptivo con wrap_text habilitado
- [ ] Números centrados
- [ ] Headers centrados y en bold
- [ ] Anchos de columna apropiados:
  - Columnas A, B: 15
  - Columnas C, D, E, F: 25
  - Columnas G, I: 10
  - Columna H: 12
  - Columna J: 15
  - Columna K: 8
  - Columna L: 30
  - Columnas M, N: 30, 20
  - Columnas O, P, Q, R: 8

---

## Resultados Esperados

### Colores de Tipo de Riesgo Observados
| Tipo | Fondo | Texto |
|------|-------|-------|
| Crítico (fila 7) | #f8d7da (rojo claro) | #721c24 (rojo oscuro) |
| Medio (filas 8-9) | #d1ecf1 (azul claro) | #0c5460 (azul oscuro) |

### Colores de RPN Observados
| Valor | Fondo | Texto |
|-------|-------|-------|
| 135 (fila 7) | #dc3545 (rojo) | Blanco |
| 48 (filas 8-9) | #ffc107 (amarillo) | Negro |

---

## Prueba de Diferentes Valores de RPN

Para validar todos los rangos de color RPN, crear filas adicionales con:

| Severidad | Ocurrencia | Detectabilidad | RPN | Color Esperado |
|-----------|------------|----------------|-----|----------------|
| 2 | 2 | 2 | 8 | Verde (#28a745) |
| 5 | 5 | 1 | 25 | Amarillo (#ffc107) |
| 7 | 7 | 1 | 49 | Amarillo (#ffc107) |
| 8 | 8 | 1 | 64 | Naranja (#fd7e14) |
| 10 | 10 | 1 | 100 | Rojo (#dc3545) |

---

## Solución de Problemas

### Problema 1: Excel no descarga
**Síntomas**: Click en "Descargar Excel" no hace nada

**Solución**:
1. Verificar consola del navegador (F12)
2. Revisar logs del backend: `docker logs amfe-matrix-fastapi-backend-1`
3. Verificar que backend esté corriendo: `docker-compose ps`

### Problema 2: Headers no se ven correctamente
**Síntomas**: Metadata no aparece en las primeras 4 filas

**Solución**:
1. Verificar que el header esté completo al guardar la matriz
2. Revisar estructura de datos en base de datos
3. Reiniciar backend: `docker-compose restart backend`

### Problema 3: Colores no aparecen
**Síntomas**: Celdas no tienen colores de fondo

**Solución**:
1. Verificar que openpyxl esté instalado: `docker-compose exec backend pip list | grep openpyxl`
2. Abrir Excel en aplicación desktop (no en navegador)
3. Verificar que el archivo no esté en "Modo de compatibilidad"

### Problema 4: RPN no se calcula
**Síntomas**: Columna RPN está vacía

**Solución**:
1. Verificar que Severidad, Ocurrencia y Detectabilidad tengan valores numéricos
2. Editar cualquier celda y presionar Enter para forzar recálculo
3. Revisar consola de Handsontable en frontend

---

## Comandos Útiles

### Reiniciar Backend
```bash
cd c:\Users\oscar\Desktop\amfe-matrix-app\amfe-matrix-fastapi
docker-compose restart backend
```

### Ver logs del Backend
```bash
docker logs -f amfe-matrix-fastapi-backend-1
```

### Ver logs del Frontend
```bash
docker logs -f amfe-matrix-fastapi-frontend-1
```

### Reiniciar todos los contenedores
```bash
docker-compose restart
```

---

## Checklist Final

- [ ] Aplicación accesible en http://localhost:3000
- [ ] Login exitoso con admin/admin123
- [ ] Nueva matriz creada con datos de prueba
- [ ] Matriz guardada correctamente
- [ ] Excel descargado
- [ ] Estructura del Excel verificada (filas 1-6)
- [ ] Datos verificados (filas 7+)
- [ ] Colores de RPN correctos
- [ ] Colores de Tipo de Riesgo correctos
- [ ] Fondo verde en columna PROCESO
- [ ] Bordes en todas las celdas
- [ ] Anchos de columna apropiados
- [ ] Fuente Arial en todo el documento

---

## Próximos Pasos

Una vez completada la prueba exitosamente:

1. ✅ Funcionalidad de exportación Excel validada
2. 📝 Documentar cualquier ajuste necesario
3. 🎨 (Opcional) Personalizar colores según preferencias
4. 📊 Crear matrices AMFE reales para el hospital
5. 🔒 Configurar respaldos de base de datos
6. 👥 Crear usuarios adicionales si es necesario

---

**¡Buena suerte con las pruebas!** 🚀

Si encuentras algún problema, revisa:
- `EXCEL_FORMAT_DOCUMENTATION.md` para detalles técnicos
- `RESUMEN_CAMBIOS_EXCEL.md` para cambios implementados
- `HANDSONTABLE_IMPLEMENTATION.md` para uso de Handsontable
