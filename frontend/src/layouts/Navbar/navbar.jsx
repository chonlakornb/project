import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const currentRole = (params.get('role') || '').toLowerCase();

    const goToLoginWithRole = (role, e) => {
        if (e && e.preventDefault) e.preventDefault();
        navigate(`/login?role=${encodeURIComponent(role)}`);
    };

    return (
        <header className="global-nav-container" role="banner">
            <a className="global-nav-left" href="/" aria-label="LiftMan home">
                <div className="global-nav-logo-icon">⬆</div>
                <div className="global-nav-title">
                    <span className="global-nav-name">LiftMan</span>
                    <span className="global-nav-sub">Elevator Management</span>
                </div>
            </a>

            <nav className="global-nav-right" role="navigation" aria-label="Main navigation">
                <a
                    className={`global-nav-link global-nav-portal ${currentRole === 'admin' ? 'global-nav-active' : ''}`}
                    href="/login?role=admin"
                    onClick={(e) => goToLoginWithRole('admin', e)}
                >
                    Admin Portal
                </a>

                <a
                    className={`global-nav-link ${currentRole === 'technician' ? 'global-nav-active' : ''}`}
                    href="/login?role=technician"
                    onClick={(e) => goToLoginWithRole('technician', e)}
                >
                    Technician Portal
                </a>

                <a
                    className={`global-nav-link ${currentRole === 'user' ? 'global-nav-active' : ''}`}
                    href="/login?role=user"
                    onClick={(e) => goToLoginWithRole('user', e)}
                >
                    User Portal
                </a>
            </nav>
        </header>
    );
}