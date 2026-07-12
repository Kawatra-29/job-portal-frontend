import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role'),
        isAuthenticated: false
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (token) {
            setAuth({
                token,
                role,
                isAuthenticated: true
            });
        }
    }, []);

    const login = (token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        setAuth({
            token,
            role,
            isAuthenticated: true
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');

        setAuth({
            token: null,
            role: null,
            isAuthenticated: false
        });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};