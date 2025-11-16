import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BuildingDetails.css';

function BuildingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [saved, setSaved] = useState(false);

    const buildingsData = {
        1: {
            id: 1,
            name: 'Skyline Tower',
            location: 'Downtown',
            address: '123 Main Street, Downtown',
            type: 'Commercial',
            floors: 45,
            elevators: 8,
            status: 'Active',
            manager: 'John Smith',
            phone: '+1 (555) 123-4567',
            email: 'manager@skyline.com',
            lastMaintenance: '2024-11-01',
            nextMaintenance: '2024-12-01'
        },
        2: {
            id: 2,
            name: 'Harbor View Residences',
            location: 'Waterfront',
            address: '456 Harbor Lane, Waterfront',
            type: 'Residential',
            floors: 32,
            elevators: 6,
            status: 'Installation',
            manager: 'Jane Doe',
            phone: '+1 (555) 234-5678',
            email: 'manager@harborview.com',
            lastMaintenance: '2024-10-15',
            nextMaintenance: '2024-11-15'
        }
    };

    const defaultBuilding = buildingsData[id] || buildingsData[1];
    const [building, setBuilding] = useState(defaultBuilding);

    const handleChange = (field, value) => {
        setBuilding({ ...building, [field]: value });
    };

    const handleSave = () => {
        setSaved(true);
        setIsEditing(false);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="bd-container">
            {/* Header */}
            <header className="bd-header">
                <div className="bd-header-left">
                    <button className="bd-back-btn" onClick={() => navigate('/customer')}>
                        ← Back to Buildings
                    </button>
                    <div className="bd-header-title">
                        <h1>{building.name}</h1>
                    </div>
                </div>
                <div className="bd-header-right">
                    {saved && <span className="bd-saved-msg">✓ Saved</span>}
                    <button className="bd-logout-btn">Logout</button>
                </div>
            </header>

            {/* Main Content */}
            <div className="bd-main">
                <section className="bd-section">
                    <div className="bd-section-header">
                        <h2>Building Information</h2>
                        <button
                            className={`bd-btn ${isEditing ? 'bd-btn-secondary' : 'bd-btn-primary'}`}
                            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                        >
                            {isEditing ? '💾 Save Changes' : '✏️ Edit'}
                        </button>
                    </div>

                    <div className="bd-info-card">
                        <div className="bd-form-grid">
                            <div className="bd-form-group">
                                <label>Building Name</label>
                                <input
                                    type="text"
                                    value={building.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    disabled={!isEditing}
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    value={building.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    disabled={!isEditing}
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    value={building.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    disabled={!isEditing}
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Type</label>
                                <input
                                    type="text"
                                    value={building.type}
                                    onChange={(e) => handleChange('type', e.target.value)}
                                    disabled={!isEditing}
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Floors</label>
                                <input
                                    type="number"
                                    value={building.floors}
                                    onChange={(e) => handleChange('floors', parseInt(e.target.value))}
                                    disabled={!isEditing}
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Elevators</label>
                                <input
                                    type="number"
                                    value={building.elevators}
                                    onChange={(e) => handleChange('elevators', parseInt(e.target.value))}
                                    disabled={!isEditing}
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Status</label>
                                <select
                                    value={building.status}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                    disabled={!isEditing}
                                    className="bd-input"
                                >
                                    <option>Active</option>
                                    <option>Installation</option>
                                    <option>Problem</option>
                                    <option>Maintenance</option>
                                </select>
                            </div>
                            <div className="bd-form-group">
                                <label>Manager</label>
                                <input
                                    type="text"
                                    value={building.manager}
                                    onChange={(e) => handleChange('manager', e.target.value)}
                                    disabled={!isEditing}
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    value={building.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    disabled={!isEditing}
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={building.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    disabled={!isEditing}
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Last Maintenance</label>
                                <input
                                    type="date"
                                    value={building.lastMaintenance}
                                    onChange={(e) => handleChange('lastMaintenance', e.target.value)}
                                    disabled={!isEditing}
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Next Maintenance</label>
                                <input
                                    type="date"
                                    value={building.nextMaintenance}
                                    onChange={(e) => handleChange('nextMaintenance', e.target.value)}
                                    disabled={!isEditing}
                                    className="bd-input"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bd-section">
                    <h2>Status Badge</h2>
                    <div className="bd-status-display">
                        <span className={`bd-status-badge bd-status-${building.status.toLowerCase()}`}>
                            {building.status}
                        </span>
                    </div>
                </section>

                <section className="bd-section">
                    <h2>Actions</h2>
                    <div className="bd-actions">
                        <button className="bd-btn bd-btn-primary">Request Technician</button>
                        <button className="bd-btn bd-btn-secondary">Report Issue</button>
                        <button className="bd-btn bd-btn-secondary">View History</button>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default BuildingDetails;
