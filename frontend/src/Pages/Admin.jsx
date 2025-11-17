import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

export default function Admin() {
    const navigate = useNavigate();

    const summary = [
        { value: '5', title: 'Total Buildings' },
        { value: '2', title: 'Active Requests' },
        { value: '1', title: 'Ongoing Tasks' },
        { value: '1', title: 'Problems' },
        { value: '4', title: 'Technicians' }
    ];

    const requests = [
        {
            building: 'Green Valley Apartments',
            priority: 'Medium',
            category: 'Maintenance',
            description: 'Scheduled quarterly maintenance due',
            requester: 'Lisa Anderson',
            date: '10/11/2568 14:20:00'
        }
    ];

    const buildings = [
        { name: 'Skyline Tower', owner: 'Metropolitan Properties', region: 'Downtown', type: 'Commercial', floors: 45, elevators: 8, status: 'Active', maintenance: '12/15/2568' },
        { name: 'Harbor View Residences', owner: 'Coastal Living Inc', region: 'Waterfront', type: 'Residential', floors: 32, elevators: 6, status: 'Installation', maintenance: '01/20/2569' },
        { name: 'Tech Hub Complex', owner: 'Innovation Partners', region: 'Business District', type: 'Commercial', floors: 28, elevators: 5, status: 'Problem', maintenance: '11/10/2568' },
        { name: 'Green Valley Apartments', owner: 'Urban Developments', region: 'Suburbs', type: 'Residential', floors: 18, elevators: 4, status: 'Maintenance', maintenance: '10/25/2568' },
        { name: 'Central Plaza', owner: 'Downtown Ventures', region: 'Downtown', type: 'Mixed-use', floors: 22, elevators: 5, status: 'Active', maintenance: '01/05/2569' }
    ];

    const getStatusClass = (status) => {
        if (status === 'Active') return 'status status--green';
        if (status === 'Installation') return 'status status--blue';
        if (status === 'Problem') return 'status status--red';
        if (status === 'Maintenance') return 'status status--yellow';
        return 'status';
    };

    const logOut = () => {
        const confirmLogout = window.confirm("คุณแน่ใจว่าจะออกจากระบบหรือไม่?");
        if (confirmLogout) {
            localStorage.removeItem('authToken');
            navigate('/login');
            }
        
    };

    return (
        <div className="admin-page">
            <header className="admin-header">
                <div className="header-left">
                    <div className="logo-box" aria-hidden="true" />
                    <div className="logo-text">
                        <strong>LiftMan</strong>
                        <span className="sub">Admin Portal</span>
                    </div>
                </div>

                <div className="header-right">
                    <div className="notifications">
                        <span className="bell" aria-hidden="true">🔔</span>
                        <span className="notif-badge">5</span>
                    </div>
                    <button
                        className="btn-logout"
                        type="button"
                        aria-label="Logout"
                        onClick={logOut}
                    >
                        <span className="door" aria-hidden="true">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            <main className="admin-main">
                <div className="dashboard-label">Dashboard</div>
                <h1 className="page-title">Admin Dashboard</h1>

                <section className="summary-cards">
                    {summary.map((s, i) => (
                        <div className="summary-card" key={i}>
                            <div className="summary-value">{s.value}</div>
                            <div className="summary-title">{s.title}</div>
                        </div>
                    ))}
                </section>

                <section className="pending-section">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Pending Requests</h2>
                            <p className="section-desc">Service requests waiting for assignment</p>
                        </div>
                        <span className="pending-badge">1 Pending</span>
                    </div>

                    <div className="requests-list">
                        {requests.map((req, idx) => (
                            <article className="request-card" key={idx}>
                                <div className="request-left-border" aria-hidden="true" />
                                <div className="request-content">
                                    <h3 className="request-building">{req.building}</h3>
                                    <div className="request-tags">
                                        <span className="tag tag--priority">{req.priority}</span>
                                        <span className="tag tag--category">{req.category}</span>
                                    </div>
                                    <p className="request-desc">{req.description}</p>
                                    <div className="request-footer">
                                        <span className="request-meta">Requested by {req.requester} • {req.date}</span>
                                    </div>
                                </div>

                                <div className="request-action">
                                    <button className="btn-assign" type="button">
                                        Assign Technician
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="all-buildings-section">
                    <div className="buildings-card">
                        <div className="card-header">
                            <div>
                                <h2 className="card-title">All Buildings</h2>
                                <p className="card-desc">Manage and monitor all building installations</p>
                            </div>
                        </div>

                        <div className="toolbar">
                            <div className="search-box">
                                <span className="search-icon" aria-hidden="true">🔍</span>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search buildings or owners..."
                                />
                            </div>

                            <div className="filters">
                                <select aria-label="Regions">
                                    <option>All Regions</option>
                                </select>
                                <select aria-label="Statuses">
                                    <option>All Statuses</option>
                                </select>
                            </div>
                        </div>

                        <div className="table-wrapper">
                            <table className="buildings-table">
                                <thead>
                                    <tr>
                                        <th>Building</th>
                                        <th>Region</th>
                                        <th>Type</th>
                                        <th>Floors</th>
                                        <th>Elevators</th>
                                        <th>Status</th>
                                        <th>Next Maintenance</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {buildings.map((b, idx) => (
                                        <tr key={idx}>
                                            <td className="cell-building">
                                                <div className="building-name">{b.name}</div>
                                                <div className="building-owner">{b.owner}</div>
                                            </td>
                                            <td>{b.region}</td>
                                            <td>{b.type}</td>
                                            <td>{b.floors}</td>
                                            <td>{b.elevators}</td>
                                            <td><span className={getStatusClass(b.status)}>{b.status}</span></td>
                                            <td>{b.maintenance}</td>
                                            <td>
                                                <button className="btn-view" type="button">View Details</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}