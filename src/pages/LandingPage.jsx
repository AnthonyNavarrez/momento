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
                <h1 className="landing-title">Pin your memories to the map</h1>
                <p className="landing-subtitle">
                    Upload photos, pin them to real locations across Los Angeles, and explore where the community is going.
                </p>
                <div className="landing-cta">
                    <Link to="/signup" className="landing-btn-primary">Sign Up</Link>
                    <Link to="/explore" className="landing-btn-secondary">Explore</Link>
                </div>
            </section>

            <section className="landing-features">
                <div className="landing-feature">
                    <h3>Pin Photos</h3>
                    <p>Click anywhere on the LA map to upload and pin a photo to that exact location.</p>
                </div>
                <div className="landing-feature">
                    <h3>Explore</h3>
                    <p>Browse public photos from the community and discover hidden gems around the city.</p>
                </div>
                <div className="landing-feature">
                    <h3>Heatmaps</h3>
                    <p>See where people are actually going with community heatmaps filtered by week, month, or year.</p>
                </div>
                <div className="landing-feature">
                    <h3>Search</h3>
                    <p>Search your photos by caption, tags, or date to find any memory instantly.</p>
                </div>
            </section>
        </div>
    );
}

