import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyBuildings.css';

function MyBuildings() {
    const navigate = useNavigate();
    const [activeRegion, setActiveRegion] = useState('all');
    const [activeType, setActiveType] = useState('all');

    const summaryStats = [
        { label: 'Total Buildings', value: '5' },
        { label: 'Active Systems', value: '2' },
        { label: 'In Installation', value: '1' },
        { label: 'Need Attention', value: '1' }
    ];

    const buildings = [
        {
            id: 1,
            name: 'Skyline Tower',
            location: 'Downtown',
            type: 'Commercial',
            floors: 45,
            elevators: 8,
            status: 'Active'
        },
        {
            id: 2,
            name: 'Harbor View Residences',
            location: 'Waterfront',
            type: 'Residential',
            floors: 32,
            elevators: 6,
            status: 'Installation'
        },
        {
            id: 3,
            name: 'Tech Hub Complex',
            location: 'Business District',
            type: 'Commercial',
            floors: 28,
            elevators: 5,
            status: 'Problem'
        },
        {
            id: 4,
            name: 'Green Valley Apartments',
            location: 'Suburban',
            type: 'Residential',
            floors: 20,
            elevators: 4,
            status: 'Active'
        },
        {
            id: 5,
            name: 'Riverside Medical Center',
            location: 'Healthcare Zone',
            type: 'Medical',
            floors: 15,
            elevators: 3,
            status: 'Maintenance'
        }
    ];

    const regions = ['All Regions', 'Downtown', 'Waterfront', 'Business District', 'Suburban', 'Healthcare Zone'];
    const types = ['All Types', 'Commercial', 'Residential', 'Medical'];

    const handleBuildingClick = (buildingId) => {
        navigate(`/building/${buildingId}`);
    };

    const handleLogout = () => {
            const confirmLogout = window.confirm("คุณแน่ใจว่าจะออกจากระบบ?");
        if (confirmLogout) {
            localStorage.removeItem('authToken');

         // delay 1 วินาที ก่อน redirect
            setTimeout(() => {
            navigate('/login');
            }, 1000);
        }
    };

    return (
        <div className="ub-container">
            {/* ...existing header... */}
            <header className="ub-header">
                <div className="ub-header-left">
                    <div className="ub-logo-section">
                        <div className="ub-logo-icon">⬆</div>
                        <div className="ub-logo-text">
                            <h2>LiftMan User Portal</h2>
                        </div>
                    </div>
                    <div className="ub-breadcrumb">
                        Dashboard <span>&gt;</span> My Buildings
                    </div>
                </div>
                <div className="ub-header-right">
                    <div className="ub-notification-bell">🔔</div>
                    <button className="ub-logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            {/* ...existing content... */}
            <div className="ub-main">
                <section className="ub-stats-section">
                    <div className="ub-stats-grid">
                        {summaryStats.map((stat, idx) => (
                            <div key={idx} className="ub-stat-card">
                                <div className="ub-stat-label">{stat.label}</div>
                                <div className="ub-stat-value">{stat.value}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="ub-filter-bar">
                    <div className="ub-filter-group">
                        <select className="ub-filter-select" value={activeRegion} onChange={(e) => setActiveRegion(e.target.value)}>
                            {regions.map((region) => (
                                <option key={region} value={region.toLowerCase()}>{region}</option>
                            ))}
                        </select>
                        <select className="ub-filter-select" value={activeType} onChange={(e) => setActiveType(e.target.value)}>
                            {types.map((type) => (
                                <option key={type} value={type.toLowerCase()}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <button className="ub-request-technician-btn">Request Technician</button>
                </section>

                <section className="ub-buildings-section">
                    <div className="ub-buildings-grid">
                        {buildings.map((building) => (
                            <div
                                key={building.id}
                                className="ub-building-card"
                                onClick={() => handleBuildingClick(building.id)}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleBuildingClick(building.id);
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="ub-building-header">
                                    <div className="ub-building-icon">🏢</div>
                                    <div className="ub-building-title">
                                        <h3>{building.name}</h3>
                                        <p className="ub-building-location">{building.location}</p>
                                    </div>
                                </div>

                                <div className="ub-building-details">
                                    <div className="ub-detail-row">
                                        <span className="ub-detail-label">Type:</span>
                                        <span className="ub-detail-value">{building.type}</span>
                                    </div>
                                    <div className="ub-detail-row">
                                        <span className="ub-detail-label">Floors:</span>
                                        <span className="ub-detail-value">{building.floors}</span>
                                    </div>
                                    <div className="ub-detail-row">
                                        <span className="ub-detail-label">Elevators:</span>
                                        <span className="ub-detail-value">{building.elevators}</span>
                                    </div>
                                </div>

                                <div className="ub-building-footer">
                                    <span className={`ub-status-badge ub-status-${building.status.toLowerCase()}`}>
                                        {building.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default MyBuildings;
