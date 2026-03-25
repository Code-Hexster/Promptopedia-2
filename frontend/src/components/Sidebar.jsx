import { NavLink } from 'react-router-dom';
import { Home, Users, User, MessageCircle, Bell, LogOut, PlusSquare } from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar({ onCloseMobile }) {
    const { logout } = useContext(AuthContext);

    const handleLinkClick = () => {
        if (onCloseMobile) onCloseMobile();
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Promptopedia</h2>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" onClick={handleLinkClick} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Home size={20} />
                    <span>Feed</span>
                </NavLink>

                <NavLink to="/create" onClick={handleLinkClick} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <PlusSquare size={20} />
                    <span>Create</span>
                </NavLink>

                <NavLink to="/following" onClick={handleLinkClick} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Users size={20} />
                    <span>Following</span>
                </NavLink>

                <NavLink to="/profile" onClick={handleLinkClick} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <User size={20} />
                    <span>Profile</span>
                </NavLink>

                <NavLink to="/messages" onClick={handleLinkClick} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <MessageCircle size={20} />
                    <span>Messages</span>
                </NavLink>

                <NavLink to="/notifications" onClick={handleLinkClick} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Bell size={20} />
                    <span>Notifications</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button
                    onClick={() => {
                        handleLinkClick();
                        logout();
                    }}
                    className="logout-button"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
