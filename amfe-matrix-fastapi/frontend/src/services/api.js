import axios from 'axios';

// Use environment variable or fallback to localhost:8000
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add JWT token to requests
api.interceptors.request.use((config) => {
    const userData = localStorage.getItem('user');
    if (userData) {
        const user = JSON.parse(userData);
        if (user.token) {
            config.headers['Authorization'] = `Bearer ${user.token}`;
            console.log('🔑 Token agregado a request:', user.token.substring(0, 20) + '...');
        } else {
            console.log('⚠️ No hay token en userData');
        }
    } else {
        console.log('⚠️ No hay userData en localStorage');
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log('🚫 Token expirado o inválido, redirigiendo a login...');
            // Remove invalid token
            localStorage.removeItem('user');
            // Redirect to login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Function to get all AMFE matrices
export const getMatrices = async () => {
    const response = await api.get('/matrices');
    return response.data;
};

// Function to create a new AMFE matrix
export const createMatrix = async (matrixData) => {
    const response = await api.post('/matrices', matrixData);
    return response.data;
};

// Function to edit an existing AMFE matrix
export const editMatrix = async (id, matrixData) => {
    const response = await api.put(`/matrices/${id}`, matrixData);
    return response.data;
};

// Function to delete an AMFE matrix
export const deleteMatrix = async (id) => {
    const response = await api.delete(`/matrices/${id}`);
    return response.data;
};

// Function to download an AMFE matrix as an Excel file
export const downloadMatrixExcel = async (id, filename) => {
    const response = await api.get(`/matrices/${id}/export`, { responseType: 'blob' });
    
    // Crear un link temporal para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename || `AMFE_Matrix_${id}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
};

// Function to get a specific matrix by ID
export const getMatrix = async (id) => {
    const response = await api.get(`/matrices/${id}`);
    return response.data;
};

// ========================================
// MATRICES MODULARES
// ========================================

// Function to create a new modular AMFE matrix
export const createModularMatrix = async (matrixData) => {
    const response = await api.post('/matrices/modular', matrixData);
    return response.data;
};

// Function to get a specific modular matrix by ID
export const getModularMatrix = async (id) => {
    const response = await api.get(`/matrices/modular/${id}`);
    return response.data;
};

// Function to edit an existing modular AMFE matrix
export const editModularMatrix = async (id, matrixData) => {
    const response = await api.put(`/matrices/modular/${id}`, matrixData);
    return response.data;
};

// Function to download a modular AMFE matrix as an Excel file
export const downloadModularMatrixExcel = async (id, filename) => {
    const response = await api.get(`/matrices/modular/${id}/export`, { responseType: 'blob' });
    
    // Crear un link temporal para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename || `AMFE_Modular_Matrix_${id}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
};

export default api;