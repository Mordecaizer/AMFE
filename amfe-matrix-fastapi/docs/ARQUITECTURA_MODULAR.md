# Arquitectura AMFE Modular

## 🎯 Objetivo
Crear una matriz AMFE que funcione por módulos jerárquicos, permitiendo agregar/eliminar elementos dinámicamente y exportar todo a Excel en el formato del hospital.

## 🏗️ Estructura de Datos

```javascript
{
  "matrixId": 123,
  "matrixName": "AMFE Equipos Biomédicos UCI",
  "header": {
    "fundacion": "Fundación Clínica Infantil Club Noel",
    "codigo": "AMFE-001",
    "version": "1",
    "pagina": "1",
    "mes": "Octubre",
    "año": "2025",
    "servicio": "UNIDAD DE CUIDADOS INTENSIVOS",
    "area": "UCI",
    "elaboradoPor": "Ana María Toro Aguirre",
    "equipo": "BOMBA DE NUTRICIÓN",
    "fechaEmision": "2025-10-28"
  },
  "procesos": [
    {
      "id": "proc-1",
      "nombre": "PLANEACIÓN",
      "color": "#C6E0B4",  // Verde claro como en la imagen
      "subprocesos": [
        {
          "id": "subproc-1",
          "nombre": "Evaluación de la tecnología",
          "fallasPotenciales": [
            {
              "id": "falla-1",
              "descripcion": "Selección de equipo no acorde a necesidades clínicas",
              "efectosPotenciales": [
                {
                  "id": "efecto-1",
                  "descripcion": "Uso limitado e inadecuado del equipo"
                },
                {
                  "id": "efecto-2",
                  "descripcion": "Retraso en la adecuación del equipo"
                },
                {
                  "id": "efecto-3",
                  "descripcion": "Costos adicionales para la institución"
                },
                {
                  "id": "efecto-4",
                  "descripcion": "Retraso en la atención de pacientes"
                }
              ],
              "causasPotenciales": [
                {
                  "id": "causa-1",
                  "descripcion": "No se consulta al personal asistencial"
                },
                {
                  "id": "causa-2",
                  "descripcion": "Análisis incompleto de requerimientos clínicos"
                },
                {
                  "id": "causa-3",
                  "descripcion": "Falta de comunicación con proveedores y normativas"
                }
              ],
              "barrerasExistentes": [
                {
                  "id": "barrera-1",
                  "descripcion": "Selección basada en disponibilidad del proveedor y rapidez en la entrega"
                },
                {
                  "id": "barrera-2",
                  "descripcion": "Evaluación incompleta de los recursos necesarios"
                }
              ],
              "evaluacion": {
                "severidad": 3,
                "detectabilidad": 4,
                "ocurrencia": 5,
                "rpn": 60  // S × D × O (calculado automáticamente)
              },
              "accionesRecomendadas": [
                {
                  "id": "accion-1",
                  "descripcion": "Implementar proceso de consulta con personal clínico"
                }
              ],
              "accionesTomadas": [
                {
                  "id": "accion-tomada-1",
                  "descripcion": "Reunión con jefes de servicio"
                }
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

## 🎨 Interfaz de Usuario (UI)

### Vista de Edición Modular

```
┌─────────────────────────────────────────────────────────────┐
│  MATRIZ AMFE: Equipos Biomédicos UCI                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PROCESO: PLANEACIÓN                        [Editar]  │   │
│  │                                            [Eliminar]│   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  └─ SUBPROCESO: Evaluación de la tecnología         │   │
│  │     [+] Agregar Subproceso  [-]                      │   │
│  │                                                       │   │
│  │     ┌───────────────────────────────────────────┐   │   │
│  │     │ FALLA POTENCIAL:                          │   │   │
│  │     │ Selección de equipo no acorde             │   │   │
│  │     │                                            │   │   │
│  │     │ EFECTOS POTENCIALES:                      │   │   │
│  │     │  • Uso limitado del equipo      [+] [-]   │   │   │
│  │     │  • Retraso en adecuación        [+] [-]   │   │   │
│  │     │                                            │   │   │
│  │     │ CAUSAS POTENCIALES:                       │   │   │
│  │     │  • No se consulta personal      [+] [-]   │   │   │
│  │     │  • Análisis incompleto          [+] [-]   │   │   │
│  │     │  [+ Agregar Causa]                        │   │   │
│  │     │                                            │   │   │
│  │     │ BARRERAS EXISTENTES:                      │   │   │
│  │     │  • Selección por disponibilidad [+] [-]   │   │   │
│  │     │  [+ Agregar Barrera]                      │   │   │
│  │     │                                            │   │   │
│  │     │ EVALUACIÓN:                               │   │   │
│  │     │  Severidad: [3▼]  Detectab: [4▼]         │   │   │
│  │     │  Ocurrencia: [5▼]  RPN: 60 (auto)        │   │   │
│  │     │                                            │   │   │
│  │     │ ACCIONES RECOMENDADAS:                    │   │   │
│  │     │  • Consulta con personal clínico [+] [-]  │   │   │
│  │     │  [+ Agregar Acción]                       │   │   │
│  │     │                                            │   │   │
│  │     │ ACCIONES TOMADAS:                         │   │   │
│  │     │  • Reunión con jefes           [+] [-]    │   │   │
│  │     │  [+ Agregar Acción Tomada]                │   │   │
│  │     └───────────────────────────────────────────┘   │   │
│  │     [+ Agregar Falla Potencial]                     │   │
│  └─────────────────────────────────────────────────────┘   │
│  [+ Agregar Proceso]                                        │
│                                                              │
│  [Guardar]  [Exportar a Excel]  [Cancelar]                 │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Lógica de Expansión de Filas en Excel

