import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './login.css';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role'); // read ?role=admin or ?role=technician

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // If role is forced from URL (e.g., ?role=admin), use it
        const role = (roleParam || '').toLowerCase();
        if (role === 'admin') {
            navigate('/admin');
            return;
        }
        if (role === 'technician') {
            navigate('/Employee');
            return;
        }

        // Otherwise, use email-based routing (default behavior)
        const trimmed = (email || '').trim().toLowerCase();
        if (trimmed === 'admin@example.com') navigate('/admin');
        else if (trimmed === 'tech@example.com') navigate('/Employee');
        else if (trimmed === 'user@example.com') navigate('/customer');
        else navigate('/customer'); // default/fallback
    }; 

    return (
        <div className="login-page">
            <div className="login-card" role="main">
                <div className="login-top">
                    <div className="login-logo" aria-hidden="true">
                        <span className="doc">≡</span>
                    </div>
                    <h1 className="brand">LiftMan</h1>
                    <p className="subtitle">
                        Elevator Installation & Maintenance
                        <br />
                        Management System
                    </p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label className="label" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="input"
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label className="label" htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="btn-submit">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}