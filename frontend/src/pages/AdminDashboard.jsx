import React, { useState, useEffect } from 'react';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, ComposedChart, Line, Legend } from 'recharts';

const AdminDashboard = () => {
    const [shipments, setShipments] = useState([]);
    const [assignData, setAssignData] = useState({ shipmentId: '', agentId: '' });
    const [analytics, setAnalytics] = useState(null);
    
    // New states for User and Warehouse lists
    const [users, setUsers] = useState([]);
    const [warehouses, setWarehouses] = useState([]);

    useEffect(() => {
        fetchShipments();
        fetchAnalytics();
        fetchUsers();
        fetchWarehouses();
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

    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/users'); // Routes to .NET Service automatically via api.js
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users", err);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const res = await api.get('/admin/warehouses'); // Routes to Java Backend
            setWarehouses(res.data);
        } catch (err) {
            console.error("Error fetching warehouses", err);
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

    const realMonthlyData = React.useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const map = {};
        months.forEach(m => map[m] = { name: m, revenue: 0, shipments: 0 });

        shipments.forEach(s => {
            if (s.createdAt) {
                const date = new Date(s.createdAt);
                const monthName = months[date.getMonth()];
                map[monthName].shipments += 1;
                map[monthName].revenue += 15 + ((s.weight || 10) * 5); 
            }
        });
        
        const currentMonthIndex = new Date().getMonth();
        // Show last 6 months up to current
        const startIndex = Math.max(0, currentMonthIndex - 5);
        return months.slice(startIndex, currentMonthIndex + 1).map(m => map[m]);
    }, [shipments]);

    const realStatusData = React.useMemo(() => {
        let delivered = 0, transit = 0, pending = 0;
        shipments.forEach(s => {
            if (s.status === 'DELIVERED') delivered++;
            else if (s.status === 'IN_TRANSIT' || s.status === 'IN TRANSIT') transit++;
            else pending++;
        });
        return [
            { name: 'Delivered', value: delivered, color: '#10b981' },
            { name: 'In Transit', value: transit, color: '#3b82f6' },
            { name: 'Pending', value: pending, color: '#f59e0b' },
        ].filter(d => d.value > 0);
    }, [shipments]);

    const realFreightData = React.useMemo(() => {
        const map = {};
        shipments.forEach(s => {
            if (s.deliveryAddress) {
                // simple heuristic to get region from address
                const parts = s.deliveryAddress.split(',');
                const region = parts.length > 1 ? parts[parts.length - 1].trim() : s.deliveryAddress.trim();
                map[region] = (map[region] || 0) + (s.weight || 10);
            }
        });
        return Object.keys(map).slice(0, 6).map(region => ({ country: region, volume: map[region] }));
    }, [shipments]);

    return (
        <div className="container mt-5 animate-fade-in mb-5">
            <h2 className="fw-bold mb-4">Admin Dashboard</h2>

            {/* KPI Cards */}
            {analytics && (
                <div className="row g-4 mb-4">
                    <div className="col-md-4">
                        <div className="card glass-panel p-3 text-center border-top border-primary border-4 shadow-sm">
                            <h5 className="text-muted text-uppercase small fw-bold tracking-wider">Total Shipments</h5>
                            <h2 className="fw-bold text-primary mb-0">{analytics.totalShipments}</h2>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card glass-panel p-3 text-center border-top border-warning border-4 shadow-sm">
                            <h5 className="text-muted text-uppercase small fw-bold tracking-wider">Active Deliveries</h5>
                            <h2 className="fw-bold text-warning mb-0">{analytics.activeDeliveries}</h2>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card glass-panel p-3 text-center border-top border-success border-4 shadow-sm">
                            <h5 className="text-muted text-uppercase small fw-bold tracking-wider">Estimated Revenue</h5>
                            <h2 className="fw-bold text-success mb-0">${analytics.estimatedRevenue}</h2>
                        </div>
                    </div>
                </div>
            )}

            {/* Rich Analytics Charts Row 1 */}
            <div className="row g-4 mb-4">
                <div className="col-lg-8">
                    <div className="card glass-panel p-4 shadow-sm" style={{ height: '350px' }}>
                        <h5 className="fw-bold mb-3 text-accent text-uppercase small">Monthly Revenue & Shipments Trend</h5>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={realMonthlyData}>
                                <XAxis dataKey="name" stroke="#ccc" fontSize={12} />
                                <YAxis yAxisId="left" stroke="#ccc" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                <YAxis yAxisId="right" orientation="right" stroke="#ccc" fontSize={12} />
                                <Tooltip wrapperStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                                <Legend />
                                <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Revenue ($)" radius={[4, 4, 0, 0]} barSize={30} />
                                <Line yAxisId="right" type="monotone" dataKey="shipments" stroke="#f59e0b" strokeWidth={3} name="Shipments" dot={{ r: 4 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="col-lg-4">
                    <div className="card glass-panel p-4 shadow-sm" style={{ height: '350px' }}>
                        <h5 className="fw-bold mb-3 text-accent text-uppercase small">Shipment Status Breakdown</h5>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={realStatusData} 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={70} 
                                    outerRadius={100} 
                                    paddingAngle={5} 
                                    dataKey="value"
                                >
                                    {realStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip wrapperStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Rich Analytics Charts Row 2 */}
            <div className="row g-4 mb-4">
                <div className="col-12">
                    <div className="card glass-panel p-4 shadow-sm" style={{ height: '300px' }}>
                        <h5 className="fw-bold mb-3 text-accent text-uppercase small">Freight Volume by Region</h5>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={realFreightData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <XAxis dataKey="country" stroke="#ccc" fontSize={12} />
                                <YAxis stroke="#ccc" fontSize={12} />
                                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} wrapperStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none' }} />
                                <Bar dataKey="volume" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Volume (TEU)">
                                    {realFreightData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index % 6]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Management Section - Shipments & Agents */}
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="card glass-panel p-4 h-100 shadow-sm border-top border-primary border-4">
                        <h5 className="fw-bold mb-4 text-accent text-uppercase small">Assign Delivery Agent</h5>
                        <form onSubmit={handleAssign}>
                            <div className="mb-3">
                                <label className="form-label text-muted small fw-bold">Shipment ID</label>
                                <input type="number" className="form-control form-control-lg bg-light border-0" placeholder="e.g. 101" value={assignData.shipmentId} onChange={e => setAssignData({...assignData, shipmentId: e.target.value})} required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-muted small fw-bold">Select Delivery Agent</label>
                                <select 
                                    className="form-select form-select-lg bg-light border-0" 
                                    value={assignData.agentId} 
                                    onChange={e => setAssignData({...assignData, agentId: e.target.value})} 
                                    required
                                >
                                    <option value="">-- Choose Agent --</option>
                                    {users.filter(u => u.role === 'DELIVERY_AGENT').map(u => (
                                        <option key={u.id} value={u.id}>[ID: {u.id}] {u.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold">Assign Agent</button>
                        </form>
                    </div>
                </div>
                
                <div className="col-md-8">
                    <div className="card glass-panel p-0 h-100 shadow-sm border-top border-primary border-4 overflow-hidden">
                        <div className="p-4 border-bottom">
                            <h5 className="fw-bold mb-0 text-accent text-uppercase small">Recent Shipments Log</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover mb-0 border-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-4 py-3 border-0 text-muted small text-uppercase">ID</th>
                                        <th className="px-4 py-3 border-0 text-muted small text-uppercase">Tracking #</th>
                                        <th className="px-4 py-3 border-0 text-muted small text-uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shipments.map(s => (
                                        <tr key={s.id}>
                                            <td className="px-4 py-3 border-bottom">{s.id}</td>
                                            <td className="px-4 py-3 border-bottom"><code className="text-primary">{s.trackingNumber}</code></td>
                                            <td className="px-4 py-3 border-bottom">
                                                <span className={`badge px-3 py-2 ${s.status === 'DELIVERED' ? 'bg-success' : s.status === 'IN TRANSIT' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                                                    {s.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {shipments.length === 0 && <tr><td colSpan="3" className="text-center text-muted py-5 border-0">No recent shipments found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEW: System Users & Warehouse Infrastructure */}
            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card glass-panel p-0 h-100 shadow-sm border-top border-info border-4 overflow-hidden">
                        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0 text-info text-uppercase small">System Users</h5>
                            <span className="badge bg-info text-dark">{users.length} Total</span>
                        </div>
                        <div className="table-responsive" style={{ maxHeight: '350px' }}>
                            <table className="table table-hover mb-0 border-0">
                                <thead className="table-light sticky-top">
                                    <tr>
                                        <th className="px-4 py-3 border-0 text-muted small text-uppercase">ID</th>
                                        <th className="px-4 py-3 border-0 text-muted small text-uppercase">Name</th>
                                        <th className="px-4 py-3 border-0 text-muted small text-uppercase">Role</th>
                                        <th className="px-4 py-3 border-0 text-muted small text-uppercase">Phone</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td className="px-4 py-3 border-bottom text-muted">#{u.id}</td>
                                            <td className="px-4 py-3 border-bottom">
                                                <div className="fw-bold">{u.name}</div>
                                                <div className="small text-muted">{u.email}</div>
                                            </td>
                                            <td className="px-4 py-3 border-bottom">
                                                <span className={`badge ${u.role === 'Admin' ? 'bg-danger' : u.role === 'Customer' ? 'bg-success' : 'bg-secondary'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 border-bottom">{u.phone}</td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && <tr><td colSpan="4" className="text-center text-muted py-4 border-0">Loading users...</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card glass-panel p-0 h-100 shadow-sm border-top border-warning border-4 overflow-hidden">
                        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0 text-warning text-uppercase small">Warehouse Infrastructure</h5>
                            <span className="badge bg-warning text-dark">{warehouses.length} Active</span>
                        </div>
                        <div className="table-responsive" style={{ maxHeight: '350px' }}>
                            <table className="table table-hover mb-0 border-0">
                                <thead className="table-light sticky-top">
                                    <tr>
                                        <th className="px-4 py-3 border-0 text-muted small text-uppercase">Name & Location</th>
                                        <th className="px-4 py-3 border-0 text-muted small text-uppercase">Manager ID</th>
                                        <th className="px-4 py-3 border-0 text-muted small text-uppercase">Capacity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {warehouses.map(w => (
                                        <tr key={w.id}>
                                            <td className="px-4 py-3 border-bottom">
                                                <div className="fw-bold">{w.warehouseName}</div>
                                                <div className="small text-muted"><i className="bi bi-geo-alt-fill"></i> {w.city}</div>
                                            </td>
                                            <td className="px-4 py-3 border-bottom">
                                                <code>#{w.managerId}</code>
                                            </td>
                                            <td className="px-4 py-3 border-bottom">
                                                <div className="d-flex align-items-center gap-2">
                                                    <span>{w.currentLoad} / {w.capacity}</span>
                                                    <div className="progress flex-grow-1" style={{height: '6px'}}>
                                                        <div 
                                                            className={`progress-bar ${w.currentLoad >= w.capacity ? 'bg-danger' : 'bg-success'}`} 
                                                            style={{width: `${(w.currentLoad / w.capacity) * 100}%`}}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {warehouses.length === 0 && <tr><td colSpan="3" className="text-center text-muted py-4 border-0">Loading warehouses...</td></tr>}
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
