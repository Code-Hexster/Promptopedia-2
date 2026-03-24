import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Loader2, Heart, MessageSquare, User, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async () => {
        try {
            await axios.put('/notifications/read');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking read:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'like': return <Heart size={20} fill="#ef4444" color="#ef4444" />;
            case 'comment': return <MessageSquare size={20} color="#3b82f6" />;
            case 'follow': return <User size={20} color="#10b981" />;
            default: return <div />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Notifications</h1>
                {notifications.some(n => !n.isRead) && (
                    <button
                        onClick={handleMarkRead}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            padding: '0.5rem 1rem',
                            borderRadius: '99px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                        }}
                    >
                        <Check size={16} /> Mark all read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#888', background: 'white', borderRadius: '16px', border: '1px solid #eee' }}>
                    <p>No notifications yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {notifications.map(notification => (
                        <div
                            key={notification._id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                backgroundColor: notification.isRead ? 'white' : '#f0f9ff',
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: notification.isRead ? '#eee' : '#bae6fd',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                backgroundColor: '#f9fafb', flexShrink: 0
                            }}>
                                {getIcon(notification.type)}
                            </div>

                            <div style={{ flex: 1 }}>
                                <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.95rem', color: '#1f2937' }}>
                                    <Link to={`/user/${notification.fromUser._id}`} style={{ fontWeight: '600', color: '#111', textDecoration: 'none' }}>
                                        {notification.fromUser.username}
                                    </Link>
                                    {' '}
                                    {notification.type === 'like' && `liked your prompt "${notification.promptId?.title || 'Untitled'}"`}
                                    {notification.type === 'comment' && `commented on "${notification.promptId?.title || 'Untitled'}"`}
                                    {notification.type === 'follow' && 'followed you'}
                                </p>
                                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                                    {formatDate(notification.createdAt)}
                                </span>
                            </div>

                            {!notification.isRead && (
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
