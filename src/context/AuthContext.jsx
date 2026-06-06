import { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        if(storedToken) {
            axios.get('/auth/me', {
                headers: { Authorization: `Bearer ${storedToken}`}
            })
            .then((res) => {
                setToken(storedToken);
                setUser(res.data);
                setLoading(false);
            })
            .catch(() => {
                localStorage.removeItem('token');
                setLoading(false)
            })
        } else {
            setLoading(false);
        }
    }, []);

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

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context;
}

export function getToken() {                                                                           
    return localStorage.getItem('token')
  }