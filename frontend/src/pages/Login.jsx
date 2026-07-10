import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/api/auth/login', { username, password });
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <form onSubmit={handleSubmit} className="glass-card animate-fade-in">
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>Welcome Back</h2>
                
                {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid var(--danger)' }}>{error}</div>}

                <label className="input-label">Username</label>
                <input type="text" className="input-field" value={username} onChange={e => setUsername(e.target.value)} required />

                <label className="input-label">Password</label>
                <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Login</button>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Sign up</Link>
                </p>
            </form>
        </div>
    );
}
