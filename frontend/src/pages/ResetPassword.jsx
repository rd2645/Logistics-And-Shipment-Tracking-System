import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    
    const location = useLocation();
    const navigate = useNavigate();
    
    // Extract token from query params
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/reset-password', { token, newPassword });
            setMessage(res.data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to reset password.");
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center animate-fade-in">
            <div className="card p-4 glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center fw-bold mb-4">Reset Password</h2>
                {message && <div className="alert alert-info">{message}</div>}
                
                {!token ? (
                    <div className="alert alert-danger">Invalid or missing reset token.</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">New Password</label>
                            <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary w-100 mb-3 fw-bold">Reset Password</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
