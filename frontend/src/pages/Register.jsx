import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'ROLE_CUSTOMER'
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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Register</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label>Full Name</label>
                                    <input type="text" name="name" className="form-control" onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label>Email address</label>
                                    <input type="email" name="email" className="form-control" onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label>Password</label>
                                    <input type="password" name="password" className="form-control" onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label>Role</label>
                                    <select name="role" className="form-select" onChange={handleChange} value={formData.role}>
                                        <option value="CUSTOMER">Customer</option>
                                        <option value="DELIVERY_AGENT">Delivery Agent</option>
                                        <option value="WAREHOUSE_MANAGER">Warehouse Manager</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Register</button>
                            </form>
                            <p className="mt-3 text-center">
                                Already have an account? <a href="/login">Login here</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
