import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import './login.css';



export default function Login() {
    const navigate = useNavigate();


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginAPI = () => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        };

        fetch('http://localhost:3000/api/auth/login', requestOptions)
            .then(res => {
                if (!res.ok) throw new Error('Login failed');
                return res.json();
            })
            .then(data => {
                // สมมุติว่าได้ token กลับมา
                const token = data.token;
                localStorage.setItem('authToken', token); // เก็บ token ไว้ใช้เรียก API อื่น
                alert('Login สําเร็จ! ยินดีต้อนรับสู่ LiftMan');
                if (data.role === 'admin') {
                    navigate('/admin');
                } 
                if (data.role === 'user') {
                    navigate('/customer');
                }
                if (data.role === 'employee') {
                    navigate('/employee');
                }
            })
            .catch(err => {
                console.log(err);
                alert('Login failed');
            });

    }

    return (
        <div className="login-page">
            <div className="login-card" role="main">
                <div className="login-top">
                    <div className="login-logo" aria-hidden="true">
                        <span className="doc"><img src="../src/assets/logo.svg" alt="" /></span>
                    </div>
                    <h1 className="brand">LiftMan</h1>
                    <p className="subtitle">
                        Elevator Installation & Maintenance
                        <br />
                        Management System
                    </p>
                </div>

                <form className="login-form" >
                    
                    <label className="label" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="input"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label className="label" htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button className="btn-submit" onClick={loginAPI}>
                        Sign In
                    </button>
                    <p>You don't have an account? <Link to={'/register'}>Sign Up</Link></p>
                    <p id=''></p>
                </form>
            </div>
        </div>
    );
}