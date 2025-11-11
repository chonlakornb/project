import { use } from "react";
import { Navigate, useNavigate } from "react-router";



function Login() {
    const navigate = useNavigate();

    const loginUser = () => {
        navigate("/customer");
    }



    const loginAdmin = () => {
        navigate("/admin");
    };

    const loginEmployee = () => {
        navigate("/employee");
    };

    return (
        <div>
            <h2>Login Page</h2>
            <button className="login-button" onClick={loginUser}>
                Login Customer
            </button>
            <button className="login-button" onClick={loginAdmin}>
                Login Admin
            </button>
            <button className="login-button" onClick={loginEmployee}>
                Login Employee
            </button>
        </div>
    );
}

export default Login;