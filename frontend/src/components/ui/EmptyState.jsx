import React from 'react';
import { Link } from 'react-router-dom';
import { Search, FolderOpen, PlusCircle } from 'lucide-react';
import './EmptyState.css';

export default function EmptyState({
    icon = 'FolderOpen',
    title = 'No Data Found',
    description = 'There is nothing to show here right now.',
    actionLink = null,
    actionText = 'Create New'
}) {
    const getIcon = () => {
        switch (icon) {
            case 'Search': return <Search size={48} color="#9ca3af" />;
            case 'PlusCircle': return <PlusCircle size={48} color="#9ca3af" />;
            case 'FolderOpen': default: return <FolderOpen size={48} color="#9ca3af" />;
        }
    };

    return (
        <div className="empty-state-container">
            <div className="empty-state-icon-wrapper">
                <div className="empty-state-icon-bg"></div>
                {getIcon()}
            </div>
            <h3 className="empty-state-title">{title}</h3>
            <p className="empty-state-description">{description}</p>
            {actionLink && (
                <Link to={actionLink} className="empty-state-action">
                    {actionText}
                </Link>
            )}
        </div>
    );
}
