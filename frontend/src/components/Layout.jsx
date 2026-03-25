import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';
import './Layout.css';

export default function Layout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="layout-container">
            {/* Mobile Header */}
            <div className="mobile-header">
                <h2 className="mobile-logo">Promptopedia</h2>
                <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div className="mobile-overlay" onClick={toggleMobileMenu}></div>
            )}

            {/* Sidebar with mobile class */}
            <div className={`sidebar-wrapper ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
            </div>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
