import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import './LoginPage.css';

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post('/auth/login', {
                email: email,
                password: password
            });
            login(res.data.token, res.data.user);
            navigate('/map')

        } catch (err) {
            setError("Invalid credentials")
        }
    };

    return(
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={((c) => setEmail(c.target.value))}/>
                <input type="password" placeholder="Password" value={password} onChange={((c) => setPassword(c.target.value))}/>
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
            <Link to="/signup">Don't have an account? Sign up</Link>
        </div>
    );
}