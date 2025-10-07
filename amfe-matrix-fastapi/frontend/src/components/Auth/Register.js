import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { register } from '../../services/auth';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const history = useHistory();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar mensajes al cambiar los campos
        if (error) setError('');
        if (success) setSuccess('');
    };

    const validateForm = () => {
        if (!formData.username.trim()) {
            setError('El nombre de usuario es requerido');
            return false;
        }

        if (!formData.email.trim()) {
            setError('El email es requerido');
            return false;
        }

        if (!formData.email.includes('@')) {
            setError('Por favor ingrese un email válido');
            return false;
        }

        if (!formData.password.trim()) {
            setError('La contraseña es requerida');
            return false;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const userData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            };

            const response = await register(userData);
            console.log('Register response:', response);
            
            if (response) {
                setSuccess('Usuario registrado exitosamente. Redirigiendo al login...');
                setTimeout(() => {
                    history.push('/login');
                }, 2000);
            }
        } catch (err) {
            console.error('Error en registro:', err);
            setError('Error al registrar usuario. El usuario o email ya puede existir.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">
                    <h1>AMFE Matrix</h1>
                    <p>Crear Nueva Cuenta</p>
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

                {success && (
                    <div className="alert alert-success">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 11l3 3l8-8"></path>
                            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9c1.51 0 2.93.37 4.18 1.03"></path>
                        </svg>
                        {success}
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
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Ingrese su email"
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

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Confirme su contraseña"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role" className="form-label">
                            Rol
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="user">Usuario</option>
                            <option value="admin">Administrador</option>
                        </select>
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
                                Registrando...
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="8.5" cy="7" r="4"></circle>
                                    <line x1="20" y1="8" x2="20" y2="14"></line>
                                    <line x1="23" y1="11" x2="17" y2="11"></line>
                                </svg>
                                Crear Cuenta
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                        ¿Ya tienes una cuenta?{' '}
                        <a 
                            href="/login" 
                            className="font-semibold"
                            style={{ color: 'var(--primary-color)' }}
                        >
                            Iniciar Sesión
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;