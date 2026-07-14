/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role'),
        isAuthenticated: !!localStorage.getItem('token')
    });

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