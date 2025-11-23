import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import Popup from "../layouts/Popup/popup";

export default function Admin() {
  // --- ข้อมูลหลัก ---
  const [overview, setOverview] = useState({});
  const [buildings, setBuildings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  // --- State สำหรับระบบ Assign Technician ---
  const [assignedTech, setAssignedTech] = useState("");
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [open, setOpen] = useState(false);

  // --- State สำหรับระบบ Change Status ---
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState("");
  const [statusRequestId, setStatusRequestId] = useState(null);

  // --- State สำหรับระบบ Search & Filter (ส่วนที่เพิ่มใหม่) ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegion, setFilterRegion] = useState("All");
  const [filterType, setFilterType] = useState("All");

  const navigate = useNavigate();

  // --- Fetch Data ---
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch("http://localhost:3000/api/admin/overview", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setOverview(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch("http://localhost:3000/api/admin/buildings", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setBuildings(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch("http://localhost:3000/api/admin/requests", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch("http://localhost:3000/api/admin/users/technician", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setTechnicians(data))
      .catch((err) => console.log(err));
  }, []);

  // --- Helper Functions ---
  const getStatusClass = (status) => {
    if (status === "active") return "status status--green";
    if (status === "inactive") return "status status--red";
    return "status";
  };

  const logOut = () => {
    const confirmLogout = window.confirm("คุณแน่ใจว่าจะออกจากระบบหรือไม่?");
    if (confirmLogout) {
      localStorage.removeItem("authToken");
      navigate("/login");
    }
  };

  // --- Assign Technician Logic ---
  const assignTech = async (e) => {
    e.preventDefault();
    if (!assignedTech || !currentRequestId) {
      alert("Please select a technician");
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/request/${currentRequestId}/assign`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ assignedEmployee: assignedTech }),
        }
      );

      if (!res.ok) throw new Error("Failed to assign technician");

      const data = await res.json();
      alert("Technician assigned successfully!");
      setOpen(false);
      setAssignedTech("");
      setCurrentRequestId(null);

      setRequests((prev) =>
        prev.map((req) =>
          req._id === currentRequestId
            ? { ...req, assignedEmployee: data.assignedEmployee }
            : req
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error assigning technician");
    }
  };

  // --- Change Status Logic ---
  const changeStatusSubmit = async (e) => {
    e.preventDefault();
    if (!statusRequestId) return;
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(
        `http://localhost:3000/api/requests/${statusRequestId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: statusValue }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update status");
      }
      setRequests((prev) =>
        prev.map((r) =>
          r._id === statusRequestId ? { ...r, status: statusValue } : r
        )
      );
      setStatusOpen(false);
      setStatusRequestId(null);
      setStatusValue("");
      alert("Status updated");
    } catch (err) {
      console.error(err);
      alert("Error updating status: " + err.message);
    }
  };

  // =========================================
  // --- Filter Logic (ส่วนที่คำนวณ) ---
  // =========================================

  // 1. หาค่า Region ที่ไม่ซ้ำกันจากข้อมูลที่มีอยู่จริง
  const uniqueRegions = [
    ...new Set(buildings.map((b) => b.region).filter((r) => r)),
  ];

  // 2. หาค่า Type ที่ไม่ซ้ำกันจากข้อมูลที่มีอยู่จริง
  const uniqueTypes = [
    ...new Set(buildings.map((b) => b.type).filter((t) => t)),
  ];

  // 3. กรองข้อมูลตาม Search, Region และ Type
  const filteredBuildings = buildings.filter((b) => {
    // Filter by Search (ชื่อตึก หรือ ชื่อเจ้าของ)
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = (b.name || "").toLowerCase().includes(searchLower);
    const ownerMatch = (b.owner?.fullName || "").toLowerCase().includes(searchLower);
    const isSearchMatch = nameMatch || ownerMatch;

    // Filter by Region
    const isRegionMatch = filterRegion === "All" || b.region === filterRegion;

    // Filter by Type
    const isTypeMatch = filterType === "All" || b.type === filterType;

    return isSearchMatch && isRegionMatch && isTypeMatch;
  });

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
            <span className="notif-badge">{overview.notifications}</span>
          </div>
          <button
            className="btn-logout"
            type="button"
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
          <div className="summary-card">
            <div className="summary-value">{overview.users}</div>
            <div className="summary-title">Users</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">{overview.requests}</div>
            <div className="summary-title">Service requests</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">{overview.buildings}</div>
            <div className="summary-title">Buildings</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">{overview.technicians}</div>
            <div className="summary-title">Technicians</div>
          </div>
        </section>

        <section className="pending-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Pending Requests</h2>
              <p className="section-desc">
                Service requests waiting for assignment
              </p>
            </div>
            <span className="pending-badge">{overview.requests} Pending</span>
          </div>

          <div className="requests-list">
            {requests.map((req, idx) => (
              <article className="request-card" key={idx}>
                <div className="request-left-border" aria-hidden="true" />
                <div className="request-content">
                  <h3 className="request-building">{req.building.name}</h3>
                  <div className="request-tags">
                    <span className="tag tag--priority">{req.priority}</span>
                    <span className="tag tag--category">{req.requestType}</span>
                  </div>
                  <p className="request-title">{req.title}</p>
                  <p className="request-desc">{req.description}</p>
                  <div className="request-footer">
                    <span className="request-meta">
                      Requested by {req.user.fullName} •{" "}
                      {new Date(req.createdAt).toLocaleString()}
                    </span>
                    <p className="request-meta">
                      technician assigned:{" "}
                      {req.assignedEmployee
                        ? req.assignedEmployee.fullName
                        : "Not assigned"}
                    </p>
                  </div>
                </div>

                <div className="request-action">
                  <button
                    className="btn-assign"
                    type="button"
                    onClick={() => {
                      setOpen(true);
                      setCurrentRequestId(req._id);
                    }}
                  >
                    Assign Technician
                  </button>

                  <button
                    className="btn-assign"
                    type="button"
                    onClick={() => {
                      setStatusOpen(true);
                      setStatusRequestId(req._id);
                      setStatusValue(req.status || "pending");
                    }}
                  >
                    Change Status
                  </button>
                </div>
              </article>
            ))}
          </div>
          
          {/* Popup: Assign Technician */}
          <Popup isOpen={open} onClose={() => setOpen(false)}>
            <h2>Assign Technician</h2>
            <form onSubmit={assignTech}>
              <label>
                Technician:
                <select
                  value={assignedTech}
                  onChange={(e) => setAssignedTech(e.target.value)}
                >
                  <option value="">-- Select Technician --</option>
                  {technicians.map((tech) => (
                    <option key={tech._id} value={tech._id}>
                      {tech.fullName}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">Assign</button>
            </form>
          </Popup>

          {/* Popup: Change Status */}
          <Popup isOpen={statusOpen} onClose={() => setStatusOpen(false)}>
            <h2>Change Request Status</h2>
            <form onSubmit={changeStatusSubmit}>
              <label>
                Status:
                <select
                  value={statusValue}
                  onChange={(e) => setStatusValue(e.target.value)}
                >
                  <option value="pending">pending</option>
                  <option value="assigned">assigned</option>
                  <option value="in_progress">in_progress</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </label>
              <div style={{ marginTop: 12 }}>
                <button type="submit">Update</button>
                <button type="button" onClick={() => setStatusOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </Popup>
        </section>

        <section className="all-buildings-section">
          <div className="buildings-card">
            <div className="card-header">
              <div>
                <h2 className="card-title">All Buildings</h2>
                <p className="card-desc">
                  Manage and monitor all building installations
                </p>
              </div>
            </div>

            {/* --- ส่วน Toolbar สำหรับ Filter --- */}
            <div className="toolbar">
              <div className="search-box">
                <span className="search-icon" aria-hidden="true">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search buildings or owners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filters">
                {/* Region Filter */}
                <select
                  aria-label="Regions"
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                >
                  <option value="All">All Regions</option>
                  {uniqueRegions.map((region, idx) => (
                    <option key={idx} value={region}>
                      {region}
                    </option>
                  ))}
                </select>

                {/* Type Filter */}
                <select
                  aria-label="Types"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  {uniqueTypes.map((type, idx) => (
                    <option key={idx} value={type}>
                      {type}
                    </option>
                  ))}
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
                  {/* วนลูป filteredBuildings แทน buildings เดิม */}
                  {filteredBuildings.length > 0 ? (
                    filteredBuildings.map((b, idx) => (
                      <tr key={idx}>
                        <td className="cell-building">
                          <div className="building-name">{b.name}</div>
                          <div className="building-owner">
                            {b.owner?.fullName ?? "No owner"}
                          </div>
                        </td>
                        <td>{b.region}</td>
                        <td>{b.type}</td>
                        <td>{b.floor}</td>
                        <td>{b.elevator?.length ?? 0}</td>
                        <td>
                          <span className={getStatusClass(b.status)}>
                            {b.status}
                          </span>
                        </td>
                        <td>{b.maintenanceStatus}</td>
                        <td>
                          <button
                            className="btn-view"
                            type="button"
                            onClick={() => navigate(`/customer/building/${b._id}`)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                        No buildings found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}