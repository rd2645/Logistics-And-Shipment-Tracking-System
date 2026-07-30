import React, { useState, useEffect } from 'react';
import api from '../api';

const WarehouseDashboard = () => {
    const [shipments, setShipments] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [statusData, setStatusData] = useState({});
    const [selectedWarehouseId, setSelectedWarehouseId] = useState('');

    useEffect(() => {
        fetchShipments();
        fetchWarehouses();
    }, []);

    const fetchShipments = async () => {
        try {
            const res = await api.get('/warehouse/shipments');
            setShipments(res.data);
        } catch (err) {
            console.error("Error fetching shipments", err);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const res = await api.get('/warehouse/list');
            setWarehouses(res.data);
            if (res.data.length > 0) setSelectedWarehouseId(res.data[0].id);
        } catch (err) {
            console.error("Error fetching warehouses", err);
        }
    };

    const handleAccept = async (id) => {
        if (!selectedWarehouseId) {
            alert("No warehouse selected or available.");
            return;
        }
        try {
            await api.put(`/warehouse/shipments/${id}/accept/${selectedWarehouseId}`);
            alert("Shipment accepted into warehouse!");
            fetchShipments();
        } catch (err) {
            alert("Failed to accept shipment.");
        }
    };

    const handleUpdateStatus = async (id) => {
        const data = statusData[id];
        if (!data || !data.status || !data.location) {
            alert("Please provide both status and location.");
            return;
        }
        try {
            await api.put(`/warehouse/shipments/${id}/status`, data);
            alert("Status updated!");
            fetchShipments();
        } catch (err) {
            alert("Failed to update status.");
        }
    };

    return (
        <div className="container mt-5 animate-fade-in">
            <h2 className="fw-bold mb-4">Warehouse Manager Dashboard</h2>
            <div className="row g-4">
                <div className="col-12">
                    <div className="card glass-panel p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="fw-bold mb-0 text-accent">Warehouse Shipments</h4>
                            {warehouses.length > 0 && (
                                <select className="form-select w-auto" value={selectedWarehouseId} onChange={e => setSelectedWarehouseId(e.target.value)}>
                                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.warehouseName || w.name}</option>)}
                                </select>
                            )}
                        </div>
                        
                        {selectedWarehouseId && (() => {
                            const selectedWarehouse = warehouses.find(w => w.id === parseInt(selectedWarehouseId));
                            if (selectedWarehouse) {
                                const loadPercent = Math.min(100, Math.round(((selectedWarehouse.currentLoad || 0) / (selectedWarehouse.capacity || 100)) * 100));
                                return (
                                    <div className="mb-4 p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Capacity</span>
                                            <span>{selectedWarehouse.currentLoad || 0} / {selectedWarehouse.capacity || 100}</span>
                                        </div>
                                        <div className="progress" style={{ height: '8px' }}>
                                            <div className={`progress-bar ${loadPercent >= 90 ? 'bg-danger' : loadPercent >= 75 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${loadPercent}%` }}></div>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })()}

                        <div className="table-responsive">
                            <table className="table table-dark table-hover text-white mb-0 align-middle">
                                <thead>
                                    <tr>
                                        <th>Tracking #</th>
                                        <th>Current Status</th>
                                        <th>Action (Accept)</th>
                                        <th>Update Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shipments.map(s => (
                                        <tr key={s.id}>
                                            <td><code>{s.trackingNumber}</code></td>
                                            <td><span className="badge bg-secondary">{s.status}</span></td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-light" onClick={() => handleAccept(s.id)}>Accept</button>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <select className="form-select form-select-sm" style={{width: '150px'}} onChange={e => setStatusData({...statusData, [s.id]: {...statusData[s.id], status: e.target.value}})}>
                                                        <option value="">Select...</option>
                                                        <option value="IN_WAREHOUSE">In Warehouse</option>
                                                        <option value="IN_TRANSIT">In Transit</option>
                                                    </select>
                                                    <input type="text" className="form-control form-control-sm" placeholder="Location" style={{width: '150px'}} onChange={e => setStatusData({...statusData, [s.id]: {...statusData[s.id], location: e.target.value}})} />
                                                    <button className="btn btn-sm btn-primary" onClick={() => handleUpdateStatus(s.id)}>Update</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {shipments.length === 0 && <tr><td colSpan="4" className="text-center text-muted py-3">No shipments found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WarehouseDashboard;
