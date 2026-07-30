import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('CUSTOMER'); // Default role tab
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const roles = [
        { id: 'CUSTOMER', label: 'Customer' },
        { id: 'DELIVERY_AGENT', label: 'Agent' },
        { id: 'WAREHOUSE_MANAGER', label: 'Warehouse' },
        { id: 'ADMIN', label: 'Admin' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data);
            
            // Optional: verify the returned role matches the selected tab
            const returnedRoles = res.data.roles;
            if (!returnedRoles.includes(`ROLE_${activeTab}`)) {
                setError(`Account does not have ${activeTab} permissions.`);
                return;
            }

            if (returnedRoles.includes('ROLE_ADMIN')) navigate('/admin-dashboard');
            else if (returnedRoles.includes('ROLE_CUSTOMER')) navigate('/customer-dashboard');
            else if (returnedRoles.includes('ROLE_DELIVERY_AGENT')) navigate('/delivery-dashboard');
            else if (returnedRoles.includes('ROLE_WAREHOUSE_MANAGER')) navigate('/warehouse-dashboard');
            else navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="container mt-5 animate-fade-in">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card border-0 py-4 px-3 shadow-lg border-top border-primary border-4">
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold mb-2">Welcome Back</h2>
                                <p className="text-muted">Sign in to your {activeTab.replace('_', ' ').toLowerCase()} portal</p>
                            </div>
                            
                            {/* Role Tabs */}
                            <ul className="nav nav-pills nav-fill mb-4 p-1 bg-dark rounded" style={{border: '1px solid rgba(255,255,255,0.2)'}}>
                                {roles.map(role => (
                                    <li className="nav-item" key={role.id}>
                                        <button 
                                            className={`nav-link py-2 px-1 fw-semibold small ${activeTab === role.id ? 'active bg-primary text-white' : 'text-light'}`}
                                            onClick={() => {
                                                setActiveTab(role.id);
                                                setError(''); // clear error when switching
                                            }}
                                            style={{ transition: 'all 0.2s', borderRadius: '6px' }}
                                        >
                                            {role.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {error && <div className="alert alert-danger" style={{background: 'rgba(220,53,69,0.1)', color: '#ff6b6b', border: 'none'}}>{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label text-muted small text-uppercase fw-bold">Email address</label>
                                    <input type="email" className="form-control form-control-lg" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required />
                                </div>
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="form-label text-muted small text-uppercase fw-bold mb-0">Password</label>
                                        <a href="/forgot-password" className="small text-decoration-none text-accent">Forgot password?</a>
                                    </div>
                                    <input type="password" className="form-control form-control-lg mt-2" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg w-100 mt-2 fw-bold">Sign In as {roles.find(r => r.id === activeTab)?.label.toUpperCase()}</button>
                            </form>
                            <p className="mt-4 text-center text-muted">
                                Don't have an account? <a href="/register" className="fw-semibold">Register here</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
