import api from './axios';

// 🔐 Register new user
export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Registration failed. Please try again.';
    }
};

// 🔐 Login user
export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Login failed. Please check your credentials.';
    }
};
