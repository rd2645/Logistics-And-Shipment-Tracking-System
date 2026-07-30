import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Home = () => {
    const navigate = useNavigate();
    const [trackingResult, setTrackingResult] = useState(null);
    const [trackingError, setTrackingError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        const trackingNumber = e.target.trackingNumber.value.trim();
        if (!trackingNumber) return;

        setTrackingError('');
        setTrackingResult(null);

        try {
            const res = await api.get(`/shipments/track/${trackingNumber}`);
            setTrackingResult(res.data);
        } catch (err) {
            setTrackingError('Shipment not found or tracking number is invalid.');
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="hero-section text-center position-relative">
                <div className="container position-relative z-1">
                    <span className="badge bg-primary mb-4 px-3 py-2 text-uppercase" style={{ letterSpacing: '2px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>Global Logistics Partner</span>
                    <h1 className="display-3 fw-bold mb-3 text-white" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
                        Delivering the Future of <br />
                        <span className="text-gradient">Supply Chain</span>
                    </h1>
                    <p className="lead text-light mb-5 mx-auto fw-semibold" style={{ maxWidth: '700px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        Empowering businesses with enterprise-grade logistics, real-time tracking, and a global delivery network you can trust.
                    </p>
                    
                    {/* Compact Tracking Box (Fresh Style) */}
                    <div className="mx-auto mt-4" style={{ maxWidth: '600px' }}>
                        <form onSubmit={handleTrack} className="d-flex p-2 rounded-pill shadow-lg bg-white" style={{ border: '4px solid rgba(255, 255, 255, 0.2)', backgroundClip: 'padding-box' }}>
                            <div className="fs-4 text-primary ms-3 me-2 d-flex align-items-center">
                                🔍
                            </div>
                            <input 
                                type="text" 
                                name="trackingNumber"
                                className="form-control border-0 bg-transparent text-dark shadow-none fs-5 fw-bold" 
                                placeholder="Enter tracking number..." 
                                required 
                            />
                            <button type="submit" className="btn btn-primary rounded-pill px-5 fw-bold fs-5 shadow-sm" style={{ transition: 'transform 0.2s' }}>
                                Track
                            </button>
                        </form>

                        {/* Tracking Result Box */}
                        {trackingError && (
                            <div className="alert alert-danger mt-4 rounded-4 shadow-sm fw-bold border-0" role="alert">
                                ⚠️ {trackingError}
                            </div>
                        )}
                        {trackingResult && (
                            <div className="card mt-4 rounded-4 shadow-lg border-0 bg-white text-start overflow-hidden animate-fade-in">
                                <div className="card-header bg-primary text-white p-3 fw-bold d-flex justify-content-between align-items-center">
                                    <span>Tracking: {trackingResult.trackingNumber}</span>
                                    <span className="badge bg-light text-primary fs-6">{trackingResult.currentStatus}</span>
                                </div>
                                <div className="card-body p-4 text-dark">
                                    <div className="row">
                                        <div className="col-6 mb-3">
                                            <h6 className="text-muted text-uppercase small fw-bold mb-1">Current Location</h6>
                                            <div className="fs-5 fw-semibold">{trackingResult.currentLocation || 'Awaiting Update'}</div>
                                        </div>
                                        <div className="col-6 mb-3">
                                            <h6 className="text-muted text-uppercase small fw-bold mb-1">Last Updated</h6>
                                            <div className="fs-5 fw-semibold">{new Date(trackingResult.lastUpdate).toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="progress mt-2 mb-1" style={{height: '10px'}}>
                                        <div className={`progress-bar progress-bar-striped progress-bar-animated ${trackingResult.currentStatus === 'DELIVERED' ? 'bg-success' : 'bg-primary'}`} style={{width: trackingResult.currentStatus === 'DELIVERED' ? '100%' : trackingResult.currentStatus === 'IN_TRANSIT' ? '60%' : '30%'}}></div>
                                    </div>
                                    <div className="d-flex justify-content-between text-muted small fw-bold mt-2">
                                        <span>Dispatched</span>
                                        <span>In Transit</span>
                                        <span>Delivered</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="py-4 bg-dark border-bottom border-secondary">
                <div className="container">
                    <div className="row g-3 justify-content-center">
                        <div className="col-md-3">
                            <div className="card glass-panel quick-action-card p-3 text-center h-100" onClick={() => window.scrollTo(0, 0)}>
                                <div className="fs-3 mb-2">🔍</div>
                                <h6 className="fw-bold mb-0">Track Shipment</h6>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card glass-panel quick-action-card p-3 text-center h-100" onClick={() => alert('Get a Quote feature coming soon!')}>
                                <div className="fs-3 mb-2">📄</div>
                                <h6 className="fw-bold mb-0">Get a Quote</h6>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card glass-panel quick-action-card p-3 text-center h-100" onClick={() => alert('Find a Location feature coming soon!')}>
                                <div className="fs-3 mb-2">📍</div>
                                <h6 className="fw-bold mb-0">Find a Location</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-5 my-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">Our Logistics Services</h2>
                        <p className="text-muted">Comprehensive solutions tailored for modern enterprises.</p>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card glass-panel p-4 h-100 border-0">
                                <h4 className="fw-bold text-accent mb-3">Global Freight</h4>
                                <p className="text-muted mb-4">Seamless air, ocean, and ground freight forwarding across continents with robust customs clearance.</p>
                                <a href="#" className="text-accent fw-bold small text-uppercase">Learn More →</a>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card glass-panel p-4 h-100 border-0">
                                <h4 className="fw-bold text-accent mb-3">Express Delivery</h4>
                                <p className="text-muted mb-4">Time-critical shipping solutions ensuring your packages arrive at their destination exactly when needed.</p>
                                <a href="#" className="text-accent fw-bold small text-uppercase">Learn More →</a>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card glass-panel p-4 h-100 border-0">
                                <h4 className="fw-bold text-accent mb-3">Supply Chain</h4>
                                <p className="text-muted mb-4">End-to-end warehouse management, inventory tracking, and distribution optimization.</p>
                                <a href="#" className="text-accent fw-bold small text-uppercase">Learn More →</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-5 bg-dark">
                <div className="container">
                    <h2 className="fw-bold mb-5 text-center">Trusted by Industry Leaders</h2>
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="card glass-panel p-4 testimonial-card h-100">
                                <p className="fst-italic text-light mb-4">"The real-time tracking and automated capacity management have completely transformed how we handle our e-commerce distribution."</p>
                                <div className="d-flex align-items-center">
                                    <div className="bg-secondary rounded-circle me-3" style={{width: '50px', height: '50px'}}></div>
                                    <div>
                                        <h6 className="fw-bold mb-0">Sarah Jenkins</h6>
                                        <small className="text-muted">Operations Director, TechCorp</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card glass-panel p-4 testimonial-card h-100">
                                <p className="fst-italic text-light mb-4">"Exceptional delivery speeds and top-notch customer support. The API integrations made onboarding a breeze."</p>
                                <div className="d-flex align-items-center">
                                    <div className="bg-secondary rounded-circle me-3" style={{width: '50px', height: '50px'}}></div>
                                    <div>
                                        <h6 className="fw-bold mb-0">Marcus Chen</h6>
                                        <small className="text-muted">CEO, Global Retail Solutions</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-5 text-center" style={{ background: 'var(--gradient-primary)' }}>
                <div className="container py-4">
                    <h2 className="fw-bold text-white mb-3">Ready to optimize your logistics?</h2>
                    <p className="text-white-50 mb-4 lead">Join our platform today and streamline your shipping operations.</p>
                    <Link to="/register" className="btn btn-light btn-lg px-5 fw-bold text-primary rounded-pill shadow">Get Started Now</Link>
                </div>
            </section>

            {/* Professional Footer */}
            <footer className="footer text-white pt-5">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-md-4 mb-4">
                            <h4 className="fw-bold text-white mb-3">
                                <span style={{ color: 'var(--accent-primary)' }}>Logistics</span> System
                            </h4>
                            <p className="text-muted small pr-4">Delivering excellence across borders. We provide intelligent, data-driven logistics solutions for businesses of all sizes.</p>
                        </div>
                        <div className="col-md-2 mb-4">
                            <h6 className="fw-bold text-uppercase mb-3">Solutions</h6>
                            <ul className="list-unstyled small">
                                <li className="mb-2"><a href="#" className="footer-link">Freight</a></li>
                                <li className="mb-2"><a href="#" className="footer-link">Warehousing</a></li>
                                <li className="mb-2"><a href="#" className="footer-link">Express</a></li>
                            </ul>
                        </div>
                        <div className="col-md-2 mb-4">
                            <h6 className="fw-bold text-uppercase mb-3">Company</h6>
                            <ul className="list-unstyled small">
                                <li className="mb-2"><a href="#" className="footer-link">About Us</a></li>
                                <li className="mb-2"><a href="#" className="footer-link">Careers</a></li>
                                <li className="mb-2"><a href="#" className="footer-link">Contact</a></li>
                            </ul>
                        </div>
                        <div className="col-md-4 mb-4">
                            <h6 className="fw-bold text-uppercase mb-3">Contact Us</h6>
                            <ul className="list-unstyled small text-muted">
                                <li className="mb-2">📞 +1 (800) 555-0199</li>
                                <li className="mb-2">✉️ support@logisticssystem.com</li>
                                <li className="mb-2">🏢 123 Supply Chain Ave, NY 10001</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-top border-secondary pt-4 text-center">
                        <p className="text-muted small mb-0">&copy; {new Date().getFullYear()} CargoX. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
