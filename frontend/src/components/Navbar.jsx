import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const isHome = location.pathname === '/';

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        if (user.roles.includes('ROLE_ADMIN')) return '/admin-dashboard';
        if (user.roles.includes('ROLE_CUSTOMER')) return '/customer-dashboard';
        if (user.roles.includes('ROLE_DELIVERY_AGENT')) return '/delivery-dashboard';
        if (user.roles.includes('ROLE_WAREHOUSE_MANAGER')) return '/warehouse-dashboard';
        return '/dashboard';
    };

    return (
        <nav className={`navbar navbar-expand-lg navbar-dark ${isHome ? 'position-absolute w-100 z-3' : 'glass-nav sticky-top mb-4'}`} style={isHome ? { background: 'transparent' } : {}}>
            <div className={`container ${isHome ? 'mt-2' : ''}`}>
                <Link className="navbar-brand fw-bold fs-4 text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }} to="/">
                    <span style={{ color: 'var(--accent-primary)' }}>Cargo</span>X
                </Link>
                <button className="navbar-toggler shadow-none border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        {user ? (
                            <>
                                <li className="nav-item me-3">
                                    <span className="text-muted small">Welcome, {user.email}</span>
                                </li>
                                <li className="nav-item me-2">
                                    <Link className="nav-link btn btn-outline-light btn-sm px-3 rounded" to={getDashboardLink()}>
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button onClick={handleLogout} className="btn btn-primary btn-sm px-3 rounded">
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item me-2">
                                    <Link className="nav-link" to="/login">Sign In</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-primary btn-sm px-3 rounded" to="/register">Create Account</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
