import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

export function LandingPage() {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (user) return <Navigate to="/map" />;

    return (
        <div className="landing-page">
            <section className="landing-hero">
                <h1 className="landing-title">Pin your <span>memories</span> to the map</h1>
                <p className="landing-subtitle">
                    Upload photos, pin them to real locations across Los Angeles, and explore where the community is going.
                </p>
                <div className="landing-cta">
                    <Link to="/signup" className="btn btn-primary">Get Started</Link>
                    <Link to="/explore" className="btn btn-secondary">Explore Photos</Link>
                </div>
            </section>

            <div className="landing-features-title">How It Works</div>
            <section className="landing-features">
                <div className="card landing-feature">
                    <h3>📍 Pin Your Photos</h3>
                    <p>Click anywhere on the Los Angeles map to upload and pin a photo to that exact location.</p>
                </div>
                <div className="card landing-feature">
                    <h3>🗺️ Build Your Map</h3>
                    <p>Build up your personal map with pinned memories, and add to community heatmaps filtered by week, month, or year.</p>
                    
                </div>
                <div className="card landing-feature">
                    <h3>🌎 Explore The Community</h3>
                    <p>Search public photos from the commmunity by caption, tags, or date and discover hidden gems around the city.</p>
                </div>
            </section>
        </div>
    );
}

