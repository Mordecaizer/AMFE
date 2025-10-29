# 📚 Documentación del Proyecto AMFE

Toda la documentación técnica del sistema de matrices AMFE para la Fundación Clínica Infantil Club Noel.

---

## 📖 Índice de Documentos

### 📥 Exportación a Excel

1. **[EXCEL_FORMAT_DOCUMENTATION.md](./EXCEL_FORMAT_DOCUMENTATION.md)**
   - 🎯 **Propósito**: Especificación técnica completa del formato Excel exportado
   - 📋 **Contenido**:
     - Estructura detallada (filas 1-6 + datos)
     - Mapeo Handsontable → Excel
     - Colores y estilos con códigos hex
     - Anchos de columnas
     - Ejemplos de código
     - Guía de mantenimiento

2. **[RESUMEN_CAMBIOS_EXCEL.md](./RESUMEN_CAMBIOS_EXCEL.md)**
   - 🎯 **Propósito**: Changelog detallado de cambios en la exportación Excel
   - 📋 **Contenido**:
     - Comparación antes/después
     - Archivos modificados
     - Nuevas características
     - Estilos implementados
     - Pasos de implementación

3. **[GUIA_PRUEBA_EXCEL.md](./GUIA_PRUEBA_EXCEL.md)**
   - 🎯 **Propósito**: Guía paso a paso para testing de exportación Excel
   - 📋 **Contenido**:
     - Pasos de prueba detallados
     - Datos de ejemplo
     - Checklist de verificación completo
     - Troubleshooting
     - Comandos útiles

---

### 📊 Handsontable

4. **[HANDSONTABLE_IMPLEMENTATION.md](./HANDSONTABLE_IMPLEMENTATION.md)**
   - 🎯 **Propósito**: Documentación completa de la implementación de Handsontable
   - 📋 **Contenido**:
     - Atajos de teclado (Tab, Enter, Ctrl+C/V, etc.)
     - Características principales
     - Cálculo automático de RPN
     - Validación de datos
     - Código de colores
     - Troubleshooting común
     - Optimización de performance

---

### 📝 Historial de Cambios

5. **[CHANGELOG_MATRICES_AVANZADAS.md](./CHANGELOG_MATRICES_AVANZADAS.md)**
   - 🎯 **Propósito**: Registro cronológico de todos los cambios en el proyecto
   - 📋 **Contenido**:
     - Implementación de Handsontable
     - Cambios en backend/frontend
     - Nuevas características agregadas
     - Bugs corregidos
     - Mejoras de performance

---

## 🗂️ Organización de Documentos

```
docs/
├── README.md                           # ← Este archivo (índice)
├── EXCEL_FORMAT_DOCUMENTATION.md       # Especificación técnica Excel
├── RESUMEN_CAMBIOS_EXCEL.md            # Changelog Excel
├── GUIA_PRUEBA_EXCEL.md                # Testing Excel
├── HANDSONTABLE_IMPLEMENTATION.md      # Guía Handsontable
└── CHANGELOG_MATRICES_AVANZADAS.md     # Historial general
```

---

## 🚀 Guías de Inicio Rápido

### Para Desarrolladores

1. Lee **[HANDSONTABLE_IMPLEMENTATION.md](./HANDSONTABLE_IMPLEMENTATION.md)** para entender cómo funciona la tabla
2. Revisa **[EXCEL_FORMAT_DOCUMENTATION.md](./EXCEL_FORMAT_DOCUMENTATION.md)** para entender la exportación

### Para Testers

1. Sigue **[GUIA_PRUEBA_EXCEL.md](./GUIA_PRUEBA_EXCEL.md)** para probar el sistema completo

### Para Mantenimiento

1. Consulta **[RESUMEN_CAMBIOS_EXCEL.md](./RESUMEN_CAMBIOS_EXCEL.md)** para entender qué cambió
2. Usa **[CHANGELOG_MATRICES_AVANZADAS.md](./CHANGELOG_MATRICES_AVANZADAS.md)** para ver el historial

---

## 📌 Recursos Adicionales

- **[README principal](../README.md)**: Documentación general del proyecto
- **[Código fuente](../backend/app/)**: Implementación backend
- **[Componentes React](../frontend/src/components/)**: Implementación frontend

---

## 🔄 Actualizaciones

Este directorio contiene documentación viva que se actualiza con cada cambio importante del proyecto.

**Última actualización**: 28 de octubre de 2025
