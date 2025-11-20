import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

export default function Navbar({tab, setTab}) {

    

    return (
        
        <header className="global-nav-container" >
            <div className="global-nav-left"  >
                <div className="global-nav-logo-icon"><img src="./src/assets/logo.svg" alt="" /></div>
                <div className="global-nav-title">
                    <span className="global-nav-name"><Link to={'/home'}>LiftMan</Link></span>
                    <span className="global-nav-sub">Elevator Management</span>
                </div>
            </div>

            <nav className="global-nav-right" >
                <Link to={"/login"}
                    className={`global-nav-link global-nav-portal`}
                >
                    Login
                </Link>

                <Link to={'/register'}
                    className={`global-nav-link global-nav-portal`}
                >
                    Register
                </Link>
            </nav>
        </header>
    );
}