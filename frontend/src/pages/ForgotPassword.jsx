import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(res.data.message);
        } catch (err) {
            setMessage("Failed to send reset link.");
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center animate-fade-in">
            <div className="card p-4 glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center fw-bold mb-4">Forgot Password</h2>
                {message && <div className="alert alert-info">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email address</label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-3 fw-bold">Send Reset Link</button>
                    <div className="text-center">
                        <Link to="/login" className="text-decoration-none text-accent">Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