Cuando se exporta a Excel:
1. Cada **PROCESO** genera filas con merge en columna A (fondo verde)
2. Cada **SUBPROCESO** genera filas con merge en columna B
3. Cada **FALLA** se expande según sus elementos:
   - Si tiene 4 efectos, la falla ocupa 4 filas
   - Si tiene 5 causas, la falla ocupa 5 filas
   - Se toma el **máximo** de efectos/causas/barreras/acciones
4. Las celdas de evaluación (S, D, O, RPN) se centran verticalmente

### Ejemplo de Expansión:

```
Falla 1:
- 4 Efectos
- 5 Causas
- 2 Barreras
- 3 Acciones Recomendadas

→ Esta falla ocupará 5 filas (el máximo)
→ Efectos: 4 celdas llenas + 1 vacía
→ Causas: 5 celdas llenas
→ Barreras: 2 celdas llenas + 3 vacías
→ S, D, O, RPN: merged verticalmente en las 5 filas
```

## 🎨 Ventajas de Este Enfoque

1. ✅ **Flexibilidad Total**: Agregar/quitar elementos sin límites
2. ✅ **Organización Clara**: Jerarquía visual de proceso → subproceso → fallas
3. ✅ **Excel Profesional**: Formato exacto del hospital con expansión inteligente
4. ✅ **Edición Rápida**: Botones [+] [-] en cada nivel
5. ✅ **Cálculo Automático**: RPN se calcula en tiempo real
6. ✅ **Validación**: Dropdowns para severidad, detectabilidad, ocurrencia
7. ✅ **Responsive**: Cada módulo se colapsa/expande independientemente

## 🚀 Implementación

### Frontend (React)
- `MatrixFormModular.js` - Componente principal con acordeones
- `ProcesoModule.js` - Módulo de proceso (expandible)
- `SubprocesoModule.js` - Módulo de subproceso
- `FallaModule.js` - Módulo de falla con todos sus campos
- Usar **React Hooks** para estado
- **Drag & Drop** opcional para reordenar

### Backend (FastAPI)
- Nuevo endpoint: `POST /matrices/modular`
- Nueva función: `export_modular_matrix_to_excel()`
- Lógica de expansión de filas
- Merge inteligente de celdas

## 📊 Comparación

| Característica | Handsontable Actual | Sistema Modular |
|----------------|---------------------|-----------------|
| Agregar filas | Manual, fila por fila | Botón por nivel |
| Organización | Tabla plana | Jerárquica |
| Visualización | Todo visible | Colapsable |
| Escalabilidad | Limitada | Ilimitada |
| Experiencia UX | Excel-like | Form-like |
| Excel Output | ❌ Plano | ✅ Formato hospital |
