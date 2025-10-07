import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const history = useHistory();

    const handleLogout = () => {
        if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
            logout();
            history.push('/login');
        }
    };

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img 
                        src="/club.jpg" 
                        alt="Club Noel Logo" 
                        style={{ 
                            width: '32px', 
                            height: '32px', 
                            objectFit: 'contain',
                            borderRadius: '4px'
                        }} 
                    />
                    <span>CLUB NOEL</span>
                </Link>
                <nav>
                    <ul className="nav-links">
                        <li><Link to="/matrices">Matrices</Link></li>
                        {user?.user?.role === 'admin' && (
                            <li><Link to="/admin">Administración</Link></li>
                        )}
                    </ul>
                </nav>
                <div className="user-info">
                    <div className="user-details">
                        <div className="user-avatar">
                            {user?.user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="username">{user?.user?.username || 'Usuario'}</span>
                        {user?.user?.role === 'admin' && (
                            <span className="user-role">Admin</span>
                        )}
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="btn btn-logout"
                        title="Cerrar sesión"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16,17 21,12 16,7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Salir
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
