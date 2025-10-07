import React, { useState, useContext, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { login } from '../../services/auth';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setUser, user } = useContext(AuthContext);
    const history = useHistory();
    const isMountedRef = useRef(true);

    useEffect(() => {
        // Redirigir si ya está autenticado
        if (user?.token) {
            history.push('/matrices');
        }
        
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (!isMountedRef.current) return;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error al cambiar los campos
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isMountedRef.current) return;
        
        setLoading(true);
        setError('');

        try {
            if (!formData.username.trim() || !formData.password.trim()) {
                if (isMountedRef.current) {
                    setError('Por favor complete todos los campos');
                }
                return;
            }

            const response = await login(formData.username, formData.password);
            console.log('Login response:', response); // Debug
            
            if (!isMountedRef.current) return;
            
            if (response && response.access_token) {
                // Guardar usuario en el contexto
                setUser({
                    token: response.access_token,
                    user: response.user
                });
                
                // Redirigir a la lista de matrices
                history.push('/matrices');
            } else {
                setError('Credenciales inválidas');
            }
        } catch (err) {
            console.error('Error en login:', err);
            if (isMountedRef.current) {
                setError('Error de conexión. Verifique sus credenciales.');
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">
                    <h1>CLUB NOEL</h1>
                    <p>Sistema de Gestión de Matrices AMFE</p>
                    <div style={{ 
                        width: '40px', 
                        height: '2px', 
                        background: 'var(--primary-color)', 
                        margin: '1rem auto' 
                    }}></div>
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
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">
                            Usuario
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Ingrese su usuario"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Ingrese su contraseña"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: '1rem', height: '1rem' }}></div>
                                Iniciando sesión...
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                    <polyline points="10,17 15,12 10,7"></polyline>
                                    <line x1="15" y1="12" x2="3" y2="12"></line>
                                </svg>
                                Iniciar Sesión
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;