import { useState, useEffect, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Send, Check, CheckCheck } from 'lucide-react';
import { io } from 'socket.io-client';
import UserAvatar from '../components/ui/UserAvatar';

export default function Messages() {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(location.state?.selectedUser || null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socket = useRef();
    const messagesEndRef = useRef(null);
    useEffect(() => {
        // Connect to the correct backend port (5001) instead of 5000
        socket.current = io('http://localhost:5001');

        socket.current.on('getMessage', (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
                seen: false
            });
        });

        socket.current.on('getUsers', (users) => {
            setOnlineUsers(users);
        });

        socket.current.on('messageSeen', ({ receiverId }) => {
            setMessages(prev => prev.map(msg =>
                (msg.sender._id === user._id || msg.sender === user._id) ? { ...msg, seen: true } : msg
            ));
        });
    }, []);

    useEffect(() => {
        arrivalMessage &&
            selectedUser &&
            arrivalMessage.sender === selectedUser._id &&
            setMessages((prev) => [...prev, arrivalMessage]);

        if (arrivalMessage && selectedUser && arrivalMessage.sender === selectedUser._id) {
            socket.current.emit('markSeen', {
                senderId: selectedUser._id,
                receiverId: user._id
            });
            axios.put(`/messages/seen/${selectedUser._id}`);
        }
    }, [arrivalMessage, selectedUser]);

    useEffect(() => {
        socket.current.emit('addUser', user._id);
    }, [user]);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser._id);
            markAsSeen(selectedUser._id);
        }
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const markAsSeen = async (senderId) => {
        try {
            await axios.put(`/messages/seen/${senderId}`);
            socket.current.emit('markSeen', {
                senderId: senderId,
                receiverId: user._id
            });
        } catch (error) {
            console.error('Error marking seen:', error);
        }
    };

    const fetchConversations = async () => {
        try {
            const response = await axios.get('/messages/conversations');
            let convs = response.data;

            // If we came from a profile with a selected user, make sure they are in the list
            if (location.state?.selectedUser) {
                const alreadyExists = convs.find(c => c._id === location.state.selectedUser._id);
                if (!alreadyExists) {
                    convs = [location.state.selectedUser, ...convs];
                }
            }

            setConversations(convs);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const response = await axios.get(`/messages/${userId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        socket.current.emit('sendMessage', {
            senderId: user._id,
            receiverId: selectedUser._id,
            text: newMessage,
        });

        try {
            const response = await axios.post(`/messages/send/${selectedUser._id}`, { text: newMessage });
            setMessages([...messages, response.data]);
            setNewMessage('');

            if (!conversations.find(c => c._id === selectedUser._id)) {
                setConversations([selectedUser, ...conversations]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const isUserOnline = (userId) => {
        return onlineUsers.some(u => u.userId === userId);
    };

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 40px)', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            {/* Conversations List */}
            <div style={{ width: '320px', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Messages</h2>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {conversations.length === 0 ? (
                        <p style={{ padding: '1.5rem', color: '#888', textAlign: 'center' }}>No conversations yet.</p>
                    ) : (
                        conversations.map(conv => (
                            <div
                                key={conv._id}
                                onClick={() => setSelectedUser(conv)}
                                style={{
                                    padding: '1rem 1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    cursor: 'pointer',
                                    backgroundColor: selectedUser?._id === conv._id ? '#f3f4f6' : 'transparent',
                                    borderBottom: '1px solid #f9fafb'
                                }}
                            >
                                <div style={{ position: 'relative' }}>
                                    <UserAvatar user={conv} size="40px" />
                                    {isUserOnline(conv._id) && (
                                        <div style={{
                                            position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px',
                                            backgroundColor: '#10b981', borderRadius: '50%', border: '2px solid white'
                                        }} />
                                    )}
                                </div>
                                <span style={{ fontWeight: 600, color: '#1f2937' }}>{conv.username}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedUser ? (
                    <>
                        <div style={{ padding: '1rem 2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ position: 'relative' }}>
                                <UserAvatar user={selectedUser} size="36px" />
                                {isUserOnline(selectedUser._id) && (
                                    <div style={{
                                        position: 'absolute', bottom: 0, right: 0, width: '9px', height: '9px',
                                        backgroundColor: '#10b981', borderRadius: '50%', border: '1.5px solid white'
                                    }} />
                                )}
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedUser.username}</h3>
                                {isUserOnline(selectedUser._id) && <span style={{ fontSize: '0.8rem', color: '#10b981' }}>Online</span>}
                            </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {messages.map(msg => {
                                const isMe = msg.sender._id === user._id || msg.sender === user._id; // populate vs id logic
                                return (
                                    <div
                                        key={msg._id || msg.createdAt}
                                        style={{
                                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                                            maxWidth: '70%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: isMe ? 'flex-end' : 'flex-start'
                                        }}
                                    >
                                        <div style={{
                                            backgroundColor: isMe ? '#1a1a1a' : '#f3f4f6',
                                            color: isMe ? 'white' : '#1f2937',
                                            padding: '0.8rem 1.2rem',
                                            borderRadius: '16px',
                                            borderBottomRightRadius: isMe ? '4px' : '16px',
                                            borderBottomLeftRadius: isMe ? '16px' : '4px',
                                            lineHeight: 1.5,
                                            position: 'relative'
                                        }}>
                                            {msg.text}
                                        </div>
                                        {isMe && (
                                            <div style={{ marginTop: '4px', marginRight: '4px' }}>
                                                {msg.seen ? (
                                                    <CheckCheck size={14} color="#3b82f6" />
                                                ) : (
                                                    <Check size={14} color="#9ca3af" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} style={{ padding: '1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.75rem' }}>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                style={{
                                    flex: 1,
                                    padding: '0.8rem 1.2rem',
                                    borderRadius: '99px',
                                    border: '1px solid #e5e7eb',
                                    outline: 'none',
                                    fontSize: '0.95rem'
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                style={{
                                    backgroundColor: '#1a1a1a',
                                    color: 'white',
                                    border: 'none',
                                    width: '46px',
                                    height: '46px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    opacity: !newMessage.trim() ? 0.5 : 1,
                                    transition: 'opacity 0.2s'
                                }}
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#9ca3af', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Send size={32} color="#9ca3af" />
                        </div>
                        <p>Select a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}
