import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [role, setRole] = useState('user');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		if (!name.trim() || !email.trim() || !password) {
			setError('Please fill all required fields.');
			return;
		}
		if (password !== confirm) {
			setError('Passwords do not match.');
			return;
		}
		setLoading(true);
		// simulate API call
		setTimeout(() => {
			setLoading(false);
			// In real app POST to /api/auth/register then handle response
			alert('Registration successful — please sign in.');
			navigate('/login');
		}, 800);
	};

	return (
		<div className="reg-page">
			<div className="reg-card">
				<div className="reg-header">
					<div className="reg-logo">⬆</div>
					<h1 className="reg-title">Create account</h1>
					<p className="reg-sub">Join LiftMan — Elevator Management</p>
				</div>

				<form className="reg-form" onSubmit={handleSubmit}>
					<label className="reg-label">Full name</label>
					<input
						className="reg-input"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Jane Doe"
						required
					/>

					<label className="reg-label">Email</label>
					<input
						className="reg-input"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="you@company.com"
						required
					/>

					<label className="reg-label">Password</label>
					<input
						className="reg-input"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Create password"
						required
					/>

					<label className="reg-label">Confirm password</label>
					<input
						className="reg-input"
						type="password"
						value={confirm}
						onChange={(e) => setConfirm(e.target.value)}
						placeholder="Confirm password"
						required
					/>

					<label className="reg-label">Role</label>
					<select className="reg-select" value={role} onChange={(e) => setRole(e.target.value)}>
						<option value="user">User</option>
						<option value="technician">Technician</option>
						<option value="admin">Admin</option>
					</select>

					{error && <div className="reg-error" role="alert">{error}</div>}

					<button className="reg-btn" type="submit" disabled={loading}>
						{loading ? 'Creating...' : 'Create account'}
					</button>

					<div className="reg-footer">
						Already have an account? <a href="/#/login">Sign in</a>
					</div>
				</form>
			</div>
		</div>
	);
}