import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'CUSTOMER'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="container mt-5 animate-fade-in">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card border-0 py-4 px-3 shadow-lg border-top border-primary border-4">
                        <div className="card-body">
                            <div className="text-center mb-5">
                                <h2 className="fw-bold mb-2">Create Account</h2>
                                <p className="text-muted">Join the Logistics System</p>
                            </div>
                            {error && <div className="alert alert-danger" style={{background: 'rgba(220,53,69,0.1)', color: '#ff6b6b', border: 'none'}}>{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label text-muted small text-uppercase fw-bold">Full Name</label>
                                    <input type="text" name="name" className="form-control form-control-lg" onChange={handleChange} placeholder="John Doe" required />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-muted small text-uppercase fw-bold">Email address</label>
                                    <input type="email" name="email" className="form-control form-control-lg" onChange={handleChange} placeholder="name@example.com" required />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-muted small text-uppercase fw-bold">Password</label>
                                    <input type="password" name="password" className="form-control form-control-lg" onChange={handleChange} placeholder="••••••••" required />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-muted small text-uppercase fw-bold">Role</label>
                                    <select name="role" className="form-select form-control-lg" style={{backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-light)', color: 'var(--text-main)'}} onChange={handleChange} value={formData.role}>
                                        <option style={{background: '#1e293b'}} value="CUSTOMER">Customer</option>
                                        <option style={{background: '#1e293b'}} value="DELIVERY_AGENT">Delivery Agent</option>
                                        <option style={{background: '#1e293b'}} value="WAREHOUSE_MANAGER">Warehouse Manager</option>
                                        <option style={{background: '#1e293b'}} value="ADMIN">Admin</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg w-100 mt-2 fw-bold">Register</button>
                            </form>
                            <p className="mt-4 text-center text-muted">
                                Already have an account? <a href="/login" className="fw-semibold">Login here</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
