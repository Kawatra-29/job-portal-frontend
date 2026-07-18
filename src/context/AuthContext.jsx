/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';

export const AuthContext = createContext();

function isTokenExpired(token) {
    if (!token) return true;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const { exp } = JSON.parse(jsonPayload);
        if (exp && Date.now() >= exp * 1000) {
            return true;
        }
        return false;
    } catch {
        return true;
    }
}

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem('token');
        if (token && isTokenExpired(token)) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            return { token: null, role: null, isAuthenticated: false };
        }
        return {
            token: localStorage.getItem('token'),
            role: localStorage.getItem('role'),
            isAuthenticated: !!localStorage.getItem('token')
        };
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