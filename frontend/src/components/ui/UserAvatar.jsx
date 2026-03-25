import React from 'react';
import './UserAvatar.css';

const getGradient = (username) => {
    return '#e0e0e0';
};

export default function UserAvatar({ user, size = '40px', style = {}, className = '' }) {
    if (!user) return null;

    const avatarSize = {
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        fontSize: `calc(${size} * 0.4)`
    };

    if (user.avatar) {
        return (
            <img
                src={user.avatar}
                alt={user.username || 'User'}
                className={`user-avatar ${className}`}
                style={{ ...avatarSize, ...style }}
            />
        );
    }

    const username = user.username || 'U';
    const initial = username.charAt(0).toUpperCase();
    const background = getGradient(username);

    return (
        <div
            className={`user-avatar-initial ${className}`}
            style={{
                ...avatarSize,
                background,
                ...style
            }}
        >
            {initial}
        </div>
    );
}
