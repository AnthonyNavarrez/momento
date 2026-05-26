import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './ExplorePage.css';

export function ExplorePage() {
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchPhotos = async (pageNum, append = false) => {
        try {
            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const res = await api.get('/photos/public', {
                params: { page: pageNum, limit: 20 },
            });

            const { photos: newPhotos, totalPages: pages } = res.data;
            setPhotos((prev) => (append ? [...prev, ...newPhotos] : newPhotos));
            setTotalPages(pages);
            setPage(pageNum);
        } catch (err) {
            setError('Failed to load public photos.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchPhotos(1);
    }, []);

    const handleLoadMore = () => {
        if (page < totalPages) {
            fetchPhotos(page + 1, true);
        }
    };

    if (loading) return <p className="explore-status">Loading community photos...</p>;
    if (error) return <p className="explore-status explore-error">{error}</p>;

    return (
        <div className="explore-page">
            <h1 className="explore-title">Explore</h1>
            <p className="explore-subtitle">Public photos from the Momento community</p>

            {photos.length === 0 ? (
                <p className="explore-status">No public photos yet. Be the first to share!</p>
            ) : (
                <>
                    <div className="explore-grid">
                        {photos.map((photo) => (
                            <div
                                key={photo._id}
                                className="explore-card"
                                onClick={() => navigate(`/photos/${photo._id}`)}
                            >
                                <img
                                    src={photo.imageUrl}
                                    alt={photo.caption || 'Photo'}
                                    className="explore-card-img"
                                />
                                <div className="explore-card-info">
                                    {photo.caption && (
                                        <p className="explore-card-caption">{photo.caption}</p>
                                    )}
                                    <p className="explore-card-username">
                                        {photo.user?.username || 'Unknown'}
                                    </p>
                                    <p className="explore-card-date">
                                        {new Date(photo.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {page < totalPages && (
                        <div className="explore-load-more">
                            <button
                                className="explore-load-more-btn"
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                            >
                                {loadingMore ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
