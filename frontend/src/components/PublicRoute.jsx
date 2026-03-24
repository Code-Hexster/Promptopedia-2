import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PublicRoute = ({ children }) => {
    const { token, loading } = useContext(AuthContext);

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Public Route...</div>;
    }

    return token ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
