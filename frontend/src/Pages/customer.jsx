import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Popup from "../layouts/Popup/popup";

import "./customer.css";

function CustomerPage() {
  const navigate = useNavigate();

  const [overview, setOverview] = useState({});
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requestType, setRequestType] = useState("installation");
  const [requests, setRequests] = useState([]);
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [bName, setBName] = useState("");
  const [bAddress, setBAddress] = useState("");
  const [bRegion, setBRegion] = useState("");
  const [bType, setBType] = useState("");
  const [bFloor, setBFloor] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch("http://localhost:3000/api/users/overview", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fetch API failed");
        return res.json();
      })
      .then((data) => {
        setOverview(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch("http://localhost:3000/api/buildings", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fetch API failed");
        return res.json();
      })
      .then((data) => {
        setBuildings(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const submitRequest = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!selectedBuilding || !requestType || !title || !description) {
        alert("Please fill in all required fields");
        return;
    }

    try {
        const token = localStorage.getItem('authToken');

        const res = await fetch('http://localhost:3000/api/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                building: selectedBuilding,
                requestType: requestType,
                title: title,
                description: description
            })
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Request failed");
        }

        const data = await res.json();
        setRequests(prev => [...prev, data]);
        alert("Request submitted successfully!");

        // Reset form
        setSelectedBuilding("");
        setRequestType("installation");
        setTitle("");
        setDescription("");
        setOpen(false);
        setTimeout(() => {
            window.location.reload(); // รีโหลดหน้า
        }, 1000);

    } catch (error) {
        console.error("Error while submitting request:", error);
        alert("Error submitting request: " + error.message);
    }
};

const submitAddBuilding = async (e) => {
    e.preventDefault();
    if (!bName || !bAddress) {
      alert("Please fill in required fields");
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
     const res = await fetch("http://localhost:3000/api/buildings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: bName,
          address: bAddress,
          region: bRegion,
          type: bType,
          floor: bFloor,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Create building failed");
      }
      const data = await res.json();
      // backend returns { message, building }
      const created = data.building || data;
      setBuildings((prev) => [...prev, created]);
      alert("Building created successfully");
      setAddOpen(false);
      setBName("");
      setBAddress("");
      setBRegion("");
      setBType("");
      setBFloor("");
    } catch (err) {
      console.error(err);
      alert("Error creating building: " + err.message);
    }
  };


  const statusClass = (s) => {
    if (s === "active") return "status status--green";
    if (s === "Installation") return "status status--blue";
    if (s === "inactive") return "status status--red";
    return "status";
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("คุณแน่ใจว่าจะออกจากระบบหรือไม่?");
    if (confirmLogout) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      navigate("/login");
    }
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
            <span className="bell" aria-hidden="true">
              🔔
            </span>
            <span className="notif-badge">{overview.notifications}</span>
          </div>
          <button
            className="btn-logout"
            type="button"
            aria-label="Logout"
            onClick={handleLogout}
          >
            <span className="door" aria-hidden="true">
              🚪
            </span>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="dashboard-label">Dashboard</div>
        <h1 className="page-title">My Buildings</h1>

        <section className="summary-cards">
          <div className="summary-card">
            <div className="summary-value">{overview.notifications}</div>
            <div className="summary-title">Notifications</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">{overview.reports}</div>
            <div className="summary-title">Reports</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">{overview.buildings}</div>
            <div className="summary-title">Buildings</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">{overview.requests}</div>
            <div className="summary-title">Requests</div>
          </div>
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
            <button className="btn-primary" type="button" onClick={() => setAddOpen(true)}>
              Add building
            </button>
            <Popup isOpen={addOpen} onClose={() => setAddOpen(false)}>
              <form onSubmit={submitAddBuilding}>
                <div>
                  <h2>Add Building</h2>
                  <p>Name</p>
                  <input
                    type="text"
                    value={bName}
                    onChange={(e) => setBName(e.target.value)}
                  />
                  <p>Address</p>
                  <input
                    type="text"
                    value={bAddress}
                    onChange={(e) => setBAddress(e.target.value)}
                  />
                  <p>Region</p>
                  <input
                    type="text"
                    value={bRegion}
                    onChange={(e) => setBRegion(e.target.value)}
                  />
                  <p>Type</p>
                  <input
                    type="text"
                    value={bType}
                    onChange={(e) => setBType(e.target.value)}
                  />
                  <p>Floors</p>
                  <input
                    type="number"
                    value={bFloor}
                    onChange={(e) => setBFloor(e.target.value)}
                  />
                  <div style={{ marginTop: 12 }}>
                    <button type="submit">Create</button>
                    <button type="button" onClick={() => setAddOpen(false)}>
                      Cancel
</button>
                  </div>
                </div>
              </form>
            </Popup>
            <button
              className="btn-primary"
              type="button"
              onClick={() => setOpen(true)}
            >
              <span className="wrench" aria-hidden="true">
                🔧
              </span>
              <span>Request Technician</span>
            </button>
            <Popup isOpen={open} onClose={() => setOpen(false)}>
              <form onSubmit={submitRequest}>
                <div>
                  <h2>Request Technician</h2>

                  <p>Choose a building:</p>
                  <select
                    value={selectedBuilding}
                    onChange={(e) => setSelectedBuilding(e.target.value)}
                  >
                    <option value="">---Please select a building---</option>
                    {buildings.map((b, idx) => (
                      <option key={idx} value={b._id}>
                        {b.name} {b.address} Region: {b.region}
                      </option>
                    ))}
                  </select>

                  <p>Request Type:</p>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                  >
                    <option value="installation">Installation</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="repair">Repair</option>
                    <option value="complaint">Complaint</option>
                  </select>

                  <p>Title</p>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <p>Description</p>
                  <textarea
                    value={description}
                    cols="30"
                    rows="10"
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <button type="submit">Submit</button>
                </div>
              </form>
            </Popup>
          </div>
        </section>

        <section className="building-list">
          {buildings.map((b, idx) => (
            <article className="building-card" key={idx}>
              {b.preview && <div className="preview-badge">Preview</div>}

              <div className="building-top">
                <div className="building-icon" aria-hidden="true">
                  🏢
                </div>
                <div className="building-info">
                  <h2 className="building-name">{b.name}</h2>
                  <div className="building-location">{b.address}</div>
                  <div className="building-location">
                    Region:&nbsp;{b.region}
                  </div>
                </div>
              </div>

              <ul className="building-details">
                <li>Type: {b.type}</li>
                <li>Floors: {b.floor}</li>
                <li>Elevators: {b.elevator?.length ?? 0}</li>
              </ul>

              <div className="building-footer">
                <span className={statusClass(b.status)}>{b.status}</span>
                <button
                  className="btn-primary"
                  type="button"
                  onClick={() => navigate(`/customer/building/${b._id}`)}
                >
                  <span className="building" aria-hidden="true">
                    🏢
                  </span>
                  <span>View Building</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default CustomerPage;
