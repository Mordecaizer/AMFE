import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getMatrices, deleteMatrix } from '../../services/api';
import Header from '../Header';

const MatrixList = () => {
    const { user } = useContext(AuthContext);
    const [matrices, setMatrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        fetchMatrices();
        
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const fetchMatrices = async () => {
        try {
            if (isMountedRef.current) {
                setLoading(true);
            }
            const data = await getMatrices();
            if (isMountedRef.current) {
                setMatrices(data);
            }
        } catch (err) {
            console.error('Error fetching matrices:', err);
            if (isMountedRef.current) {
                setError('Error al cargar las matrices');
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };

    const handleDelete = async (id) => {
        if (!isMountedRef.current) return;
        
        if (deleteConfirm === id) {
            try {
                await deleteMatrix(id);
                if (isMountedRef.current) {
                    setMatrices(matrices.filter(matrix => matrix.id !== id));
                    setDeleteConfirm(null);
                }
            } catch (err) {
                console.error('Error deleting matrix:', err);
                if (isMountedRef.current) {
                    setError('Error al eliminar la matriz');
                }
            }
        } else {
            setDeleteConfirm(id);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRPNColor = (rpn) => {
        if (rpn >= 200) return '#dc3545'; // Crítico - Rojo
        if (rpn >= 100) return '#fd7e14'; // Alto - Naranja
        if (rpn >= 50) return '#ffc107';  // Medio - Amarillo
        return '#28a745'; // Bajo - Verde
    };

    const getRPNLabel = (rpn) => {
        if (rpn >= 200) return 'Crítico';
        if (rpn >= 100) return 'Alto';
        if (rpn >= 50) return 'Medio';
        return 'Bajo';
    };

    if (loading) {
        return (
            <div className="main-content">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Cargando matrices...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <Header />

            <main className="main-content">
                <div className="card">
                    <div className="card-header">
                        <h1 className="card-title">Matrices AMFE</h1>
                        <p className="card-description">
                            Gestiona tus matrices de Análisis de Modo y Efecto de Fallas
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

                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-semibold">
                                Total: {matrices.length} matrices
                            </h2>
                        </div>
                        <Link to="/matrices/new" className="btn btn-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Nueva Matriz
                        </Link>
                    </div>

                    {matrices.length === 0 ? (
                        <div className="text-center" style={{ padding: '3rem' }}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 1rem', color: 'var(--gray-400)' }}>
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10,9 9,9 8,9"></polyline>
                            </svg>
                            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--gray-600)' }}>
                                No hay matrices
                            </h3>
                            <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>
                                Comienza creando tu primera matriz AMFE
                            </p>
                            <Link to="/matrices/new" className="btn btn-primary">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Crear Primera Matriz
                            </Link>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Equipo/Proceso</th>
                                        <th>RPN Actual</th>
                                        <th>Estado</th>
                                        <th>Actualizado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matrices.map(matrix => (
                                        <tr key={matrix.id}>
                                            <td>
                                                <span className="font-semibold" style={{ color: 'var(--primary-color)' }}>
                                                    #{matrix.id}
                                                </span>
                                            </td>
                                            <td>
                                                <div>
                                                    <div className="font-semibold">
                                                        {matrix.name}
                                                    </div>
                                                    <div className="text-sm" style={{ color: 'var(--gray-600)' }}>
                                                        {matrix.description || 'Sin descripción'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-sm" style={{ fontWeight: '500' }}>
                                                    {matrix.data?.equipment || 'No especificado'}
                                                </div>
                                            </td>
                                            <td>
                                                <span 
                                                    className="rpn-badge"
                                                    style={{ 
                                                        background: getRPNColor(matrix.data?.rpn || 1),
                                                        color: 'white',
                                                        padding: '4px 8px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {matrix.data?.rpn || 1} - {getRPNLabel(matrix.data?.rpn || 1)}
                                                </span>
                                            </td>
                                            <td>
                                                <div>
                                                    {matrix.data?.action_taken ? (
                                                        <span style={{ 
                                                            background: '#d4edda',
                                                            color: '#155724',
                                                            padding: '3px 8px',
                                                            borderRadius: '12px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '500'
                                                        }}>
                                                            Acción Implementada
                                                        </span>
                                                    ) : matrix.data?.recommended_action ? (
                                                        <span style={{ 
                                                            background: '#fff3cd',
                                                            color: '#856404',
                                                            padding: '3px 8px',
                                                            borderRadius: '12px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '500'
                                                        }}>
                                                            Acción Planificada
                                                        </span>
                                                    ) : (
                                                        <span style={{ 
                                                            background: '#f8d7da',
                                                            color: '#721c24',
                                                            padding: '3px 8px',
                                                            borderRadius: '12px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '500'
                                                        }}>
                                                            Análisis Inicial
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-sm" style={{ color: 'var(--gray-600)' }}>
                                                    {formatDate(matrix.updated_at)}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <Link 
                                                        to={`/matrices/${matrix.id}`} 
                                                        className="btn btn-sm btn-secondary"
                                                        title="Ver detalles"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                            <circle cx="12" cy="12" r="3"></circle>
                                                        </svg>
                                                    </Link>
                                                    <Link 
                                                        to={`/matrices/${matrix.id}/edit`} 
                                                        className="btn btn-sm btn-secondary"
                                                        title="Editar"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                        </svg>
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(matrix.id)}
                                                        className={`btn btn-sm ${deleteConfirm === matrix.id ? 'btn-danger' : 'btn-secondary'}`}
                                                        title={deleteConfirm === matrix.id ? 'Confirmar eliminación' : 'Eliminar'}
                                                    >
                                                        {deleteConfirm === matrix.id ? (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M9 11l3 3l8-8"></path>
                                                                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9c1.51 0 2.93.37 4.18 1.03"></path>
                                                            </svg>
                                                        ) : (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <polyline points="3,6 5,6 21,6"></polyline>
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MatrixList;