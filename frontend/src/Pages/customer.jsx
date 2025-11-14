import React from 'react';
import { useNavigate } from 'react-router-dom';
import './customer.css';

function CustomerPage() {
    const navigate = useNavigate();

    // Mock data for summary and buildings
    const summary = [
        { value: '5', title: 'Total Buildings' },
        { value: '2', title: 'Active Systems' },
        { value: '1', title: 'In Installation' },
        { value: '1', title: 'Need Attention' }
    ];

    const buildings = [
        {
            name: 'Skyline Tower',
            location: 'Downtown',
            type: 'Commercial',
            floors: 45,
            elevators: 8,
            status: 'Active',
            preview: false
        },
        {
            name: 'Harbor View Residences',
            location: 'Waterfront',
            type: 'Residential',
            floors: 32,
            elevators: 6,
            status: 'Installation',
            preview: true
        },
        {
            name: 'Tech Hub Complex',
            location: 'Business District',
            type: 'Commercial',
            floors: 28,
            elevators: 5,
            status: 'Problem',
            preview: false
        }
    ];

    const statusClass = (s) => {
        if (s === 'Active') return 'status status--green';
        if (s === 'Installation') return 'status status--blue';
        if (s === 'Problem') return 'status status--red';
        return 'status';
    };

    return (
        <div className="page-root">
            <header className="header">
                <div className="header-left">
                    <div className="logo-box" aria-hidden="true" />
                    <div className="logo-text">
                        <strong>LiftMan</strong>
                        <span className="sub">User Portal</span>
                    </div>
                </div>

                <div className="header-right">
                    <div className="notifications">
                        <span className="bell" aria-hidden="true">🔔</span>
                        <span className="notif-badge">2</span>
                    </div>
                    <button
                        className="btn-logout"
                        type="button"
                        aria-label="Logout"
                        onClick={() => navigate('/login')}
                    >
                        <span className="door" aria-hidden="true">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            <main className="main-content">
                <div className="dashboard-label">Dashboard</div>
                <h1 className="page-title">My Buildings</h1>

                <section className="summary-cards">
                    {summary.map((s, i) => (
                        <div className="summary-card" key={i}>
                            <div className="summary-value">{s.value}</div>
                            <div className="summary-title">{s.title}</div>
                        </div>
                    ))}
                </section>

                <section className="filters-row">
                    <div className="filters-left">
                        <select aria-label="Regions">
                            <option>All Regions</option>
                        </select>
                        <select aria-label="Types">
                            <option>All Types</option>
                        </select>
                    </div>

                    <div className="filters-right">
                        <button className="btn-primary" type="button">
                            <span className="wrench" aria-hidden="true">🔧</span>
                            <span>Request Technician</span>
                        </button>
                    </div>
                </section>

                <section className="building-list">
                    {buildings.map((b, idx) => (
                        <article className="building-card" key={idx}>
                            {b.preview && <div className="preview-badge">Preview</div>}

                            <div className="building-top">
                                <div className="building-icon" aria-hidden="true">🏢</div>
                                <div className="building-info">
                                    <h2 className="building-name">{b.name}</h2>
                                    <div className="building-location">{b.location}</div>
                                </div>
                            </div>

                            <ul className="building-details">
                                <li>Type: {b.type}</li>
                                <li>Floors: {b.floors}</li>
                                <li>Elevators: {b.elevators}</li>
                            </ul>

                            <div className="building-footer">
                                <span className={statusClass(b.status)}>{b.status}</span>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </div>
    );
}

export default CustomerPage;