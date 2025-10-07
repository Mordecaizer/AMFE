import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { createMatrix, editMatrix } from '../../services/api';
import Header from '../Header';

const MatrixForm = () => {
    const { id } = useParams();
    const history = useHistory();
    const isMountedRef = useRef(true);
    const [matrixData, setMatrixData] = useState({
        name: '',
        description: '',
        data: {
            equipment: '',
            process: '',
            function: '',
            failure_mode: '',
            failure_effect: '',
            failure_cause: '',
            current_controls: '',
            severity: 1,
            occurrence: 1,
            detection: 1,
            rpn: 1,
            recommended_action: '',
            responsibility: '',
            target_date: '',
            action_taken: '',
            new_severity: 1,
            new_occurrence: 1,
            new_detection: 1,
            new_rpn: 1
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            fetchMatrix();
        }
        calculateRPN();
        
        return () => {
            isMountedRef.current = false;
        };
    }, [id]);

    const fetchMatrix = async () => {
        if (!isMountedRef.current) return;
        
        try {
            setLoading(true);
            
            // Crear headers con token si existe
            const userData = localStorage.getItem('user');
            let headers = { 'Content-Type': 'application/json' };
            if (userData) {
                const user = JSON.parse(userData);
                if (user.token) {
                    headers['Authorization'] = `Bearer ${user.token}`;
                }
            }
            
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
            const response = await fetch(`${API_URL}/matrices/${id}`, { headers });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const matrix = await response.json();
            
            if (isMountedRef.current) {
                // Cargar los datos de la matriz en el formulario
                setMatrixData({
                    name: matrix.name || '',
                    description: matrix.description || '',
                    data: {
                        equipment: matrix.data?.equipment || '',
                        process: matrix.data?.process || '',
                        function: matrix.data?.function || '',
                        failure_mode: matrix.data?.failure_mode || '',
                        failure_effect: matrix.data?.failure_effect || '',
                        failure_cause: matrix.data?.failure_cause || '',
                        current_controls: matrix.data?.current_controls || '',
                        severity: matrix.data?.severity || 1,
                        occurrence: matrix.data?.occurrence || 1,
                        detection: matrix.data?.detection || 1,
                        rpn: matrix.data?.rpn || 1,
                        recommended_action: matrix.data?.recommended_action || '',
                        responsibility: matrix.data?.responsibility || '',
                        target_date: matrix.data?.target_date || '',
                        action_taken: matrix.data?.action_taken || '',
                        new_severity: matrix.data?.new_severity || 1,
                        new_occurrence: matrix.data?.new_occurrence || 1,
                        new_detection: matrix.data?.new_detection || 1,
                        new_rpn: matrix.data?.new_rpn || 1
                    }
                });
            }
        } catch (err) {
            console.error('Error fetching matrix:', err);
            if (isMountedRef.current) {
                setError('Error al cargar los datos de la matriz: ' + err.message);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };

    const calculateRPN = () => {
        if (!isMountedRef.current) return;
        
        const { severity, occurrence, detection } = matrixData.data;
        const rpn = severity * occurrence * detection;
        setMatrixData(prev => ({
            ...prev,
            data: {
                ...prev.data,
                rpn: rpn
            }
        }));
    };

    const calculateNewRPN = () => {
        if (!isMountedRef.current) return;
        
        const { new_severity, new_occurrence, new_detection } = matrixData.data;
        const new_rpn = new_severity * new_occurrence * new_detection;
        setMatrixData(prev => ({
            ...prev,
            data: {
                ...prev.data,
                new_rpn: new_rpn
            }
        }));
    };

    const handleChange = (e) => {
        if (!isMountedRef.current) return;
        
        const { name, value } = e.target;
        setError('');
        
        if (name === 'name' || name === 'description') {
            setMatrixData(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            // Para campos numéricos (severity, occurrence, detection)
            const numericFields = ['severity', 'occurrence', 'detection', 'new_severity', 'new_occurrence', 'new_detection'];
            const isNumericField = numericFields.includes(name);
            
            setMatrixData(prev => ({
                ...prev,
                data: {
                    ...prev.data,
                    [name]: isNumericField ? parseInt(value) : value
                }
            }));
        }
    };

    useEffect(() => {
        calculateRPN();
    }, [matrixData.data.severity, matrixData.data.occurrence, matrixData.data.detection]);

    useEffect(() => {
        calculateNewRPN();
    }, [matrixData.data.new_severity, matrixData.data.new_occurrence, matrixData.data.new_detection]);

    const getRPNColor = (rpn) => {
        if (rpn >= 200) return 'var(--danger-color)';
        if (rpn >= 100) return 'var(--warning-color)';
        if (rpn >= 50) return 'var(--warning-color)';
        return 'var(--secondary-color)';
    };

    const getRPNLabel = (rpn) => {
        if (rpn >= 200) return 'Crítico';
        if (rpn >= 100) return 'Alto';
        if (rpn >= 50) return 'Medio';
        return 'Bajo';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isMountedRef.current) return;
        
        setLoading(true);
        setError('');

        try {
            // Validaciones
            if (!matrixData.name.trim()) {
                if (isMountedRef.current) {
                    setError('El nombre es requerido');
                }
                return;
            }

            if (!matrixData.description.trim()) {
                if (isMountedRef.current) {
                    setError('La descripción es requerida');
                }
                return;
            }

            if (!matrixData.data.equipment.trim()) {
                if (isMountedRef.current) {
                    setError('El equipo/proceso es requerido');
                }
                return;
            }

            // Validaciones adicionales para campos críticos del AMFE
            const criticalFields = [
                { field: 'function', label: 'Función del Equipo' },
                { field: 'failure_mode', label: 'Modo de Falla' },
                { field: 'failure_effect', label: 'Efecto de la Falla' },
                { field: 'failure_cause', label: 'Causa de la Falla' }
            ];

            for (const { field, label } of criticalFields) {
                if (!matrixData.data[field] || !matrixData.data[field].trim()) {
                    if (isMountedRef.current) {
                        setError(`${label} es requerido para completar el análisis AMFE`);
                    }
                    return;
                }
            }

            if (isEditing) {
                await editMatrix(id, matrixData);
            } else {
                await createMatrix(matrixData);
            }
            
            if (isMountedRef.current) {
                history.push('/matrices');
            }
        } catch (err) {
            console.error('Error al guardar la matriz:', err);
            if (isMountedRef.current) {
                setError('Error al guardar la matriz: ' + (err.response?.data?.detail || err.message));
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };

    return (
        <div className="app">
            <Header />

            <main className="main-content">
                {/* Mostrar loading si está cargando datos en modo edición */}
                {loading && isEditing ? (
                    <div className="card">
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Cargando datos de la matriz...</p>
                        </div>
                    </div>
                ) : (
                <div className="card">
                    <div className="card-header">
                        <h1 className="card-title">
                            {isEditing ? 'Editar Matriz AMFE' : 'Nueva Matriz AMFE'}
                        </h1>
                        <p className="card-description">
                            Análisis de Modo y Efecto de Fallas para equipos médicos
                        </p>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Información General */}
                        <div className="card mb-4">
                            <h3 className="card-title">Información General</h3>
                            
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">
                                    Nombre de la Matriz *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={matrixData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Ej: Análisis AMFE - Resonancia Magnética"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description" className="form-label">
                                    Descripción *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={matrixData.description}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    placeholder="Describe el propósito y alcance de este análisis AMFE"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="equipment" className="form-label">
                                    Equipo/Proceso Médico *
                                </label>
                                <input
                                    type="text"
                                    id="equipment"
                                    name="equipment"
                                    value={matrixData.data.equipment}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Ej: Resonancia Magnética 3T, Ventilador Mecánico"
                                    required
                                />
                            </div>
                        </div>

                        {/* Análisis de Falla */}
                        <div className="card mb-4">
                            <h3 className="card-title">Análisis de Falla</h3>
                            
                            <div className="form-group">
                                <label htmlFor="function" className="form-label">
                                    Función del Equipo
                                </label>
                                <input
                                    type="text"
                                    id="function"
                                    name="function"
                                    value={matrixData.data.function}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Ej: Proporcionar imágenes de diagnóstico"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="failure_mode" className="form-label">
                                    Modo de Falla
                                </label>
                                <input
                                    type="text"
                                    id="failure_mode"
                                    name="failure_mode"
                                    value={matrixData.data.failure_mode}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Ej: Pérdida de señal, sobrecalentamiento"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="failure_effect" className="form-label">
                                    Efecto de la Falla
                                </label>
                                <textarea
                                    id="failure_effect"
                                    name="failure_effect"
                                    value={matrixData.data.failure_effect}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    placeholder="Ej: Interrupción del procedimiento, riesgo para el paciente"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="failure_cause" className="form-label">
                                    Causa de la Falla
                                </label>
                                <textarea
                                    id="failure_cause"
                                    name="failure_cause"
                                    value={matrixData.data.failure_cause}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    placeholder="Ej: Falta de mantenimiento, uso incorrecto"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="current_controls" className="form-label">
                                    Controles Actuales
                                </label>
                                <textarea
                                    id="current_controls"
                                    name="current_controls"
                                    value={matrixData.data.current_controls}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    placeholder="Ej: Mantenimiento preventivo, alarmas, protocolos"
                                />
                            </div>
                        </div>

                        {/* Evaluación de Riesgo */}
                        <div className="card mb-4">
                            <h3 className="card-title">Evaluación de Riesgo Actual</h3>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div className="form-group">
                                    <label htmlFor="severity" className="form-label">
                                        Severidad (1-5)
                                    </label>
                                    <select
                                        id="severity"
                                        name="severity"
                                        value={matrixData.data.severity}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        {[1,2,3,4,5].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="occurrence" className="form-label">
                                        Ocurrencia (1-5)
                                    </label>
                                    <select
                                        id="occurrence"
                                        name="occurrence"
                                        value={matrixData.data.occurrence}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        {[1,2,3,4,5].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="detection" className="form-label">
                                        Detección (1-5)
                                    </label>
                                    <select
                                        id="detection"
                                        name="detection"
                                        value={matrixData.data.detection}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        {[1,2,3,4,5].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">RPN Actual</label>
                                    <div 
                                        className="form-input" 
                                        style={{ 
                                            background: getRPNColor(matrixData.data.rpn),
                                            color: 'white',
                                            fontWeight: 'bold',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {matrixData.data.rpn} - {getRPNLabel(matrixData.data.rpn)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Plan de Acción */}
                        <div className="card mb-4">
                            <h3 className="card-title">Plan de Acción</h3>
                            
                            <div className="form-group">
                                <label htmlFor="recommended_action" className="form-label">
                                    Acción Recomendada
                                </label>
                                <textarea
                                    id="recommended_action"
                                    name="recommended_action"
                                    value={matrixData.data.recommended_action}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    placeholder="Describe las acciones recomendadas para mitigar o eliminar el riesgo"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                <div className="form-group">
                                    <label htmlFor="responsibility" className="form-label">
                                        Responsable
                                    </label>
                                    <input
                                        type="text"
                                        id="responsibility"
                                        name="responsibility"
                                        value={matrixData.data.responsibility}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Ej: Jefe de Mantenimiento, Ingeniero Biomédico"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="target_date" className="form-label">
                                        Fecha Objetivo
                                    </label>
                                    <input
                                        type="date"
                                        id="target_date"
                                        name="target_date"
                                        value={matrixData.data.target_date}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="action_taken" className="form-label">
                                    Acción Realizada
                                </label>
                                <textarea
                                    id="action_taken"
                                    name="action_taken"
                                    value={matrixData.data.action_taken}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    placeholder="Describe las acciones que se han implementado (completar después de la implementación)"
                                />
                            </div>
                        </div>

                        {/* Evaluación Post-Acción */}
                        <div className="card mb-4">
                            <h3 className="card-title">Evaluación Post-Acción</h3>
                            <p className="text-gray-600 mb-4">
                                Evalúa los riesgos después de implementar las acciones correctivas
                            </p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div className="form-group">
                                    <label htmlFor="new_severity" className="form-label">
                                        Nueva Severidad (1-5)
                                    </label>
                                    <select
                                        id="new_severity"
                                        name="new_severity"
                                        value={matrixData.data.new_severity}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        {[1,2,3,4,5].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="new_occurrence" className="form-label">
                                        Nueva Ocurrencia (1-5)
                                    </label>
                                    <select
                                        id="new_occurrence"
                                        name="new_occurrence"
                                        value={matrixData.data.new_occurrence}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        {[1,2,3,4,5].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="new_detection" className="form-label">
                                        Nueva Detección (1-5)
                                    </label>
                                    <select
                                        id="new_detection"
                                        name="new_detection"
                                        value={matrixData.data.new_detection}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        {[1,2,3,4,5].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Nuevo RPN</label>
                                    <div 
                                        className="form-input" 
                                        style={{ 
                                            background: getRPNColor(matrixData.data.new_rpn),
                                            color: 'white',
                                            fontWeight: 'bold',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {matrixData.data.new_rpn} - {getRPNLabel(matrixData.data.new_rpn)}
                                    </div>
                                </div>
                            </div>

                            {/* Comparación de RPN */}
                            {matrixData.data.rpn !== matrixData.data.new_rpn && (
                                <div className="rpn-comparison">
                                    <h4>Mejora de Riesgo</h4>
                                    <div className="comparison-values">
                                        <span>RPN Inicial: <strong>{matrixData.data.rpn}</strong></span>
                                        <span>→</span>
                                        <span>RPN Final: <strong>{matrixData.data.new_rpn}</strong></span>
                                        <span className={`improvement ${matrixData.data.new_rpn < matrixData.data.rpn ? 'rpn-improvement' : 'rpn-worsening'}`}>
                                            {matrixData.data.new_rpn < matrixData.data.rpn ? 
                                                `Reducción: ${matrixData.data.rpn - matrixData.data.new_rpn} puntos` :
                                                `Aumento: ${matrixData.data.new_rpn - matrixData.data.rpn} puntos`
                                            }
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex justify-between items-center">
                            <button 
                                type="button" 
                                onClick={() => history.push('/matrices')}
                                className="btn btn-secondary"
                            >
                                Cancelar
                            </button>
                            
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner" style={{ width: '1rem', height: '1rem' }}></div>
                                        {isEditing ? 'Actualizando...' : 'Creando...'}
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                            <polyline points="17,21 17,13 7,13 7,21"></polyline>
                                            <polyline points="7,3 7,8 15,8"></polyline>
                                        </svg>
                                        {isEditing ? 'Actualizar Matriz' : 'Crear Matriz'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                )}
            </main>
        </div>
    );
};

export default MatrixForm;
