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
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleUsernameChange = (c) => {
        setUsername(c.target.value);
        if (error) setError(null);
    };

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
            const res = await api.post('/auth/register', {
                username: username,
                email: email,
                password: password
            });
            login(res.data.token, res.data.user);
            navigate('/map')

        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong")
            setSubmitting(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-bg" aria-hidden="true">
                <img src="/La-beach.jpg" className="signup-bg-img" alt="" />
            </div>

            <div className="card signup-card">
                <h1 className="signup-title">Create your account</h1>

                {error && <div className="signup-error">{error}</div>}

                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="signup-field">
                        <label className="signup-label" htmlFor="signup-username">Username</label>
                        <input
                            id="signup-username"
                            type="text"
                            className="input"
                            placeholder="yourname"
                            value={username}
                            onChange={handleUsernameChange}
                            required
                        />
                    </div>

                    <div className="signup-field">
                        <label className="signup-label" htmlFor="signup-email">Email</label>
                        <input
                            id="signup-email"
                            type="email"
                            className="input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>

                    <div className="signup-field">
                        <label className="signup-label" htmlFor="signup-password">Password</label>
                        <input
                            id="signup-password"
                            type="password"
                            className="input"
                            placeholder="Pick a password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary signup-submit" disabled={submitting}>
                        {submitting ? "Signing up..." : "Sign up"}
                    </button>
                </form>

                <p className="signup-footer">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </div>
        </div>
    )
}
