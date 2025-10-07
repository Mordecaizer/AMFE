import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Header from '../Header';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    });
    const { user } = useAuth();

    useEffect(() => {
        if (user?.user?.role === 'admin') {
            loadUsers();
        }
    }, [user]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Error loading users:', err);
            setError('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', newUser);
            setNewUser({ username: '', email: '', password: '', role: 'user' });
            setShowCreateForm(false);
            loadUsers(); // Recargar la lista
            alert('Usuario creado exitosamente');
        } catch (err) {
            console.error('Error creating user:', err);
            setError(err.response?.data?.detail || 'Error al crear usuario');
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (window.confirm(`¿Estás seguro de eliminar al usuario ${username}?`)) {
            try {
                await api.delete(`/users/${userId}`);
                loadUsers(); // Recargar la lista
                alert('Usuario eliminado exitosamente');
            } catch (err) {
                console.error('Error deleting user:', err);
                setError(err.response?.data?.detail || 'Error al eliminar usuario');
            }
        }
    };

    if (user?.user?.role !== 'admin') {
        return (
            <div className="access-denied">
                <h2>Acceso Denegado</h2>
                <p>No tienes permisos para acceder a esta página.</p>
            </div>
        );
    }

    if (loading) {
        return <div className="loading">Cargando usuarios...</div>;
    }

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="admin-panel">
                    <div className="admin-header">
                        <div className="admin-title-section">
                            <Link to="/matrices" className="btn btn-secondary">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="15,18 9,12 15,6"></polyline>
                                </svg>
                                Volver a Matrices
                            </Link>
                            <h2>Panel de Administración</h2>
                        </div>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowCreateForm(!showCreateForm)}
                        >
                            {showCreateForm ? 'Cancelar' : 'Crear Usuario'}
                        </button>
                    </div>

            {error && <div className="error-message">{error}</div>}

            {showCreateForm && (
                <div className="create-user-form">
                    <h3>Crear Nuevo Usuario</h3>
                    <form onSubmit={handleCreateUser}>
                        <div className="form-group">
                            <label>Nombre de Usuario:</label>
                            <input
                                type="text"
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña:</label>
                            <input
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Rol:</label>
                            <select
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="user">Usuario</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                Crear Usuario
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => setShowCreateForm(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="users-table">
                <h3>Usuarios del Sistema</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(userData => (
                            <tr key={userData.id}>
                                <td>{userData.id}</td>
                                <td>{userData.username}</td>
                                <td>{userData.email}</td>
                                <td>
                                    <span className={`role-badge ${userData.role}`}>
                                        {userData.role === 'admin' ? 'Administrador' : 'Usuario'}
                                    </span>
                                </td>
                                <td>
                                    {userData.id !== user?.user?.id && (
                                        <button
                                            className="btn btn-danger btn-small"
                                            onClick={() => handleDeleteUser(userData.id, userData.username)}
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                    {userData.id === user?.user?.id && (
                                        <span className="current-user">Usuario actual</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
