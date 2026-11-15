/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        role: null,
        isAuthenticated: false,
        loading: true
    });

    const logout = useCallback(async () => {
        try {
            await apiClient.post("/auth/logout", {});
        } catch {
            // Ignore logout API error if network fails
        } finally {
            localStorage.removeItem("token");
            setAuth({
                user: null,
                role: null,
                isAuthenticated: false,
                loading: false
            });
        }
    }, []);

    useEffect(() => {
        let active = true;
        const checkAuthStatus = async () => {
            try {
                const res = await apiClient.get("/users/me");
                if (active && res.data) {
                    const user = res.data;
                    setAuth({
                        user,
                        role: user.role,
                        isAuthenticated: true,
                        loading: false
                    });
                }
            } catch {
                if (active) {
                    setAuth({
                        user: null,
                        role: null,
                        isAuthenticated: false,
                        loading: false
                    });
                }
            }
        };

        checkAuthStatus();

        const handleUnauthorized = () => {
            logout();
        };
        window.addEventListener("unauthorized", handleUnauthorized);

        return () => {
            active = false;
            window.removeEventListener("unauthorized", handleUnauthorized);
        };
    }, [logout]);

    const login = (roleParam, tokenParam, userParam) => {
        let role = typeof roleParam === 'string' ? roleParam : roleParam?.role;
        let token = tokenParam || (typeof roleParam === 'object' ? roleParam?.token : null);
        let user = typeof roleParam === 'object' && !tokenParam ? roleParam : userParam || null;

        if (token) {
            localStorage.setItem("token", token);
        }

        setAuth({
            user,
            role,
            isAuthenticated: true,
            loading: false
        });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
