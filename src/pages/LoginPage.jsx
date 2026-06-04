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
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleEmailChange = (c) => {
        setEmail(c.target.value);
        if (error) setError(null);
    };

    const handlePasswordChange = (c) => {
        setPassword(c.target.value);
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await api.post('/auth/login', {
                email: email,
                password: password
            });
            login(res.data.token, res.data.user);
            navigate('/map')

        } catch (err) {
            setError("Invalid credentials")
            setSubmitting(false);
        }
    };

    return(
        <div className="login-page">
            <div className="card login-card">
                <h1 className="login-title">Welcome back</h1>

                {error && <div className="login-error">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label className="login-label" htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            className="input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label" htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            className="input"
                            placeholder="Your password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary login-submit" disabled={submitting}>
                        {submitting ? "Logging in..." : "Log in"}
                    </button>
                </form>

                <p className="login-footer">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
