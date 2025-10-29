import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import { createMatrix, editMatrix, getMatrix, downloadMatrixExcel } from '../../services/api';
import Header from '../Header';

// Registrar todos los módulos de Handsontable
registerAllModules();

const MatrixFormAdvancedHOT = () => {
    const history = useHistory();
    const { id } = useParams();
    const hotRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [matrixName, setMatrixName] = useState('');
    const [matrixDescription, setMatrixDescription] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    // Datos del encabezado
    const [headerData, setHeaderData] = useState({
        fundacion: 'Fundación Clínica Infantil Club Noel',
        servicio: '',
        area: '',
        uci: '',
        elaboradoPor: '',
        equipoBiomedico: '',
        codigo: '',
        version: '1',
        pagina: '1/1',
        fechaEmision: '',
        mes: '',
        año: ''
    });

    // Datos iniciales de la tabla (filas vacías para empezar)
    const [tableData, setTableData] = useState([
        ['', '', '', '', 1, '', 1, '', 1, 1, 'Bajo', '']
    ]);

    // Configuración de columnas
    const columns = [
        { data: 0, title: 'Proceso', type: 'text', width: 150 },
        { data: 1, title: 'Subproceso', type: 'text', width: 150 },
        { data: 2, title: 'Falla Potencial', type: 'text', width: 180 },
        { data: 3, title: 'Efecto Potencial', type: 'text', width: 180 },
        { 
            data: 4, 
            title: 'Severidad', 
            type: 'numeric',
            width: 90,
            validator: function(value, callback) {
                callback(value >= 1 && value <= 10);
            }
        },
        { data: 5, title: 'Causa Potencial', type: 'text', width: 180 },
        { 
            data: 6, 
            title: 'Ocurrencia', 
            type: 'numeric',
            width: 90,
            validator: function(value, callback) {
                callback(value >= 1 && value <= 10);
            }
        },
        { data: 7, title: 'Barrera Existente', type: 'text', width: 180 },
        { 
            data: 8, 
            title: 'Detectabilidad', 
            type: 'numeric',
            width: 110,
            validator: function(value, callback) {
                callback(value >= 1 && value <= 10);
            }
        },
        { 
            data: 9, 
            title: 'RPN', 
            type: 'numeric',
            readOnly: true,
            width: 80,
            className: 'htCenter htMiddle'
        },
        { 
            data: 10, 
            title: 'Tipo de Riesgo', 
            type: 'text',
            readOnly: true,
            width: 100,
            className: 'htCenter htMiddle'
        },
        { data: 11, title: 'Acciones Recomendadas', type: 'text', width: 200 }
    ];

    // Cargar matriz si estamos en modo edición
    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            loadMatrix(id);
        }
    }, [id]);

    const loadMatrix = async (matrixId) => {
        setLoading(true);
        try {
            const matrix = await getMatrix(matrixId);
            setMatrixName(matrix.name);
            setMatrixDescription(matrix.description);
            
            if (matrix.data) {
                if (matrix.data.header) {
                    setHeaderData(matrix.data.header);
                }
                if (matrix.data.tableData) {
                    setTableData(matrix.data.tableData);
                }
            }
        } catch (err) {
            console.error('Error al cargar matriz:', err);
            setError('Error al cargar la matriz: ' + (err.response?.data?.detail || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Calcular RPN automáticamente
    const calculateRPN = useCallback((severidad, ocurrencia, detectabilidad) => {
        const sev = parseInt(severidad) || 1;
        const ocu = parseInt(ocurrencia) || 1;
        const det = parseInt(detectabilidad) || 1;
        return sev * ocu * det;
    }, []);

    const getTipoRiesgo = useCallback((rpn) => {
        if (rpn >= 100) return 'Crítico';
        if (rpn >= 50) return 'Alto';
        if (rpn >= 20) return 'Medio';
        return 'Bajo';
    }, []);

    const getRPNColor = useCallback((rpn) => {
        if (rpn >= 100) return '#dc3545';
        if (rpn >= 50) return '#fd7e14';
        if (rpn >= 20) return '#ffc107';
        return '#28a745';
    }, []);

    // Hook después de cada cambio en la tabla
    const afterChange = (changes, source) => {
        if (!changes || source === 'loadData') return;

        const hot = hotRef.current?.hotInstance;
        if (!hot) return;

        changes.forEach(([row, prop, oldValue, newValue]) => {
            // Si cambió severidad, ocurrencia o detectabilidad, recalcular RPN
            if ([4, 6, 8].includes(prop)) {
                const severidad = hot.getDataAtCell(row, 4) || 1;
                const ocurrencia = hot.getDataAtCell(row, 6) || 1;
                const detectabilidad = hot.getDataAtCell(row, 8) || 1;
                
                const rpn = calculateRPN(severidad, ocurrencia, detectabilidad);
                const tipoRiesgo = getTipoRiesgo(rpn);

                hot.setDataAtCell(row, 9, rpn, 'internal');
                hot.setDataAtCell(row, 10, tipoRiesgo, 'internal');
            }
        });
    };

    // Personalizar el renderizado de celdas
    const cells = function(row, col) {
        const cellProperties = {};
        
        // Colorear celdas de RPN según el valor
        if (col === 9) {
            const rpn = this.instance.getDataAtCell(row, col);
            cellProperties.renderer = function(instance, td, row, col, prop, value, cellProperties) {
                td.innerHTML = value || '';
                td.style.textAlign = 'center';
                td.style.fontWeight = 'bold';
                td.style.color = 'white';
                
                if (value >= 100) {
                    td.style.backgroundColor = '#dc3545';
                } else if (value >= 50) {
                    td.style.backgroundColor = '#fd7e14';
                } else if (value >= 20) {
                    td.style.backgroundColor = '#ffc107';
                    td.style.color = '#000';
                } else {
                    td.style.backgroundColor = '#28a745';
                }
                
                return td;
            };
        }

        // Colorear celdas de Tipo de Riesgo
        if (col === 10) {
            cellProperties.renderer = function(instance, td, row, col, prop, value, cellProperties) {
                td.innerHTML = value || '';
                td.style.textAlign = 'center';
                td.style.fontWeight = 'bold';
                
                if (value === 'Crítico') {
                    td.style.backgroundColor = '#f8d7da';
                    td.style.color = '#721c24';
                } else if (value === 'Alto') {
                    td.style.backgroundColor = '#fff3cd';
                    td.style.color = '#856404';
                } else if (value === 'Medio') {
                    td.style.backgroundColor = '#d1ecf1';
                    td.style.color = '#0c5460';
                } else {
                    td.style.backgroundColor = '#d4edda';
                    td.style.color = '#155724';
                }
                
                return td;
            };
        }

        return cellProperties;
    };

    // Manejador del header
    const handleHeaderChange = useCallback((field, value) => {
        setHeaderData(prev => ({ ...prev, [field]: value }));
    }, []);

    // Guardar matriz
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const hot = hotRef.current?.hotInstance;
            const currentData = hot ? hot.getData() : tableData;

            const matrixData = {
                name: matrixName || `AMFE - ${headerData.equipoBiomedico || 'Sin nombre'}`,
                description: matrixDescription || `Análisis AMFE para ${headerData.servicio} - ${headerData.area}`,
                data: {
                    header: headerData,
                    tableData: currentData
                }
            };

            if (isEditMode) {
                await editMatrix(id, matrixData);
            } else {
                await createMatrix(matrixData);
            }
            
            history.push('/matrices');
        } catch (err) {
            console.error('Error al guardar:', err);
            setError('Error al guardar la matriz: ' + (err.response?.data?.detail || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Descargar Excel
    const handleDownloadExcel = async () => {
        if (!isEditMode || !id) {
            setError('Primero debes guardar la matriz antes de descargarla');
            return;
        }

        setLoading(true);
        try {
            const filename = `AMFE_${headerData.equipoBiomedico || 'Matrix'}_${id}.xlsx`;
            await downloadMatrixExcel(id, filename);
        } catch (err) {
            console.error('Error al descargar:', err);
            setError('Error al descargar la matriz: ' + (err.response?.data?.detail || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Agregar fila
    const addRow = () => {
        const hot = hotRef.current?.hotInstance;
        if (hot) {
            hot.alter('insert_row_below', hot.countRows());
        }
    };

    // Eliminar fila seleccionada
    const removeSelectedRows = () => {
        const hot = hotRef.current?.hotInstance;
        if (hot) {
            const selected = hot.getSelected();
            if (selected && selected.length > 0) {
                const [startRow, , endRow] = selected[0];
                hot.alter('remove_row', startRow, endRow - startRow + 1);
            }
        }
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="card">
                    <div className="card-header">
                        <h1 className="card-title">
                            {isEditMode ? 'Editar Matriz AMFE' : 'Nueva Matriz AMFE'}
                        </h1>
                        <p className="card-description">
                            Análisis de Modo y Efecto de Fallas - Handsontable Edition
                        </p>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* INFORMACIÓN DE LA MATRIZ */}
                        <div className="amfe-header-section">
                            <h2>Información de la Matriz</h2>
                            <div className="header-grid">
                                <div className="form-group">
                                    <label>Nombre de la Matriz *</label>
                                    <input
                                        type="text"
                                        value={matrixName}
                                        onChange={(e) => setMatrixName(e.target.value)}
                                        className="form-input"
                                        placeholder="Ej: AMFE - Equipo Biomédico UCI"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Descripción</label>
                                    <textarea
                                        value={matrixDescription}
                                        onChange={(e) => setMatrixDescription(e.target.value)}
                                        className="form-input"
                                        rows="2"
                                        placeholder="Breve descripción de la matriz..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ENCABEZADO */}
                        <div className="amfe-header-section">
                            <h2>Información del Encabezado</h2>
                            <div className="header-grid">
                                <div className="form-group">
                                    <label>Fundación</label>
                                    <input
                                        type="text"
                                        value={headerData.fundacion}
                                        onChange={(e) => handleHeaderChange('fundacion', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Servicio</label>
                                    <input
                                        type="text"
                                        value={headerData.servicio}
                                        onChange={(e) => handleHeaderChange('servicio', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Área</label>
                                    <input
                                        type="text"
                                        value={headerData.area}
                                        onChange={(e) => handleHeaderChange('area', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>UCI</label>
                                    <input
                                        type="text"
                                        value={headerData.uci}
                                        onChange={(e) => handleHeaderChange('uci', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Elaborado por</label>
                                    <input
                                        type="text"
                                        value={headerData.elaboradoPor}
                                        onChange={(e) => handleHeaderChange('elaboradoPor', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Equipo Biomédico</label>
                                    <input
                                        type="text"
                                        value={headerData.equipoBiomedico}
                                        onChange={(e) => handleHeaderChange('equipoBiomedico', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Código</label>
                                    <input
                                        type="text"
                                        value={headerData.codigo}
                                        onChange={(e) => handleHeaderChange('codigo', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Versión</label>
                                    <input
                                        type="text"
                                        value={headerData.version}
                                        onChange={(e) => handleHeaderChange('version', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Página</label>
                                    <input
                                        type="text"
                                        value={headerData.pagina}
                                        onChange={(e) => handleHeaderChange('pagina', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Fecha Emisión</label>
                                    <input
                                        type="date"
                                        value={headerData.fechaEmision}
                                        onChange={(e) => handleHeaderChange('fechaEmision', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mes</label>
                                    <input
                                        type="text"
                                        value={headerData.mes}
                                        onChange={(e) => handleHeaderChange('mes', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Año</label>
                                    <input
                                        type="text"
                                        value={headerData.año}
                                        onChange={(e) => handleHeaderChange('año', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* TABLA HANDSONTABLE */}
                        <div className="amfe-table-section">
                            <div className="table-header-actions">
                                <h2>Matriz AMFE</h2>
                                <div className="flex gap-2">
                                    <button 
                                        type="button" 
                                        onClick={addRow} 
                                        className="btn btn-success btn-sm"
                                    >
                                        ➕ Agregar Fila
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={removeSelectedRows} 
                                        className="btn btn-danger btn-sm"
                                    >
                                        🗑️ Eliminar Selección
                                    </button>
                                </div>
                            </div>
                            
                            <div className="hot-container" style={{ 
                                overflow: 'auto', 
                                marginTop: '1rem',
                                border: '1px solid #dee2e6',
                                borderRadius: '8px'
                            }}>
                                <HotTable
                                    ref={hotRef}
                                    data={tableData}
                                    columns={columns}
                                    colHeaders={true}
                                    rowHeaders={true}
                                    width="100%"
                                    height="600"
                                    licenseKey="non-commercial-and-evaluation"
                                    stretchH="all"
                                    contextMenu={true}
                                    manualColumnResize={true}
                                    manualRowResize={true}
                                    afterChange={afterChange}
                                    cells={cells}
                                    mergeCells={false}
                                    copyPaste={true}
                                    fillHandle={true}
                                    autoWrapRow={true}
                                    autoWrapCol={true}
                                    language="es-MX"
                                />
                            </div>

                            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>💡 Instrucciones:</h3>
                                <ul style={{ fontSize: '0.85rem', margin: 0, paddingLeft: '1.5rem' }}>
                                    <li>Haz doble clic en cualquier celda para editar</li>
                                    <li>Severidad, Ocurrencia y Detectabilidad: valores del 1 al 10</li>
                                    <li>RPN se calcula automáticamente: Severidad × Ocurrencia × Detectabilidad</li>
                                    <li>Puedes copiar y pegar desde Excel (Ctrl+C / Ctrl+V)</li>
                                    <li>Click derecho para más opciones</li>
                                    <li>Agrupa filas manualmente usando el mismo texto en "Proceso" o "Subproceso"</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <button type="button" onClick={() => history.push('/matrices')} className="btn btn-secondary">
                                Cancelar
                            </button>
                            <div className="flex gap-2">
                                {isEditMode && (
                                    <button 
                                        type="button" 
                                        onClick={handleDownloadExcel} 
                                        className="btn btn-success"
                                        disabled={loading}
                                    >
                                        📥 Descargar Excel
                                    </button>
                                )}
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Guardando...' : (isEditMode ? 'Actualizar Matriz AMFE' : 'Guardar Matriz AMFE')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default MatrixFormAdvancedHOT;
