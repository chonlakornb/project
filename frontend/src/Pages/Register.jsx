import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

export default function Register() {
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [region, setRegion] = useState('');
	const [confirm, setConfirm] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const registerApi = async () => {
    if (password !== confirm) {
        setError('Passwords do not match');
        return;
    }

    setLoading(true);

    try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName: name, email, password, region, phone })
        });

        if (!res.ok) {
            const errorData = await res.json(); // อ่าน message จาก backend
            throw new Error(errorData.message || 'Registration failed');
        }

        const data = await res.json();
        alert(data.message);

        setLoading(false);
        navigate('/login');

    } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
    }
};

	

	return (
		<div className="reg-page">
			<div className="reg-card">
				<div className="reg-header">
					<div className="reg-logo">⬆</div>
					<h1 className="reg-title">Create account</h1>
					<p className="reg-sub">Join LiftMan — Elevator Management</p>
				</div>

				<form className="reg-form" 	>
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
						placeholder="you@email.com"
						required
					/>

					<label className="reg-label">Phone Number</label>
					<input
						className="reg-input"
						type="tel"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						placeholder="Your phone number"
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

					<label className="reg-label">Region</label>
					<select className='region-select' onChange={(e) => setRegion(e.target.value)} defaultValue={'Region'}>
						<option value="Region">Please Select Your Region</option> 
						<option value="North">North</option>
						<option value="Central">Central</option>
						<option value="North East">North East</option>
						<option value="South">South</option>
					</select>

					{error && <div className="reg-error" role="alert">{error}</div>}

					<button className="reg-btn" type="submit" disabled={loading} onClick={registerApi}>
						{loading ? 'Creating...' : 'Create account'} 
					</button>

					<div className="reg-footer">
						Already have an account? <Link to={'/login'}>Sign in</Link>
					</div>
				</form>
			</div>
		</div>
	);
}