import React, { useState, useEffect } from 'react';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminDashboard = () => {
    const [shipments, setShipments] = useState([]);
    const [assignData, setAssignData] = useState({ shipmentId: '', agentId: '' });
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        fetchShipments();
        fetchAnalytics();
    }, []);

    const fetchShipments = async () => {
        try {
            const res = await api.get('/admin/shipments');
            setShipments(res.data);
        } catch (err) {
            console.error("Error fetching all shipments", err);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const res = await api.get('/admin/analytics');
            setAnalytics(res.data);
        } catch (err) {
            console.error("Error fetching analytics", err);
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/assign-agent', assignData);
            alert("Agent assigned successfully!");
            setAssignData({ shipmentId: '', agentId: '' });
            fetchShipments();
        } catch (err) {
            alert("Failed to assign agent.");
        }
    };

    const chartData = analytics ? [
        { name: 'Total Shipments', value: analytics.totalShipments },
        { name: 'Active Deliveries', value: analytics.activeDeliveries }
    ] : [];

    return (
        <div className="container mt-5 animate-fade-in">
            <h2 className="fw-bold mb-4">Admin Dashboard</h2>

            {analytics && (
                <div className="row g-4 mb-4">
                    <div className="col-md-4">
                        <div className="card glass-panel p-3 text-center">
                            <h5 className="text-muted">Total Shipments</h5>
                            <h2 className="fw-bold text-primary">{analytics.totalShipments}</h2>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card glass-panel p-3 text-center">
                            <h5 className="text-muted">Active Deliveries</h5>
                            <h2 className="fw-bold text-warning">{analytics.activeDeliveries}</h2>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card glass-panel p-3 text-center">
                            <h5 className="text-muted">Estimated Revenue</h5>
                            <h2 className="fw-bold text-success">${analytics.estimatedRevenue}</h2>
                        </div>
                    </div>
                </div>
            )}

            <div className="row g-4 mb-4">
                <div className="col-12">
                    <div className="card glass-panel p-4" style={{ height: '300px' }}>
                        <h4 className="fw-bold mb-3 text-accent">Analytics Overview</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" stroke="#ccc" />
                                <YAxis stroke="#ccc" />
                                <Tooltip wrapperStyle={{ backgroundColor: '#1a1a2e', borderRadius: '8px' }} />
                                <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#4e54c8' : '#ff9800'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-4">
                    <div className="card glass-panel p-4 h-100">
                        <h4 className="fw-bold mb-3 text-accent">Assign Delivery Agent</h4>
                        <form onSubmit={handleAssign}>
                            <input type="number" className="form-control mb-3" placeholder="Shipment ID" value={assignData.shipmentId} onChange={e => setAssignData({...assignData, shipmentId: e.target.value})} required />
                            <input type="number" className="form-control mb-4" placeholder="Delivery Agent ID" value={assignData.agentId} onChange={e => setAssignData({...assignData, agentId: e.target.value})} required />
                            <button type="submit" className="btn btn-primary w-100">Assign Agent</button>
                        </form>
                    </div>
                </div>
                
                <div className="col-md-8">
                    <div className="card glass-panel p-4 h-100">
                        <h4 className="fw-bold mb-3 text-accent">All Shipments</h4>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover text-white mb-0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tracking #</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shipments.map(s => (
                                        <tr key={s.id}>
                                            <td>{s.id}</td>
                                            <td><code>{s.trackingNumber}</code></td>
                                            <td><span className="badge bg-secondary">{s.status}</span></td>
                                        </tr>
                                    ))}
                                    {shipments.length === 0 && <tr><td colSpan="3" className="text-center text-muted py-3">No shipments found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
