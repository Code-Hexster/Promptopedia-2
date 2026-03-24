import { Link } from 'react-router-dom';
import './FollowListModal.css';

export default function FollowListModal({ title, users, onClose }) {
    return (
        <div className="follow-modal-overlay" onClick={onClose}>
            <div className="follow-modal-content" onClick={e => e.stopPropagation()}>
                <div className="follow-modal-header">
                    <h2>{title}</h2>
                    <button className="close-modal-btn" onClick={onClose}>×</button>
                </div>

                <div className="user-list">
                    {users.length > 0 ? (
                        users.map(user => (
                            <Link
                                key={user._id}
                                to={`/profile/${user._id}`}
                                className="user-item-link"
                                onClick={onClose}
                            >
                                <div className="user-item-avatar">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.username} />
                                    ) : (
                                        user.username.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="user-item-info">
                                    <span className="user-item-username">{user.username}</span>
                                    {user.bio && <span className="user-item-bio">{user.bio}</span>}
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="empty-list-msg">No users found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
