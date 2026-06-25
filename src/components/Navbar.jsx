import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import './Navbar.css';

export function NavBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

    return (
        <nav className="navbar">
            <Link to={user ? '/map' : '/'} className="navbar-logo">
                <img src="/momento-logo.svg" alt="Momento" className="navbar-logo-img" />
            </Link>

            <div className="navbar-links">
                {user && (
                    <>
                        <Link to="/map" className={isActive('/map')}>Map</Link>
                        <Link to="/explore" className={isActive('/explore')}>Explore</Link>
                        <Link to="/gallery" className={isActive('/gallery')}>Gallery</Link>
                    </>
                )}
            </div>

            <div className="navbar-user">
                {user ? (
                    <>
                        <span className="navbar-username">{user.username}</span>
                        <button className="btn btn-ghost" onClick={() => { logout(); navigate('/'); }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-outline">Login</Link>
                        <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
