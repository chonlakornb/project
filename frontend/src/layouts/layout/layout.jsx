import {Outlet} from "react-router-dom";

import Navbar from "../Navbar/navbar";
import Footer from "../Footer/Footer";

function Layout({tab, setTab}) {
    return ( <>
        <Navbar tab={tab} setTab={setTab}/>
        <Outlet />
        <Footer />
    </>);
}

export default Layout;