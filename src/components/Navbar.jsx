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
                    <Link to="/map">Map</Link>
                    <Link to="/gallery">Gallery</Link>
                    <Link to="/explore">Explore</Link>
                    <span>{user.username}</span>
                    <button onClick={() => {logout(); navigate('/login')}}>Logout</button>
                </> :
                <>
                    <Link to="/explore">Explore</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                </>}
        </nav>
    );
}