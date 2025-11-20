import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BuildingDetails.css';

function BuildingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [buildingsData, setBuildingsData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() =>{
        const token = localStorage.getItem('authToken');
        fetch(`http://localhost:3000/api/buildings/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            if (!res.ok) throw new Error('Fetch API failed');
            return res.json();
        })
        .then((data) => {
            setBuildingsData(data);
        })
        .catch((err) => {
            console.log(err);
        });
    },[])

   

    const handleChange = (field, value) => {
        setBuildingsData({ ...buildingsData, [field]: value });
    };

    const handleSave = async () => {
  const token = localStorage.getItem('authToken');

  try {
    const res = await fetch(`http://localhost:3000/api/buildings/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(buildingsData)
    });

    if (!res.ok) throw new Error('Failed to save changes');

    const updated = await res.json();
    setBuildingsData(updated);
    setSaved(true);
    setIsEditing(false);
    // เพิ่มเวลา 1-2 วินาทีแล้ว reload หน้า
        setTimeout(() => {
            setSaved(false);
            window.location.reload(); // รีโหลดหน้า
        }, 1000);
  } catch (err) {
    console.error(err);
    alert('Error saving changes');
  }
};

    const handleBacktoDashboard = () => {
        const role = localStorage.getItem('role');
        if (role === 'admin') {
            navigate('/admin');
            setTimeout(() => {
            window.location.reload(); // รีโหลดหน้า
        }, 500);
        }
        if (role === 'user') {
            navigate('/customer');
            setTimeout(() => {
            window.location.reload(); // รีโหลดหน้า
        }, 500);
        }
        if (role === 'employee') {
            navigate('/employee');
            setTimeout(() => {
            window.location.reload(); // รีโหลดหน้า
        }, 500);
        }
    };

    const handleLogout = () => {
        const windowConfirm = window.confirm("คุณแน่ใจว่าจะออกจากระบบหรือไม่?");
        if (windowConfirm) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('role');
            navigate('/login');
        }
    }

    return (
        <div className="bd-container">
            {/* Header */}
            <header className="bd-header">
                <div className="bd-header-left">
                    <button className="bd-back-btn" onClick={handleBacktoDashboard}>
                        ← Back to Buildings
                    </button>
                    <div className="bd-header-title">
                        <h1>{buildingsData.name}</h1>
                    </div>
                </div>
                <div className="bd-header-right">
                    {saved && <span className="bd-saved-msg">✓ Saved</span>}
                    <button className="bd-logout-btn" onClick={handleLogout}>Logout</button>
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
                                    value={buildingsData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    disabled={!isEditing}
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Region</label>
                                <input
                                    type="text"
                                    value={buildingsData.region}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    disabled={!isEditing}
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    value={buildingsData.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    disabled={!isEditing}
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Type</label>
                                <input
                                    type="text"
                                    value={buildingsData.type}
                                    onChange={(e) => handleChange('type', e.target.value)}
                                    disabled={!isEditing}
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Floors</label>
                                <input
                                    type="number"
                                    value={buildingsData.floor}
                                    onChange={(e) => handleChange('floors', parseInt(e.target.value))}
                                    disabled={!isEditing}
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Elevators</label>
                                <input
                                    type="number"
                                    value={buildingsData.elevator}
                                    onChange={(e) => handleChange('elevators', parseInt(e.target.value))}
                                    disabled
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Status</label>
                                <select
                                    value={buildingsData.status || 'Active'}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                    disabled={!isEditing}
                                    className="bd-input"
                                >
                                    <option>active</option>
                                    <option>inactive</option>
                                </select>
                            </div>
                            <div className="bd-form-group">
                                <label>Manager</label>
                                <input
                                    type="text"
                                    value={buildingsData.owner?.fullName?? ''}
                                    onChange={(e) => handleChange('manager', e.target.value)}
                                    disabled={!isEditing}
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    value={buildingsData.owner?.phone?? ''}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    disabled={!isEditing}
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={buildingsData.owner?.email?? ''}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    disabled
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Last Maintenance</label>
                                <input
                                    type="date"
                                    value={buildingsData.lastMaintenanceDate}
                                    onChange={(e) => handleChange('lastMaintenance', e.target.value)}
                                    disabled
                                    className="bd-input"
                                />
                            </div>
                            <div className="bd-form-group">
                                <label>Next Maintenance</label>
                                <input
                                    type="date"
                                    value={buildingsData.nextMaintenanceDate}
                                    onChange={(e) => handleChange('nextMaintenance', e.target.value)}
                                    disabled
                                    className="bd-input"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bd-section">
                    <h2>Status Badge</h2>
                    <div className="bd-status-display">
                        <span className={`bd-status-badge bd-status`}>
                            {buildingsData.status}
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
