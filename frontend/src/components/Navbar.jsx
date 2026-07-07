import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { CheckSquare, LogOut, Sun, Moon } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            position: 'fixed',
            top: 0, width: '100%',
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(14px)',
            borderBottom: '1px solid var(--border-color)',
            zIndex: 100,
            transition: 'background 0.3s ease'
        }}>
            <div className="container" style={{ height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.2rem' }}>
                    <CheckSquare size={22} color="var(--primary-color)" />
                    <span style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Task Tracker
                    </span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                        id="theme-toggle"
                        onClick={toggleTheme}
                        className="btn-icon"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        style={{ color: theme === 'dark' ? '#f59e0b' : '#6366f1' }}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{
                                color: 'var(--text-muted)',
                                fontSize: '0.875rem',
                                padding: '0.3rem 0.75rem',
                                background: 'rgba(99,102,241,0.1)',
                                border: '1px solid rgba(99,102,241,0.2)',
                                borderRadius: '999px'
                            }}>
                                {user.username}
                            </span>
                            <button onClick={handleLogout} className="btn-icon" title="Logout" style={{ color: 'var(--danger)' }}>
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Link to="/login" className="btn-secondary">Login</Link>
                            <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.875rem' }}>Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
