import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { getMatrices } from '../../services/api';
import axios from 'axios';
import Header from '../Header';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const MatrixDetail = () => {
    const { id } = useParams();
    const history = useHistory();
    const [matrix, setMatrix] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatrix = async () => {
            try {
                console.log('MatrixDetail - ID recibido:', id); // Debug log
                
                // Crear headers con token si existe
                const userData = localStorage.getItem('user');
                let headers = { 'Content-Type': 'application/json' };
                if (userData) {
                    const user = JSON.parse(userData);
                    if (user.token) {
                        headers['Authorization'] = `Bearer ${user.token}`;
                    }
                }
                
                const response = await axios.get(`${API_URL}/matrices/${id}`, { headers });
                setMatrix(response.data);
            } catch (err) {
                console.error('Error fetching matrix:', err); // Debug log
                setError('Error fetching matrix details');
            } finally {
                setLoading(false);
            }
        };

        if (id && id !== 'edit' && id !== 'new' && !isNaN(Number(id))) {
            fetchMatrix();
        } else {
            console.log('ID no válido o es una ruta especial:', id); // Debug
            setError('ID de matriz no válido');
            setLoading(false);
        }
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this matrix?')) {
            try {
                // Crear headers con token si existe
                const userData = localStorage.getItem('user');
                let headers = { 'Content-Type': 'application/json' };
                if (userData) {
                    const user = JSON.parse(userData);
                    if (user.token) {
                        headers['Authorization'] = `Bearer ${user.token}`;
                    }
                }
                
                await axios.delete(`${API_URL}/matrices/${id}`, { headers });
                history.push('/matrices');
            } catch (err) {
                setError('Error deleting matrix');
            }
        }
    };

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

    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada';
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    if (loading) return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="card">
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Cargando detalles de la matriz...</p>
                    </div>
                </div>
            </main>
        </div>
    );
    
    if (error) return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="card">
                    <div className="alert alert-error">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        {error}
                    </div>
                </div>
            </main>
        </div>
    );

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="card">
                    <div className="card-header">
                        <div>
                            <h1 className="card-title">{matrix?.name}</h1>
                            <p className="card-description">{matrix?.description}</p>
                        </div>
                        <div className="card-actions">
                            <button 
                                className="btn btn-secondary"
                                onClick={() => history.push(`/matrices/${id}/edit`)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Editar
                            </button>
                            <button 
                                className="btn btn-danger"
                                onClick={handleDelete}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3,6 5,6 21,6"></polyline>
                                    <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                                </svg>
                                Eliminar
                            </button>
                        </div>
                    </div>

                    {/* Información General */}
                    <div className="card mb-4">
                        <h3 className="card-title">Información General</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                            <div>
                                <strong>Equipo/Proceso:</strong>
                                <p>{matrix?.data?.equipment || 'No especificado'}</p>
                            </div>
                            <div>
                                <strong>Función:</strong>
                                <p>{matrix?.data?.function || 'No especificada'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Análisis de Falla */}
                    <div className="card mb-4">
                        <h3 className="card-title">Análisis de Falla</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <strong>Modo de Falla:</strong>
                                <p>{matrix?.data?.failure_mode || 'No especificado'}</p>
                            </div>
                            <div>
                                <strong>Efecto de la Falla:</strong>
                                <p>{matrix?.data?.failure_effect || 'No especificado'}</p>
                            </div>
                            <div>
                                <strong>Causa de la Falla:</strong>
                                <p>{matrix?.data?.failure_cause || 'No especificada'}</p>
                            </div>
                            <div>
                                <strong>Controles Actuales:</strong>
                                <p>{matrix?.data?.current_controls || 'No especificados'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Evaluación de Riesgo Actual */}
                    <div className="card mb-4">
                        <h3 className="card-title">Evaluación de Riesgo Actual</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                            <div className="text-center">
                                <strong>Severidad</strong>
                                <div className="form-input" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                                    {matrix?.data?.severity || 1}
                                </div>
                            </div>
                            <div className="text-center">
                                <strong>Ocurrencia</strong>
                                <div className="form-input" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                                    {matrix?.data?.occurrence || 1}
                                </div>
                            </div>
                            <div className="text-center">
                                <strong>Detección</strong>
                                <div className="form-input" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                                    {matrix?.data?.detection || 1}
                                </div>
                            </div>
                            <div className="text-center">
                                <strong>RPN Actual</strong>
                                <div 
                                    className="form-input" 
                                    style={{ 
                                        marginTop: '0.5rem',
                                        background: getRPNColor(matrix?.data?.rpn || 1),
                                        color: 'white',
                                        fontWeight: 'bold',
                                        textAlign: 'center'
                                    }}
                                >
                                    {matrix?.data?.rpn || 1} - {getRPNLabel(matrix?.data?.rpn || 1)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Plan de Acción */}
                    <div className="card mb-4">
                        <h3 className="card-title">Plan de Acción</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <strong>Acción Recomendada:</strong>
                                <p>{matrix?.data?.recommended_action || 'No especificada'}</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <strong>Responsable:</strong>
                                    <p>{matrix?.data?.responsibility || 'No asignado'}</p>
                                </div>
                                <div>
                                    <strong>Fecha Objetivo:</strong>
                                    <p>{formatDate(matrix?.data?.target_date)}</p>
                                </div>
                            </div>
                            <div>
                                <strong>Acción Realizada:</strong>
                                <p>{matrix?.data?.action_taken || 'Pendiente'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Evaluación Post-Acción */}
                    <div className="card mb-4">
                        <h3 className="card-title">Evaluación Post-Acción</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                            <div className="text-center">
                                <strong>Nueva Severidad</strong>
                                <div className="form-input" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                                    {matrix?.data?.new_severity || 1}
                                </div>
                            </div>
                            <div className="text-center">
                                <strong>Nueva Ocurrencia</strong>
                                <div className="form-input" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                                    {matrix?.data?.new_occurrence || 1}
                                </div>
                            </div>
                            <div className="text-center">
                                <strong>Nueva Detección</strong>
                                <div className="form-input" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                                    {matrix?.data?.new_detection || 1}
                                </div>
                            </div>
                            <div className="text-center">
                                <strong>Nuevo RPN</strong>
                                <div 
                                    className="form-input" 
                                    style={{ 
                                        marginTop: '0.5rem',
                                        background: getRPNColor(matrix?.data?.new_rpn || 1),
                                        color: 'white',
                                        fontWeight: 'bold',
                                        textAlign: 'center'
                                    }}
                                >
                                    {matrix?.data?.new_rpn || 1} - {getRPNLabel(matrix?.data?.new_rpn || 1)}
                                </div>
                            </div>
                        </div>

                        {/* Comparación de RPN */}
                        {matrix?.data?.rpn !== matrix?.data?.new_rpn && (
                            <div className="rpn-comparison">
                                <h4>Mejora de Riesgo</h4>
                                <div className="comparison-values">
                                    <span>RPN Inicial: <strong>{matrix?.data?.rpn}</strong></span>
                                    <span>→</span>
                                    <span>RPN Final: <strong>{matrix?.data?.new_rpn}</strong></span>
                                    <span className={`improvement ${matrix?.data?.new_rpn < matrix?.data?.rpn ? 'rpn-improvement' : 'rpn-worsening'}`}>
                                        {matrix?.data?.new_rpn < matrix?.data?.rpn ? 
                                            `Reducción: ${matrix?.data?.rpn - matrix?.data?.new_rpn} puntos` :
                                            `Aumento: ${matrix?.data?.new_rpn - matrix?.data?.rpn} puntos`
                                        }
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Metadatos */}
                    <div className="card">
                        <h3 className="card-title">Información del Registro</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div>
                                <strong>Creado:</strong>
                                <p>{formatDate(matrix?.created_at)}</p>
                            </div>
                            <div>
                                <strong>Última actualización:</strong>
                                <p>{formatDate(matrix?.updated_at)}</p>
                            </div>
                            <div>
                                <strong>ID:</strong>
                                <p>{matrix?.id}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <button 
                            className="btn btn-secondary"
                            onClick={() => history.push('/matrices')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5"></path>
                                <path d="M12 19l-7-7 7-7"></path>
                            </svg>
                            Volver a la Lista
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MatrixDetail;