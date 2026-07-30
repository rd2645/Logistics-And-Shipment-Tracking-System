import React, { useState, useEffect } from 'react';
import api from '../api';

const CustomerDashboard = () => {
    const [shipments, setShipments] = useState([]);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingResult, setTrackingResult] = useState(null);
    const [formData, setFormData] = useState({
        senderName: '', receiverName: '', pickupAddress: '', deliveryAddress: '', weight: '', shipmentType: 'Standard', paymentMethod: 'COD'
    });
    
    const [rateData, setRateData] = useState({ shipmentId: null, rating: 5, comment: '' });
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        fetchShipments();
    }, []);

    const fetchShipments = async () => {
        try {
            const res = await api.get('/shipments/my-shipments');
            setShipments(res.data);
        } catch (err) {
            console.error("Error fetching shipments", err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (formData.paymentMethod === 'ONLINE' && !showPaymentModal) {
            setShowPaymentModal(true);
            return;
        }

        try {
            await api.post('/shipments', formData);
            alert("Shipment created successfully!");
            setFormData({ senderName: '', receiverName: '', pickupAddress: '', deliveryAddress: '', weight: '', shipmentType: 'Standard', paymentMethod: 'COD' });
            setShowPaymentModal(false);
            fetchShipments();
        } catch (err) {
            alert("Failed to create shipment.");
        }
    };

    const handleMockPayment = () => {
        // Simulate payment success
        setTimeout(() => {
            handleCreate(new Event('submit'));
        }, 1000);
    };

    const handleTrack = async (e) => {
        e.preventDefault();
        try {
            const res = await api.get(`/shipments/track/${trackingNumber}`);
            setTrackingResult(res.data);
        } catch (err) {
            alert("Shipment not found.");
            setTrackingResult(null);
        }
    };

    const handleRate = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/shipments/${rateData.shipmentId}/rate`, { rating: rateData.rating, comment: rateData.comment });
            alert("Thank you for your feedback!");
            setRateData({ shipmentId: null, rating: 5, comment: '' });
        } catch (err) {
            alert("Failed to submit rating. You might have already rated this shipment.");
        }
    };

    return (
        <div className="container mt-5 animate-fade-in">
            <h2 className="fw-bold mb-4">Customer Dashboard</h2>
            <div className="row g-4">
                <div className="col-md-4">
                    <div className="card glass-panel p-4 h-100">
                        <h4 className="fw-bold mb-3 text-accent">Create Shipment</h4>
                        <form onSubmit={handleCreate}>
                            <input type="text" className="form-control mb-3" placeholder="Sender Name" value={formData.senderName} onChange={e => setFormData({...formData, senderName: e.target.value})} required />
                            <input type="text" className="form-control mb-3" placeholder="Receiver Name" value={formData.receiverName} onChange={e => setFormData({...formData, receiverName: e.target.value})} required />
                            <input type="text" className="form-control mb-3" placeholder="Pickup Address" value={formData.pickupAddress} onChange={e => setFormData({...formData, pickupAddress: e.target.value})} required />
                            <input type="text" className="form-control mb-3" placeholder="Delivery Address" value={formData.deliveryAddress} onChange={e => setFormData({...formData, deliveryAddress: e.target.value})} required />
                            <input type="number" step="0.1" className="form-control mb-3" placeholder="Weight (kg)" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} required />
                            <select className="form-select mb-3" value={formData.shipmentType} onChange={e => setFormData({...formData, shipmentType: e.target.value})}>
                                <option>Standard</option>
                                <option>Express</option>
                            </select>
                            <select className="form-select mb-4" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
                                <option value="COD">Cash on Delivery (COD)</option>
                                <option value="ONLINE">Online Payment</option>
                            </select>
                            <button type="submit" className="btn btn-primary w-100">Book Shipment</button>
                        </form>
                    </div>
                </div>
                
                <div className="col-md-8">
                    <div className="card glass-panel p-4 mb-4">
                        <h4 className="fw-bold mb-3 text-accent">Track Shipment</h4>
                        <form onSubmit={handleTrack} className="d-flex gap-2">
                            <input type="text" className="form-control" placeholder="Enter Tracking Number (e.g. TRK...)" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} required />
                            <button type="submit" className="btn btn-primary">Track</button>
                        </form>
                        {trackingResult && (
                            <div className="mt-3 p-3 bg-dark rounded border border-secondary">
                                <strong>Status:</strong> {trackingResult.status} <br/>
                                <strong>Location:</strong> {trackingResult.location} <br/>
                                <strong>Last Updated:</strong> {new Date(trackingResult.updateTime).toLocaleString()}
                            </div>
                        )}
                    </div>

                    <div className="card glass-panel p-4">
                        <h4 className="fw-bold mb-3 text-accent">Order History</h4>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover text-white mb-0 align-middle">
                                <thead>
                                    <tr>
                                        <th>Tracking #</th>
                                        <th>Receiver</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shipments.map(s => (
                                        <tr key={s.id}>
                                            <td><code>{s.trackingNumber}</code></td>
                                            <td>{s.receiverName}</td>
                                            <td>{s.shipmentType}</td>
                                            <td><span className="badge bg-secondary">{s.status}</span></td>
                                            <td>
                                                {s.status === 'DELIVERED' && (
                                                    <button className="btn btn-sm btn-outline-warning" onClick={() => setRateData({ ...rateData, shipmentId: s.id })}>Rate</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {shipments.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-3">No shipments found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {rateData.shipmentId && (
                        <div className="card glass-panel p-4 mt-4 animate-fade-in border-warning">
                            <h5 className="fw-bold mb-3 text-warning">Rate Delivery</h5>
                            <form onSubmit={handleRate}>
                                <div className="mb-3">
                                    <label className="form-label">Rating (1-5 Stars)</label>
                                    <select className="form-select" value={rateData.rating} onChange={e => setRateData({...rateData, rating: parseInt(e.target.value)})}>
                                        <option value="5">5 - Excellent</option>
                                        <option value="4">4 - Good</option>
                                        <option value="3">3 - Average</option>
                                        <option value="2">2 - Poor</option>
                                        <option value="1">1 - Terrible</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Comment</label>
                                    <textarea className="form-control" rows="2" value={rateData.comment} onChange={e => setRateData({...rateData, comment: e.target.value})}></textarea>
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-warning">Submit Feedback</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setRateData({ shipmentId: null, rating: 5, comment: '' })}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered animate-fade-in">
                        <div className="modal-content bg-dark text-white border-secondary">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title text-accent fw-bold">Online Payment</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowPaymentModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Please enter your payment details to complete the booking.</p>
                                <div className="mb-3">
                                    <label className="form-label text-muted small text-uppercase">Card Number</label>
                                    <input type="text" className="form-control" placeholder="**** **** **** ****" />
                                </div>
                                <div className="row">
                                    <div className="col-6 mb-3">
                                        <label className="form-label text-muted small text-uppercase">Expiry</label>
                                        <input type="text" className="form-control" placeholder="MM/YY" />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <label className="form-label text-muted small text-uppercase">CVC</label>
                                        <input type="text" className="form-control" placeholder="123" />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-secondary">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleMockPayment}>Pay Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerDashboard;
