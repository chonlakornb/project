import { useState } from 'react';
import './Employee.css';

function EmployeePage() {
    const [activeTab, setActiveTab] = useState('All');

    const tasks = [
        {
            id: 1,
            building: 'Harbor View Residences',
            description: 'Complete installation of elevator #4 and #5',
            priority: 'High',
            status: 'In Progress',
            location: 'Waterfront',
            dueDate: '15/11/2568',
            taskType: 'Installation',
            action: 'Submit Report'
        },
        {
            id: 2,
            building: 'Tech Hub Complex',
            description: 'Emergency repair - Elevator #2 control panel malfunction',
            priority: 'High',
            status: 'Pending',
            location: 'Business District',
            dueDate: '12/11/2568',
            taskType: 'Repair',
            action: 'Start Task'
        }
    ];

    const filteredTasks = tasks.filter(task => {
        if (activeTab === 'All') return true;
        return task.status === activeTab;
    });

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
                        <span className="emp-notification-badge">3</span>
                    </div>
                    <button className="emp-logout-btn">Logout</button>
                </div>
            </header>

            {/* Main Content */}
            <div className="emp-main-content">
                {/* Navigation */}
                <nav className="emp-sidebar">
                    <p>Dashboard</p>
                </nav>

                {/* Content Area */}
                <div className="emp-content">
                    {/* Title Section */}
                    <div className="emp-title-section">
                        <h1>Technician Dashboard</h1>
                    </div>

                    {/* Stats Cards */}
                    <div className="emp-stats-container">
                        <div className="emp-stat-card">
                            <div className="emp-stat-label">Total Tasks</div>
                            <div className="emp-stat-number">4</div>
                        </div>
                        <div className="emp-stat-card">
                            <div className="emp-stat-label">Pending</div>
                            <div className="emp-stat-number">2</div>
                        </div>
                        <div className="emp-stat-card">
                            <div className="emp-stat-label">In Progress</div>
                            <div className="emp-stat-number">1</div>
                        </div>
                        <div className="emp-stat-card">
                            <div className="emp-stat-label">Completed</div>
                            <div className="emp-stat-number">1</div>
                        </div>
                        <button className="emp-submit-report-btn">Submit Report</button>
                    </div>

                    {/* My Tasks Section */}
                    <div className="emp-tasks-section">
                        <div className="emp-tasks-header">
                            <div>
                                <h2>My Tasks</h2>
                                <p>Tasks assigned to you</p>
                            </div>
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
                            {filteredTasks.map(task => (
                                <div key={task.id} className="emp-task-card">
                                    <div className="emp-task-header">
                                        <h3>{task.building}</h3>
                                        <div className="emp-task-badges">
                                            <span className={`emp-badge emp-priority-${task.priority.toLowerCase()}`}>
                                                {task.priority}
                                            </span>
                                            <span className={`emp-badge emp-status-${task.status.toLowerCase().replace(' ', '-')}`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="emp-task-description">{task.description}</p>
                                    <div className="emp-task-details">
                                        <span className="emp-detail-item">📍 {task.location}</span>
                                        <span className="emp-detail-item">📅 Due: {task.dueDate}</span>
                                        <span className="emp-detail-item">🔧 {task.taskType}</span>
                                    </div>
                                    <div className="emp-task-action">
                                        {task.action === 'Submit Report' ? (
                                            <button className="emp-action-btn emp-action-black">{task.action}</button>
                                        ) : (
                                            <button className="emp-action-btn emp-action-white">{task.action}</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeePage;