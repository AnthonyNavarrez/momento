import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './signup.css';


export function SignupPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post('/auth/register', {
                username: username,
                email: email,
                password: password
            });
            login(res.data.token, res.data.user);
            navigate('/map')

        } catch (err) {
            setError("Invalid credentials")
        }
    };
    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={((c) => setUsername(c.target.value))}/>
                <input type="email" placeholder="Email" value={email} onChange={((c) => setEmail(c.target.value))}/>
                <input type="password" placeholder="Password" value={password} onChange={((c) => setPassword(c.target.value))}/>
                <button type="submit">Sign up</button>
            </form>
            {error && <p>{error}</p>}
            <Link to="/login">Already have an account? Log in</Link>
        </div>
    )
}