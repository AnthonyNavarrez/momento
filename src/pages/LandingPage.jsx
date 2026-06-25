import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import roadmapBg from '../assets/landing/roadmap-bg.jpg';
import pin from '../assets/landing/pin.svg';
import dashCurve1 from '../assets/landing/dash-curve-1.svg';
import dashCurve2 from '../assets/landing/dash-curve-2.svg';
import iconUpload from '../assets/landing/icon-upload.svg';
import iconPin from '../assets/landing/icon-pin.svg';
import iconWorld from '../assets/landing/icon-world.svg';
import polaroidDtla from '../assets/landing/polaroid-dtla.jpg';
import polaroidHollywood from '../assets/landing/polaroid-hollywood.jpg';
import polaroidMalibu from '../assets/landing/polaroid-malibu.jpg';
import polaroidLacma from '../assets/landing/polaroid-lacma.jpg';
import polaroidGrove from '../assets/landing/polaroid-grove.jpg';
import './LandingPage.css';

const PHOTOS = [
    { src: polaroidDtla, caption: 'Matcha pop up at DTLA', tilt: -6, pinTilt: 18 },
    { src: polaroidHollywood, caption: 'HOLLYWOOD!', tilt: 2, pinTilt: -10 },
    { src: polaroidMalibu, caption: 'Malibu beach', tilt: -4, pinTilt: 12 },
    { src: polaroidLacma, caption: 'LACMA Museum', tilt: 6, pinTilt: -16 },
    { src: polaroidGrove, caption: 'The Grove', tilt: -1, pinTilt: 14 },
];

const FEATURES = [
    { icon: iconUpload, title: 'Upload Photos', desc: 'Upload your memories from your camera roll' },
    { icon: iconPin, title: 'Pin to map', desc: 'Place memories where they took place' },
    { icon: iconWorld, title: 'Explore hotspots', desc: 'See where the city actually comes alive' },
];

export function LandingPage() {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (user) return <Navigate to="/map" />;

    return (
        <div className="landing-page">
            <div className="landing-bg" aria-hidden="true">
                <img src={roadmapBg} className="landing-bg-img" alt="" />
            </div>

            <section className="landing-hero">
                <h1 className="landing-title">
                    <span className="landing-title-line">
                        Pin your <span className="landing-title-accent">MEMORIES</span>
                    </span>
                    <span className="landing-title-line">on the map</span>
                </h1>
                <p className="landing-subtitle">
                    Momento turns your camera roll into a living map of LA and shows you where the city is really alive
                </p>
                <div className="landing-cta">
                    <Link to="/explore" className="landing-btn landing-btn-outline">Explore photos</Link>
                    <Link to="/signup" className="landing-btn landing-btn-primary">Get started</Link>
                </div>
            </section>

            <section className="landing-gallery">
                <img src={dashCurve1} className="landing-dash landing-dash-1" alt="" aria-hidden="true" />
                <img src={dashCurve2} className="landing-dash landing-dash-2" alt="" aria-hidden="true" />
                {PHOTOS.map((photo) => (
                    <figure
                        className="polaroid"
                        key={photo.caption}
                        style={{ '--tilt': `${photo.tilt}deg` }}
                    >
                        <img
                            src={pin}
                            className="polaroid-pin"
                            alt=""
                            aria-hidden="true"
                            style={{ '--pin-tilt': `${photo.pinTilt}deg` }}
                        />
                        <img src={photo.src} className="polaroid-photo" alt={photo.caption} />
                        <figcaption>{photo.caption}</figcaption>
                    </figure>
                ))}
            </section>

            <section className="landing-features">
                {FEATURES.map((feature) => (
                    <div className="feature-card" key={feature.title}>
                        <div className="feature-icon">
                            <img src={feature.icon} alt="" aria-hidden="true" />
                        </div>
                        <div className="feature-text">
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
