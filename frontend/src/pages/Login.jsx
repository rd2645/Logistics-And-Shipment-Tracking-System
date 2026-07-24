import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data);
            if (res.data.roles.includes('ROLE_ADMIN')) navigate('/admin-dashboard');
            else if (res.data.roles.includes('ROLE_CUSTOMER')) navigate('/customer-dashboard');
            else if (res.data.roles.includes('ROLE_DELIVERY_AGENT')) navigate('/delivery-dashboard');
            else if (res.data.roles.includes('ROLE_WAREHOUSE_MANAGER')) navigate('/warehouse-dashboard');
            else navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Login</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label>Email address</label>
                                    <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label>Password</label>
                                    <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Login</button>
                            </form>
                            <p className="mt-3 text-center">
                                Don't have an account? <a href="/register">Register here</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
