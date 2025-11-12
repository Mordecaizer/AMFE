import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { createModularMatrix, editModularMatrix, getModularMatrix, downloadModularMatrixExcel } from '../../services/api';
import Header from '../Header';
import './MatrixFormModular.css';

const MatrixFormModular = () => {
    const { id } = useParams();
    const history = useHistory();
    const isEditMode = !!id;

    // Estado del formulario
    const [matrixName, setMatrixName] = useState('');
    const [matrixDescription, setMatrixDescription] = useState('');
    
    // Estado del header
    const [header, setHeader] = useState({
        fundacion: 'Fundación Clínica Infantil Club Noel',
        codigo: '',
        version: '1',
        pagina: '1',
        mes: '',
        año: new Date().getFullYear().toString(),
        servicio: '',
        area: '',
        elaboradoPor: '',
        equipo: '',
        fechaEmision: new Date().toISOString().split('T')[0]
    });

    // Estado de procesos
    const [procesos, setProcesos] = useState([
        {
            id: 'proc-1',
            nombre: '',
            color: '#C6E0B4',
            subprocesos: [
                {
                    id: 'subproc-1',
                    nombre: '',
                    fallasPotenciales: [
                        {
                            id: 'falla-1',
                            descripcion: '',
                            efectosPotenciales: [{ id: 'efecto-1', descripcion: '' }],
                            causasPotenciales: [{ id: 'causa-1', descripcion: '' }],
                            barrerasExistentes: [{ id: 'barrera-1', descripcion: '' }],
                            evaluacion: {
                                severidad: 1,
                                detectabilidad: 1,
                                ocurrencia: 1,
                                rpn: 1
                            },
                            accionesRecomendadas: [],
                            accionesTomadas: [],
                            responsable: ''
                        }
                    ]
                }
            ]
        }
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Cargar matriz en modo edición
    useEffect(() => {
        if (isEditMode) {
            loadMatrix();
        }
    }, [id]);

    const loadMatrix = async () => {
        try {
            setLoading(true);
            const matrix = await getModularMatrix(id);
            setMatrixName(matrix.name);
            setMatrixDescription(matrix.description || '');
            
            const data = matrix.data;
            setHeader(data.header);
            setProcesos(data.procesos);
            
            setLoading(false);
        } catch (err) {
            setError('Error al cargar la matriz');
            setLoading(false);
        }
    };

    // ==================== CALCULAR RPN ====================
    const calcularRPN = (severidad, detectabilidad, ocurrencia) => {
        return severidad * detectabilidad * ocurrencia;
    };

    // ==================== HANDLERS DE HEADER ====================
    const handleHeaderChange = (field, value) => {
        setHeader(prev => ({ ...prev, [field]: value }));
    };

    // ==================== HANDLERS DE PROCESO ====================
    const agregarProceso = () => {
        const newId = `proc-${Date.now()}`;
        setProcesos([...procesos, {
            id: newId,
            nombre: '',
            color: '#C6E0B4',
            subprocesos: [{
                id: `subproc-${Date.now()}`,
                nombre: '',
                fallasPotenciales: [{
                    id: `falla-${Date.now()}`,
                    descripcion: '',
                    efectosPotenciales: [{ id: `efecto-${Date.now()}`, descripcion: '' }],
                    causasPotenciales: [{ id: `causa-${Date.now()}`, descripcion: '' }],
                    barrerasExistentes: [{ id: `barrera-${Date.now()}`, descripcion: '' }],
                    evaluacion: { severidad: 1, detectabilidad: 1, ocurrencia: 1, rpn: 1 },
                    accionesRecomendadas: [],
                    accionesTomadas: [],
                    responsable: ''
                }]
            }]
        }]);
    };

    const eliminarProceso = (procesoId) => {
        if (procesos.length === 1) {
            alert('Debe haber al menos un proceso');
            return;
        }
        setProcesos(procesos.filter(p => p.id !== procesoId));
    };

    const actualizarProceso = (procesoId, field, value) => {
        setProcesos(procesos.map(p => 
            p.id === procesoId ? { ...p, [field]: value } : p
        ));
    };

    // ==================== HANDLERS DE SUBPROCESO ====================
    const agregarSubproceso = (procesoId) => {
        setProcesos(procesos.map(p => {
            if (p.id === procesoId) {
                return {
                    ...p,
                    subprocesos: [...p.subprocesos, {
                        id: `subproc-${Date.now()}`,
                        nombre: '',
                        fallasPotenciales: [{
                            id: `falla-${Date.now()}`,
                            descripcion: '',
                            efectosPotenciales: [{ id: `efecto-${Date.now()}`, descripcion: '' }],
                            causasPotenciales: [{ id: `causa-${Date.now()}`, descripcion: '' }],
                            barrerasExistentes: [{ id: `barrera-${Date.now()}`, descripcion: '' }],
                            evaluacion: { severidad: 1, detectabilidad: 1, ocurrencia: 1, rpn: 1 },
                            accionesRecomendadas: [],
                            accionesTomadas: [],
                            responsable: ''
                        }]
                    }]
                };
            }
            return p;
        }));
    };

    const eliminarSubproceso = (procesoId, subprocesoId) => {
        setProcesos(procesos.map(p => {
            if (p.id === procesoId) {
                if (p.subprocesos.length === 1) {
                    alert('Debe haber al menos un subproceso por proceso');
                    return p;
                }
                return {
                    ...p,
                    subprocesos: p.subprocesos.filter(s => s.id !== subprocesoId)
                };
            }
            return p;
        }));
    };

    const actualizarSubproceso = (procesoId, subprocesoId, value) => {
        setProcesos(procesos.map(p => {
            if (p.id === procesoId) {
                return {
                    ...p,
                    subprocesos: p.subprocesos.map(s =>
                        s.id === subprocesoId ? { ...s, nombre: value } : s
                    )
                };
            }
            return p;
        }));
    };

    // ==================== HANDLERS DE FALLA ====================
    const agregarFalla = (procesoId, subprocesoId) => {
        setProcesos(procesos.map(p => {
            if (p.id === procesoId) {
                return {
                    ...p,
                    subprocesos: p.subprocesos.map(s => {
                        if (s.id === subprocesoId) {
                            return {
                                ...s,
                                fallasPotenciales: [...s.fallasPotenciales, {
                                    id: `falla-${Date.now()}`,
                                    descripcion: '',
                                    efectosPotenciales: [{ id: `efecto-${Date.now()}`, descripcion: '' }],
                                    causasPotenciales: [{ id: `causa-${Date.now()}`, descripcion: '' }],
                                    barrerasExistentes: [{ id: `barrera-${Date.now()}`, descripcion: '' }],
                                    evaluacion: { severidad: 1, detectabilidad: 1, ocurrencia: 1, rpn: 1 },
                                    accionesRecomendadas: [],
                                    accionesTomadas: [],
                                    responsable: ''
                                }]
                            };
                        }
                        return s;
                    })
                };
            }
            return p;
        }));
    };

    const eliminarFalla = (procesoId, subprocesoId, fallaId) => {
        setProcesos(procesos.map(p => {
            if (p.id === procesoId) {
                return {
                    ...p,
                    subprocesos: p.subprocesos.map(s => {
                        if (s.id === subprocesoId) {
                            if (s.fallasPotenciales.length === 1) {
                                alert('Debe haber al menos una falla por subproceso');
                                return s;
                            }
                            return {
                                ...s,
                                fallasPotenciales: s.fallasPotenciales.filter(f => f.id !== fallaId)
                            };
                        }
                        return s;
                    })
                };
            }
            return p;
        }));
    };

    const actualizarFalla = (procesoId, subprocesoId, fallaId, field, value) => {
        setProcesos(procesos.map(p => {
            if (p.id === procesoId) {
                return {
                    ...p,
                    subprocesos: p.subprocesos.map(s => {
                        if (s.id === subprocesoId) {
                            return {
                                ...s,
                                fallasPotenciales: s.fallasPotenciales.map(f => {
                                    if (f.id === fallaId) {
                                        return { ...f, [field]: value };
                                    }
                                    return f;
                                })
                            };
                        }
                        return s;
                    })
                };
            }
            return p;
        }));
    };

    const actualizarEvaluacion = (procesoId, subprocesoId, fallaId, field, value) => {
        setProcesos(procesos.map(p => {
            if (p.id === procesoId) {
                return {
                    ...p,
                    subprocesos: p.subprocesos.map(s => {
                        if (s.id === subprocesoId) {
                            return {
                                ...s,
                                fallasPotenciales: s.fallasPotenciales.map(f => {
                                    if (f.id === fallaId) {
                                        const newEval = { ...f.evaluacion, [field]: parseInt(value) };
                                        newEval.rpn = calcularRPN(newEval.severidad, newEval.detectabilidad, newEval.ocurrencia);
                                        return { ...f, evaluacion: newEval };
                                    }
                                    return f;
                                })
                            };
                        }
                        return s;
                    })
                };
            }
            return p;
        }));
    };

    // ==================== HANDLERS DE ELEMENTOS (Efectos, Causas, etc) ====================
    const agregarElemento = (procesoId, subprocesoId, fallaId, tipo) => {
        setProcesos(procesos.map(p => {
            if (p.id === procesoId) {
                return {
                    ...p,
                    subprocesos: p.subprocesos.map(s => {
                        if (s.id === subprocesoId) {
                            return {
                                ...s,
                                fallasPotenciales: s.fallasPotenciales.map(f => {
                                    if (f.id === fallaId) {
                                        const newId = `${tipo}-${Date.now()}`;
                                        return {
                                            ...f,
                                            [tipo]: [...f[tipo], { id: newId, descripcion: '' }]
                                        };
                                    }
                                    return f;
                                })
                            };
                        }
                        return s;
                    })
                };
            }
            return p;
        }));
    };

    const eliminarElemento = (procesoId, subprocesoId, fallaId, tipo, elementoId) => {
        setProcesos(procesos.map(p => {
            if (p.id === procesoId) {
                return {
                    ...p,
                    subprocesos: p.subprocesos.map(s => {
                        if (s.id === subprocesoId) {
                            return {
                                ...s,
                                fallasPotenciales: s.fallasPotenciales.map(f => {
                                    if (f.id === fallaId) {
                                        if (f[tipo].length === 1) {
                                            alert(`Debe haber al menos un elemento de tipo ${tipo}`);
                                            return f;
                                        }
                                        return {
                                            ...f,
                                            [tipo]: f[tipo].filter(e => e.id !== elementoId)
                                        };
                                    }
                                    return f;
                                })
                            };
                        }
                        return s;
                    })
                };
            }
            return p;
        }));
    };

    const actualizarElemento = (procesoId, subprocesoId, fallaId, tipo, elementoId, value) => {
        setProcesos(procesos.map(p => {
            if (p.id === procesoId) {
                return {
                    ...p,
                    subprocesos: p.subprocesos.map(s => {
                        if (s.id === subprocesoId) {
                            return {
                                ...s,
                                fallasPotenciales: s.fallasPotenciales.map(f => {
                                    if (f.id === fallaId) {
                                        return {
                                            ...f,
                                            [tipo]: f[tipo].map(e =>
                                                e.id === elementoId ? { ...e, descripcion: value } : e
                                            )
                                        };
                                    }
                                    return f;
                                })
                            };
                        }
                        return s;
                    })
                };
            }
            return p;
        }));
    };

    // ==================== GUARDAR Y EXPORTAR ====================
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones básicas
        if (!matrixName.trim()) {
            alert('El nombre de la matriz es obligatorio');
            return;
        }

        if (!header.servicio.trim() || !header.area.trim() || !header.elaboradoPor.trim() || !header.equipo.trim()) {
            alert('Todos los campos del encabezado son obligatorios');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const matrixData = {
                name: matrixName,
                description: matrixDescription,
                data: {
                    header,
                    procesos
                }
            };

            if (isEditMode) {
                await editModularMatrix(id, matrixData);
                alert('Matriz actualizada correctamente');
            } else {
                await createModularMatrix(matrixData);
                alert('Matriz creada correctamente');
            }

            history.push('/matrices');
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al guardar la matriz');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadExcel = async () => {
        if (!id) {
            alert('Debes guardar la matriz primero');
            return;
        }

        try {
            const filename = `AMFE_Modular_${matrixName.replace(/\s+/g, '_')}.xlsx`;
            await downloadModularMatrixExcel(id, filename);
            alert('Excel descargado correctamente');
        } catch (err) {
            alert('Error al descargar el Excel');
        }
    };

    if (loading) return <div className="loading">Cargando...</div>;

    return (
        <div className="matrix-form-modular">
            <Header />
            <div className="container">
                <h1>{isEditMode ? 'Editar' : 'Crear'} Matriz AMFE Modular</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Información básica de la matriz */}
                    <div className="form-section">
                        <h2>Información de la Matriz</h2>
                        <div className="form-group">
                            <label>Nombre de la Matriz *</label>
                            <input
                                type="text"
                                value={matrixName}
                                onChange={(e) => setMatrixName(e.target.value)}
                                placeholder="Ej: AMFE Equipos Biomédicos UCI"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea
                                value={matrixDescription}
                                onChange={(e) => setMatrixDescription(e.target.value)}
                                placeholder="Descripción opcional de la matriz"
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Encabezado */}
                    <div className="form-section">
                        <h2>Encabezado del Documento</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Fundación</label>
                                <input
                                    type="text"
                                    value={header.fundacion}
                                    onChange={(e) => handleHeaderChange('fundacion', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Código</label>
                                <input
                                    type="text"
                                    value={header.codigo}
                                    onChange={(e) => handleHeaderChange('codigo', e.target.value)}
                                    placeholder="Ej: AMFE-001"
                                />
                            </div>
                            <div className="form-group">
                                <label>Versión</label>
                                <input
                                    type="text"
                                    value={header.version}
                                    onChange={(e) => handleHeaderChange('version', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Servicio *</label>
                                <input
                                    type="text"
                                    value={header.servicio}
                                    onChange={(e) => handleHeaderChange('servicio', e.target.value)}
                                    placeholder="Ej: UNIDAD DE CUIDADOS INTENSIVOS"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Área *</label>
                                <input
                                    type="text"
                                    value={header.area}
                                    onChange={(e) => handleHeaderChange('area', e.target.value)}
                                    placeholder="Ej: UCI"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Elaborado Por *</label>
                                <input
                                    type="text"
                                    value={header.elaboradoPor}
                                    onChange={(e) => handleHeaderChange('elaboradoPor', e.target.value)}
                                    placeholder="Nombre completo"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Equipo Biomédico *</label>
                                <input
                                    type="text"
                                    value={header.equipo}
                                    onChange={(e) => handleHeaderChange('equipo', e.target.value)}
                                    placeholder="Ej: BOMBA DE NUTRICIÓN"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Fecha de Emisión</label>
                                <input
                                    type="date"
                                    value={header.fechaEmision}
                                    onChange={(e) => handleHeaderChange('fechaEmision', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Procesos */}
                    <div className="form-section">
                        <div className="section-header">
                            <h2>Procesos</h2>
                            <button type="button" className="btn-add" onClick={agregarProceso}>
                                + Agregar Proceso
                            </button>
                        </div>

                        {procesos.map((proceso, procesoIndex) => (
                            <div key={proceso.id} className="proceso-module">
                                <div className="module-header" style={{ backgroundColor: proceso.color }}>
                                    <input
                                        type="text"
                                        className="proceso-nombre"
                                        value={proceso.nombre}
                                        onChange={(e) => actualizarProceso(proceso.id, 'nombre', e.target.value)}
                                        placeholder="Nombre del proceso (ej: PLANEACIÓN)"
                                    />
                                    <div className="module-actions">
                                        <input
                                            type="color"
                                            value={proceso.color}
                                            onChange={(e) => actualizarProceso(proceso.id, 'color', e.target.value)}
                                            title="Color del proceso"
                                        />
                                        {procesos.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn-delete"
                                                onClick={() => eliminarProceso(proceso.id)}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Subprocesos */}
                                {proceso.subprocesos.map((subproceso, subprocesoIndex) => (
                                    <div key={subproceso.id} className="subproceso-module">
                                        <div className="submodule-header">
                                            <span className="submodule-label">Subproceso:</span>
                                            <input
                                                type="text"
                                                className="subproceso-nombre"
                                                value={subproceso.nombre}
                                                onChange={(e) => actualizarSubproceso(proceso.id, subproceso.id, e.target.value)}
                                                placeholder="Nombre del subproceso"
                                            />
                                            {proceso.subprocesos.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn-delete-small"
                                                    onClick={() => eliminarSubproceso(proceso.id, subproceso.id)}
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>

                                        {/* Fallas Potenciales */}
                                        {subproceso.fallasPotenciales.map((falla, fallaIndex) => (
                                            <div key={falla.id} className="falla-module">
                                                <div className="falla-header">
                                                    <h4>Falla Potencial #{fallaIndex + 1}</h4>
                                                    {subproceso.fallasPotenciales.length > 1 && (
                                                        <button
                                                            type="button"
                                                            className="btn-delete-small"
                                                            onClick={() => eliminarFalla(proceso.id, subproceso.id, falla.id)}
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="form-group">
                                                    <label>Descripción de la Falla *</label>
                                                    <textarea
                                                        value={falla.descripcion}
                                                        onChange={(e) => actualizarFalla(proceso.id, subproceso.id, falla.id, 'descripcion', e.target.value)}
                                                        placeholder="Describa la falla potencial"
                                                        rows="2"
                                                        required
                                                    />
                                                </div>

                                                {/* Efectos Potenciales */}
                                                <div className="elementos-section">
                                                    <label>Efectos Potenciales *</label>
                                                    {falla.efectosPotenciales.map((efecto, efectoIndex) => (
                                                        <div key={efecto.id} className="elemento-item">
                                                            <input
                                                                type="text"
                                                                value={efecto.descripcion}
                                                                onChange={(e) => actualizarElemento(proceso.id, subproceso.id, falla.id, 'efectosPotenciales', efecto.id, e.target.value)}
                                                                placeholder={`Efecto #${efectoIndex + 1}`}
                                                                required
                                                            />
                                                            {falla.efectosPotenciales.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    className="btn-remove"
                                                                    onClick={() => eliminarElemento(proceso.id, subproceso.id, falla.id, 'efectosPotenciales', efecto.id)}
                                                                >
                                                                    −
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        className="btn-add-small"
                                                        onClick={() => agregarElemento(proceso.id, subproceso.id, falla.id, 'efectosPotenciales')}
                                                    >
                                                        + Agregar Efecto
                                                    </button>
                                                </div>

                                                {/* Causas Potenciales */}
                                                <div className="elementos-section">
                                                    <label>Causas Potenciales *</label>
                                                    {falla.causasPotenciales.map((causa, causaIndex) => (
                                                        <div key={causa.id} className="elemento-item">
                                                            <input
                                                                type="text"
                                                                value={causa.descripcion}
                                                                onChange={(e) => actualizarElemento(proceso.id, subproceso.id, falla.id, 'causasPotenciales', causa.id, e.target.value)}
                                                                placeholder={`Causa #${causaIndex + 1}`}
                                                                required
                                                            />
                                                            {falla.causasPotenciales.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    className="btn-remove"
                                                                    onClick={() => eliminarElemento(proceso.id, subproceso.id, falla.id, 'causasPotenciales', causa.id)}
                                                                >
                                                                    −
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        className="btn-add-small"
                                                        onClick={() => agregarElemento(proceso.id, subproceso.id, falla.id, 'causasPotenciales')}
                                                    >
                                                        + Agregar Causa
                                                    </button>
                                                </div>

                                                {/* Barreras Existentes */}
                                                <div className="elementos-section">
                                                    <label>Barreras Existentes *</label>
                                                    {falla.barrerasExistentes.map((barrera, barreraIndex) => (
                                                        <div key={barrera.id} className="elemento-item">
                                                            <input
                                                                type="text"
                                                                value={barrera.descripcion}
                                                                onChange={(e) => actualizarElemento(proceso.id, subproceso.id, falla.id, 'barrerasExistentes', barrera.id, e.target.value)}
                                                                placeholder={`Barrera #${barreraIndex + 1}`}
                                                                required
                                                            />
                                                            {falla.barrerasExistentes.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    className="btn-remove"
                                                                    onClick={() => eliminarElemento(proceso.id, subproceso.id, falla.id, 'barrerasExistentes', barrera.id)}
                                                                >
                                                                    −
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        className="btn-add-small"
                                                        onClick={() => agregarElemento(proceso.id, subproceso.id, falla.id, 'barrerasExistentes')}
                                                    >
                                                        + Agregar Barrera
                                                    </button>
                                                </div>

                                                {/* Evaluación */}
                                                <div className="evaluacion-section">
                                                    <h5>Evaluación de Riesgo</h5>
                                                    <div className="evaluacion-grid">
                                                        <div className="form-group">
                                                            <label>Severidad (1-5)</label>
                                                            <select
                                                                value={falla.evaluacion.severidad}
                                                                onChange={(e) => actualizarEvaluacion(proceso.id, subproceso.id, falla.id, 'severidad', e.target.value)}
                                                                required
                                                            >
                                                                <option value="1">1</option>
                                                                <option value="2">2</option>
                                                                <option value="3">3</option>
                                                                <option value="4">4</option>
                                                                <option value="5">5</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Detectabilidad (1-5)</label>
                                                            <select
                                                                value={falla.evaluacion.detectabilidad}
                                                                onChange={(e) => actualizarEvaluacion(proceso.id, subproceso.id, falla.id, 'detectabilidad', e.target.value)}
                                                                required
                                                            >
                                                                <option value="1">1</option>
                                                                <option value="2">2</option>
                                                                <option value="3">3</option>
                                                                <option value="4">4</option>
                                                                <option value="5">5</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Ocurrencia (1-5)</label>
                                                            <select
                                                                value={falla.evaluacion.ocurrencia}
                                                                onChange={(e) => actualizarEvaluacion(proceso.id, subproceso.id, falla.id, 'ocurrencia', e.target.value)}
                                                                required
                                                            >
                                                                <option value="1">1</option>
                                                                <option value="2">2</option>
                                                                <option value="3">3</option>
                                                                <option value="4">4</option>
                                                                <option value="5">5</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>RPN (Calculado)</label>
                                                            <input
                                                                type="text"
                                                                value={falla.evaluacion.rpn}
                                                                readOnly
                                                                className="rpn-display"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Acciones Recomendadas */}
                                                <div className="elementos-section">
                                                    <label>Acciones Recomendadas</label>
                                                    {falla.accionesRecomendadas.map((accion, accionIndex) => (
                                                        <div key={accion.id} className="elemento-item">
                                                            <input
                                                                type="text"
                                                                value={accion.descripcion}
                                                                onChange={(e) => actualizarElemento(proceso.id, subproceso.id, falla.id, 'accionesRecomendadas', accion.id, e.target.value)}
                                                                placeholder={`Acción recomendada #${accionIndex + 1}`}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn-remove"
                                                                onClick={() => eliminarElemento(proceso.id, subproceso.id, falla.id, 'accionesRecomendadas', accion.id)}
                                                            >
                                                                −
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        className="btn-add-small"
                                                        onClick={() => agregarElemento(proceso.id, subproceso.id, falla.id, 'accionesRecomendadas')}
                                                    >
                                                        + Agregar Acción Recomendada
                                                    </button>
                                                </div>

                                                {/* Acciones Tomadas */}
                                                <div className="elementos-section">
                                                    <label>Acciones Tomadas</label>
                                                    {falla.accionesTomadas.map((accion, accionIndex) => (
                                                        <div key={accion.id} className="elemento-item">
                                                            <input
                                                                type="text"
                                                                value={accion.descripcion}
                                                                onChange={(e) => actualizarElemento(proceso.id, subproceso.id, falla.id, 'accionesTomadas', accion.id, e.target.value)}
                                                                placeholder={`Acción tomada #${accionIndex + 1}`}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn-remove"
                                                                onClick={() => eliminarElemento(proceso.id, subproceso.id, falla.id, 'accionesTomadas', accion.id)}
                                                            >
                                                                −
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        className="btn-add-small"
                                                        onClick={() => agregarElemento(proceso.id, subproceso.id, falla.id, 'accionesTomadas')}
                                                    >
                                                        + Agregar Acción Tomada
                                                    </button>
                                                </div>

                                                {/* Responsable */}
                                                <div className="form-group">
                                                    <label>Responsable</label>
                                                    <input
                                                        type="text"
                                                        value={falla.responsable}
                                                        onChange={(e) => actualizarFalla(proceso.id, subproceso.id, falla.id, 'responsable', e.target.value)}
                                                        placeholder="Nombre del responsable"
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            className="btn-add-medium"
                                            onClick={() => agregarFalla(proceso.id, subproceso.id)}
                                        >
                                            + Agregar Falla Potencial
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="btn-add-medium"
                                    onClick={() => agregarSubproceso(proceso.id)}
                                >
                                    + Agregar Subproceso
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Botones de acción */}
                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear')} Matriz
                        </button>
                        {isEditMode && (
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleDownloadExcel}
                                disabled={loading}
                            >
                                📥 Descargar Excel
                            </button>
                        )}
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => history.push('/matrices')}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MatrixFormModular;
