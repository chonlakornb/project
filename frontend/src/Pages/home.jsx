import { useNavigate } from 'react-router-dom';
import './home.css';

function Home() {
    const navigate = useNavigate();

    const stats = [
        { label: 'Total Elevators Managed', value: '1,248' },
        { label: 'Active Service Requests', value: '87' },
        { label: 'Buildings Under Maintenance', value: '156' },
        { label: 'Technicians Available', value: '42' }
    ];

    const handleAdminPortal = () => {
        navigate('/login?role=admin');
    };

    const handleTechnicianPortal = () => {
        navigate('/login?role=technician');
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="home-hero">
                <div className="home-hero-content">
                    <div className="home-hero-text">
                        <div className="home-hero-icon">⬆</div>
                        <h1 className="home-hero-title">Your Complete Elevator Management Solution</h1>
                        <p className="home-hero-subtitle">
                            Streamline elevator installation, maintenance, and service requests with LiftMan's integrated platform.
                            Designed for seamless collaboration between administrators and technicians.
                        </p>
                    </div>
                    
                    <div className="home-hero-image">
                        <img
                            src="/img/ELEV.png"
                            alt="Elevator Management Illustration"
                            className="home-hero-img"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/400x300?text=Elevator+Management';
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Overview Section */}
            <section className="home-overview">
                <div className="home-overview-header">
                    <h2>System Overview</h2>
                    <p>Real-time insights into your elevator management operations</p>
                </div>

                <div className="home-stats-grid">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="home-stat-card">
                            <div className="home-stat-label">{stat.label}</div>
                            <div className="home-stat-value">{stat.value}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="home-cta">
                <div className="home-cta-content">
                    <h2 className="home-cta-title">Get Started Now</h2>
                    <p className="home-cta-subtitle">Choose your role to access the platform</p>

                    <div className="home-cta-buttons">
                        <button
                            className="home-cta-btn home-cta-btn-primary"
                            onClick={handleAdminPortal}
                        >
                            Access Admin Portal
                        </button>
                        <button
                            className="home-cta-btn home-cta-btn-secondary"
                            onClick={handleTechnicianPortal}
                        >
                            Access Technician Portal
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <div className="home-footer-content">
                    <p>&copy; 2024 LiftMan Management System. All rights reserved.</p>
                    <div className="home-footer-links">
                        <a href="#contact">Contact</a>
                        <a href="#privacy">Privacy Policy</a>
                        <a href="#terms">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;