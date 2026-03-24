import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreatePrompt from './pages/CreatePrompt';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Following from './pages/Following';

export default function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

                        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                            <Route index element={<Home />} />
                            <Route path="create" element={<CreatePrompt />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="profile/:id" element={<Profile />} />
                            <Route path="messages" element={<Messages />} />
                            <Route path="notifications" element={<Notifications />} />
                            <Route path="following" element={<Following />} />
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
        </ToastProvider>
    );
}
