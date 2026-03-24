import { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await axios.post('/auth/login', { email, password });
        const newToken = response.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(response.data);
        return response.data;
    };

    const register = async (username, email, password) => {
        const response = await axios.post('/auth/register', { username, email, password });
        const newToken = response.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(response.data);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
