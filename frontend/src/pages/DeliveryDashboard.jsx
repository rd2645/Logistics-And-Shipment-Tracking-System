import React, { useState, useEffect } from 'react';
import api from '../api';

const DeliveryDashboard = () => {
    const [assignments, setAssignments] = useState([]);
    const [statusData, setStatusData] = useState({});

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const res = await api.get('/delivery/assignments');
            setAssignments(res.data);
        } catch (err) {
            console.error("Error fetching assignments", err);
        }
    };

    const handleUpdateStatus = async (id) => {
        const data = statusData[id];
        if (!data || !data.status || !data.location) {
            alert("Please provide both status and location.");
            return;
        }
        try {
            await api.put(`/delivery/shipments/${id}/status`, data);
            alert("Status updated!");
            fetchAssignments();
        } catch (err) {
            alert("Failed to update status.");
        }
    };

    return (
        <div className="container mt-5 animate-fade-in">
            <h2 className="fw-bold mb-4">Delivery Agent Dashboard</h2>
            <div className="row g-4">
                <div className="col-12">
                    <div className="card glass-panel p-4">
                        <h4 className="fw-bold mb-3 text-accent">My Assigned Shipments</h4>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover text-white mb-0 align-middle">
                                <thead>
                                    <tr>
                                        <th>Tracking #</th>
                                        <th>Receiver</th>
                                        <th>Address</th>
                                        <th>Current Status</th>
                                        <th>Update Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.map(s => (
                                        <tr key={s.id}>
                                            <td><code>{s.trackingNumber}</code></td>
                                            <td>{s.receiverName}</td>
                                            <td>{s.deliveryAddress}</td>
                                            <td><span className="badge bg-secondary">{s.status}</span></td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <select className="form-select form-select-sm" style={{width: '150px'}} onChange={e => setStatusData({...statusData, [s.id]: {...statusData[s.id], status: e.target.value}})}>
                                                        <option value="">Select...</option>
                                                        <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                                        <option value="DELIVERED">Delivered</option>
                                                    </select>
                                                    <input type="text" className="form-control form-control-sm" placeholder="Location" style={{width: '150px'}} onChange={e => setStatusData({...statusData, [s.id]: {...statusData[s.id], location: e.target.value}})} />
                                                    <button className="btn btn-sm btn-primary" onClick={() => handleUpdateStatus(s.id)}>Update</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {assignments.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-3">No assigned shipments found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDashboard;
