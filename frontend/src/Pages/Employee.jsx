import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import Popup from '../layouts/Popup/popup';

import './Employee.css';

function EmployeePage() {
  const [activeTab, setActiveTab] = useState('All');
  const [tasksOverview, setTasksOverview] = useState({
    notifications: 0,
    reports: 0,
    requests: 0,
  });

  const [reportType, setReportType] = useState('installation');
  const [status, setStatus] = useState('in_progress');
  const [content, setContent] = useState('');
  const [sentBuildings, setSentBuildings] = useState(''); // ✅ ID เดียว

  const [report, setReport] = useState({});
  const [tasks, setTasks] = useState([]);
  const [openTaskId, setOpenTaskId] = useState(null);
  const navigate = useNavigate();

  // Fetch overview
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    fetch('http://localhost:3000/api/employees/overview', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
    })
      .then(res => res.json())
      .then(data => setTasksOverview(data))
      .catch(err => console.error(err));
  }, []);

  // Fetch tasks
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    fetch('http://localhost:3000/api/employees/requests', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
    })
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.requests || [];
        setTasks(list);
      })
      .catch(err => console.error(err));
  }, []);

  // Submit Report
  const submitReport = async (e) => {
    e.preventDefault();

    if (!sentBuildings) {
      console.error("No building selected!");
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch('http://localhost:3000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          reportType,
          content,
          status,
          building: sentBuildings,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("SERVER ERROR:", errText);
        throw new Error("Fetch failed");
      }

      const data = await res.json();
      console.log("Report saved:", data);

      setReport(data);
      setOpenTaskId(null);

      // Reset form
      setReportType('installation');
      setStatus('in_progress');
      setContent('');
      setSentBuildings('');

    } catch (err) {
      console.error(err);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const tStatus = task.status?.toLowerCase().replace('_', ' ');
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending') return tStatus === 'pending' || tStatus === 'assigned';
    if (activeTab === 'In Progress') return tStatus === 'in progress';
    if (activeTab === 'Completed') return tStatus === 'completed';
    return true;
  });

  // Logout
  const handleLogOut = () => {
    if (window.confirm("คุณแน่ใจว่าจะออกจากระบบหรือไม่?")) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      navigate("/login");
    }
  };

  return (
    <div className="emp-container">
      {/* Header */}
      <header className="emp-header">
        <div className="emp-header-left">
          <div className="emp-logo-section">
            <div className="emp-logo-icon">⬆</div>
            <div className="emp-logo-text">
              <h2>LiftMan</h2>
              <p>Technician Portal</p>
            </div>
          </div>
        </div>
        <div className="emp-header-right">
          <div className="emp-notification-bell">
            🔔
            <span className="emp-notification-badge">{tasksOverview.notifications}</span>
          </div>
          <button className="emp-logout-btn" onClick={handleLogOut}>Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <div className="emp-main-content">
        <nav className="emp-sidebar">
          <p>Dashboard</p>
        </nav>

        <div className="emp-content">
          <div className="emp-title-section">
            <h1>Technician Dashboard</h1>
          </div>

          {/* Stats Cards */}
          <div className="emp-stats-container">
            <div className="emp-stat-card">
              <div className="emp-stat-label">Total Tasks</div>
              <div className="emp-stat-number">{tasksOverview.requests}</div>
            </div>
            <div className="emp-stat-card">
              <div className="emp-stat-label">Pending</div>
              <div className="emp-stat-number">
                {tasks.filter(t => t.status?.toLowerCase() === 'assigned' || t.status?.toLowerCase() === 'pending').length}
              </div>
            </div>
            <div className="emp-stat-card">
              <div className="emp-stat-label">In Progress</div>
              <div className="emp-stat-number">
                {tasks.filter(t => t.status?.toLowerCase() === 'in progress').length}
              </div>
            </div>
            <div className="emp-stat-card">
              <div className="emp-stat-label">Completed</div>
              <div className="emp-stat-number">
                {tasks.filter(t => t.status?.toLowerCase() === 'completed').length}
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="emp-tasks-section">
            <div className="emp-tasks-header">
              <h2>My Tasks</h2>
              <p>Tasks assigned to you</p>
            </div>

            {/* Filter Tabs */}
            <div className="emp-filter-tabs">
              {['All', 'Pending', 'In Progress', 'Completed'].map(tab => (
                <button
                  key={tab}
                  className={`emp-filter-tab ${activeTab === tab ? 'emp-active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Task Cards */}
            <div className="emp-task-cards">
              {filteredTasks.map(task => {
                const building = typeof task.building === 'object' ? task.building : null;

                return (
                  <div key={task._id} className="emp-task-card">
                    <div className="emp-task-header">
                      <h3>{building?.name || task.building || 'Unknown Building'}</h3>
                      <span className="emp-detail-item">
                        📍 {building?.name || 'N/A'} - {building?.address || 'N/A'}
                      </span>
                      <span className="emp-detail-item">
                        📅 Date: {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}
                      </span>
                      <span className="emp-detail-item">
                        🔧 {task.taskType || task.requestType || 'N/A'}
                      </span>
                      <span className="emp-detail-item">
                        Title: {task.title}
                      </span>
                      <span className="emp-detail-item">
                        Desc: {task.description}
                      </span>

                      <div className="emp-task-badges">
                        <span className={`emp-badge emp-priority-${(task.priority || 'unknown').toLowerCase()}`}>
                          {task.priority || 'Unknown'}
                        </span>
                        <span className={`emp-badge emp-status-${(task.status || 'unknown').toLowerCase().replace(/ /g, '-')}`}>
                          {task.status || 'Unknown'}
                        </span>

                        <span>
                          <button
                            className="emp-submit-report-btn"
                            onClick={() => {
                              setOpenTaskId(task._id);
                              setSentBuildings(building?._id); // ✅ ส่ง ID ถูกต้อง
                              setReportType('installation');
                              setStatus('in_progress');
                              setContent('');
                            }}
                          >
                            Submit Report
                          </button>

                          <Popup
                            isOpen={openTaskId === task._id}
                            onClose={() => setOpenTaskId(null)}
                          >
                            <form onSubmit={submitReport}>
                              <p>Report for {building?.name || 'Unknown Building'}</p>

                              <p>Report Type</p>
                              <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                                <option value="installation">Installation</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="repair">Repair</option>
                              </select>

                              <p>Content</p>
                              <textarea value={content} onChange={(e) => setContent(e.target.value)} />

                              <p>Status</p>
                              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </select>

                              <button type="submit">Submit</button>
                            </form>
                          </Popup>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeePage;
