import axios from 'axios';

// Use environment variable or fallback to localhost:8000
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
};

export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
    });
    
    // La respuesta ahora tiene access_token, token_type y user
    if (response.data.access_token) {
        // Guardar tanto el token como los datos del usuario
        const userData = {
            token: response.data.access_token,
            user: response.data.user
        };
        localStorage.setItem('user', JSON.stringify(userData));
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

export const isLoggedIn = () => {
    const user = getCurrentUser();
    return user && user.token ? true : false;
};