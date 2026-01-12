import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar si hay un usuario en localStorage al cargar la app
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setIsAuthenticated(true);
            } catch (error) {
                // Si hay error, limpiar todo
                console.error('Error al cargar usuario:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (userData, token) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('token', token);
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                login,
                logout,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};