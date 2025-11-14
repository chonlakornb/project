import { Link } from 'react-router';

import './navbar.css'

function Navbar() {
    return ( <div className="navbar-container">
        <Link to={"/"}>Home</Link>
        <Link to={"/login"}>Login</Link>
    </div> );
}

export default Navbar;  