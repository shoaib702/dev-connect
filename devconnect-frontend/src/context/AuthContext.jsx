import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/userApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Load user on mount if token exists
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const userData = await getMe();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to load user:', error);
                    // Token might be invalid, clear it
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setLoading(false);
        };

        loadUser();
    }, [token]);

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
