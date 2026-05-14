import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';

export function NavBar() {
    const { user,logout } = useAuth();
    const navigate = useNavigate()
    return (
        <nav className="navbar">
            <span>Momento</span>
            {user ?
                <> 
                    <span>{user.username}</span>
                    <button onClick={() => {logout(); navigate('/login')}}>Logout</button>
                </> : 
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                </>}
        </nav>
    );
}