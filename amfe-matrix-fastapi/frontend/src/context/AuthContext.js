import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, login, logout, register } from '../services/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = getCurrentUser();
            console.log('🔍 AuthContext - Usuario cargado:', currentUser);
            setUser(currentUser);
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleLogin = async (credentials) => {
        const userData = await login(credentials.username, credentials.password);
        setUser(userData);
    };

    const handleRegister = async (userData) => {
        await register(userData.username, userData.email, userData.password);
        const newUser = await login(userData.username, userData.password);
        setUser(newUser);
    };

    const handleLogout = () => {
        logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser,
            loading, 
            login: handleLogin, 
            register: handleRegister, 
            logout: handleLogout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);