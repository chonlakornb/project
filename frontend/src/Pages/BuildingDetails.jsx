import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BuildingDetails.css";

function BuildingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [buildingsData, setBuildingsData] = useState({
    name: "",
    region: "",
    address: "",
    type: "",
    floor: "",
    // keep elevator as an array to allow .map and length safely
    elevator: [],
    status: "active",
    owner: {
      fullName: "",
      phone: "",
      email: "",
    },
    lastMaintenanceDate: "",
    nextMaintenanceDate: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch(`http://localhost:3000/api/buildings/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fetch API failed");
        return res.json();
      })
      .then((data) => {
        setBuildingsData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch(`http://localhost:3000/api/users/reports`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fetch API failed");
        return res.json();
      })
      .then((data) => {
        setReports(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(()=> {
    const token = localStorage.getItem("authToken");
    fetch(`http://localhost:3000/api/users/requests`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fetch API failed");
        return res.json();
      })
      .then((data) => {
        setRequests(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (field, value) => {
    // allow updating nested owner fields by passing an object as value
    if (field === "owner" && typeof value === "object" && value !== null) {
      setBuildingsData({
        ...buildingsData,
        owner: { ...buildingsData.owner, ...value },
      });
      return;
    }
    setBuildingsData({ ...buildingsData, [field]: value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch(`http://localhost:3000/api/buildings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buildingsData),
      });

      if (!res.ok) throw new Error("Failed to save changes");

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
      alert("Error saving changes");
    }
  };

  const handleBacktoDashboard = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/admin");
      setTimeout(() => {
        window.location.reload(); // รีโหลดหน้า
      }, 500);
    }
    if (role === "user") {
      navigate("/customer");
      setTimeout(() => {
        window.location.reload(); // รีโหลดหน้า
      }, 500);
    }
    if (role === "employee") {
      navigate("/employee");
      setTimeout(() => {
        window.location.reload(); // รีโหลดหน้า
      }, 500);
    }
  };

  const handleLogout = () => {
    const windowConfirm = window.confirm("คุณแน่ใจว่าจะออกจากระบบหรือไม่?");
    if (windowConfirm) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      navigate("/login");
    }
  };

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
          <button className="bd-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="bd-main">
        <section className="bd-section">
          <div className="bd-section-header">
            <h2>Building Information</h2>
            <button
              className={`bd-btn ${
                isEditing ? "bd-btn-secondary" : "bd-btn-primary"
              }`}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? "💾 Save Changes" : "✏️ Edit"}
            </button>
          </div>

          <div className="bd-info-card">
            <div className="bd-form-grid">
              <div className="bd-form-group">
                <label>Building Name</label>
                <input
                  type="text"
                  value={buildingsData.name ?? ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={!isEditing}
                  className="bd-input"
                />
              </div>
              <div className="bd-form-group">
                <label>Region</label>
                <input
                  type="text"
                  value={buildingsData.region ?? ""}
                  onChange={(e) => handleChange("location", e.target.value)}
                  disabled={!isEditing}
                  className="bd-input"
                />
              </div>
              <div className="bd-form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={buildingsData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  disabled={!isEditing}
                  className="bd-input"
                />
              </div>
              <div className="bd-form-group">
                <label>Type</label>
                <input
                  type="text"
                  value={buildingsData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  disabled={!isEditing}
                  className="bd-input"
                />
              </div>
              <div className="bd-form-group">
                <label>Floors</label>
                <input
                  type="number"
                  value={buildingsData.floor ?? ""}
                  onChange={(e) =>
                    handleChange(
                      "floor",
                      e.target.value === "" ? "" : parseInt(e.target.value, 10)
                    )
                  }
                  disabled={!isEditing}
                  className="bd-input"
                />
              </div>
              <div className="bd-form-group">
                <label>Elevators</label>
                <input
                  type="number"
                   // show count of elevators; keep controlled by providing '' fallback
                  value={
                    Array.isArray(buildingsData.elevator)
                      ? buildingsData.elevator.length
                      : buildingsData.elevator ?? ""
                  }
                  // read-only count — no onChange
                  disabled
                  className="bd-input"
                />
              </div>
              <div className="bd-form-group">
                <label>Status</label>
                <select
                  value={buildingsData.status || "Active"}
                  onChange={(e) => handleChange("status", e.target.value)}
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
                  value={buildingsData.owner?.fullName ?? ""}
                  onChange={(e) =>
                    handleChange("owner", { fullName: e.target.value })
                  }
                  disabled={!isEditing}
                  className="bd-input"
                />
              </div>
              <div className="bd-form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={buildingsData.owner?.phone ?? ""}
                  onChange={(e) =>
                    handleChange("owner", { phone: e.target.value })
                  }
                  disabled={!isEditing}
                  className="bd-input"
                />
              </div>
              <div className="bd-form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={buildingsData.owner?.email ?? ""}
                  onChange={(e) =>
                    handleChange("owner", { email: e.target.value })
                  }
                  disabled
                  className="bd-input"
                />
              </div>
              <div className="bd-form-group">
                <label>Last Maintenance</label>
                <input
                  type="date"
                  value={buildingsData.lastMaintenanceDate ?? ""}
                  onChange={(e) =>
                    handleChange("lastMaintenanceDate", e.target.value)
                  }
                  disabled
                  className="bd-input"
                />
              </div>
              <div className="bd-form-group">
                <label>Next Maintenance</label>
                <input
                  type="date"
                  value={buildingsData.nextMaintenanceDate ?? ""}
                  onChange={(e) =>
                    handleChange("nextMaintenanceDate", e.target.value)
                  }
                  disabled
                  className="bd-input"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bd-section">
          <h2>Elevator Lists</h2>
          {buildingsData.elevator && buildingsData.elevator.length > 0 ? (
            buildingsData.elevator.map((elevator) => (
              <div
                key={elevator._id || elevator.id}
                className="bd-elevator-card"
              >
                <h3>{elevator.name}</h3>
                <p>Model: {elevator.model || "N/A"}</p>
                <p>Capacity: {elevator.capacity || "N/A"}</p>
                <p>
                  Floors served:{" "}
                  {Array.isArray(elevator.floorsServed)
                    ? elevator.floorsServed.length
                    : elevator.floorsServed !== undefined &&
                      elevator.floorsServed !== null
                    ? parseInt(elevator.floorsServed, 10) || "N/A"
                    : "N/A"}
                </p>
                <p>Status: {elevator.status || "N/A"}</p>
                <p>Installed At: {elevator.installedAt || "N/A"}</p>
              </div>
            ))
          ) : (
            <p>No elevators available</p>
          )}
        </section >

        <section className="bd-section">
          <h2>Request</h2>
          {requests.map((request) => (
            <div key={request._id || request.id} className="bd-request-card">
              <h3>Request Title:&nbsp;{request.title}</h3>
              <p>Description: {request.description || "N/A"}</p>
              <p>Building: {request.building?.name || "N/A"}</p>
              <p>Status: {request.status || "N/A"}</p>
              <p>Requested At: {new Date(request.createdAt).toLocaleString() || "N/A"}</p>
              <br />
            </div>
          ))}
        </section>

        <section className="bd-section">
          <h2>Report Lists</h2>
          {reports.map((report) => (
            <div key={report._id} className="bd-report-card">
              <h3>{report.content}</h3>
              <p>Building: {report.building?.name || "N/A"}</p>
              <p>Status: {report.status || "N/A"}</p>
              <p>Reported At: {new Date(report.createdAt).toLocaleString() || "N/A"}</p>
              <br />
            </div>
          ))}
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
            <button className="bd-btn bd-btn-primary">
              Request Technician
            </button>
            <button className="bd-btn bd-btn-secondary">Report Issue</button>
            <button className="bd-btn bd-btn-secondary">View History</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BuildingDetails;
