import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PhotoDetailModal from '../components/PhotoDetailModal';
import { useAuth } from '../context/AuthContext';
import './ExplorePage.css';

function ExploreCard({
    photo,
    isOwner,
    onClick,
    onEdit,
    onToggleLike,
    liking,
}) {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="card explore-card" onClick={onClick}>
            {isOwner && <span className="explore-card-mine-badge">Mine</span>}
            <button
                type="button"
                className={[
                    'explore-like-button',
                    photo.likedByMe ? 'explore-like-button-liked' : '',
                ].join(' ')}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleLike(photo);
                }}
                disabled={liking}
                aria-label={photo.likedByMe ? 'Unlike photo' : 'Like photo'}
                aria-pressed={Boolean(photo.likedByMe)}
            >
                <span className="explore-like-heart" aria-hidden="true">
                    ♥
                </span>
                <span className="explore-like-count">{photo.likeCount || 0}</span>
            </button>

            {imageError ? (
                <div className="explore-card-placeholder" aria-hidden="true">
                    <span className="explore-card-placeholder-icon">📷</span>
                    <span className="explore-card-placeholder-text">Image unavailable</span>
                </div>
            ) : (
                <img
                    src={photo.imageUrl}
                    alt={photo.caption || 'Photo'}
                    className="explore-card-img"
                    onError={() => setImageError(true)}
                />
            )}
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
                {isOwner && (
                    <button
                        type="button"
                        className="btn btn-outline explore-card-edit"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                    >
                        Edit
                    </button>
                )}
            </div>
        </div>
    );
}

export function ExplorePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [modalMode, setModalMode] = useState('view');
    const [likingPhotoIds, setLikingPhotoIds] = useState([]);
    const [likeError, setLikeError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const fetchPhotos = async (pageNum, append = false) => {
        try {
            if (append) {
                setLoadingMore(true);
            }

            const res = await api.get('/photos/public', {
                params: { page: pageNum, limit: 20 },
            });

            const { photos: newPhotos, totalPages: pages } = res.data;
            setPhotos((prev) => (append ? [...prev, ...newPhotos] : newPhotos));
            setTotalPages(pages);
            setPage(pageNum);
        } catch {
            setError('Failed to load public photos.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const mergeUpdatedPhoto = (updatedPhoto) => {
        setPhotos((prev) => prev.map((photo) => (
            photo._id === updatedPhoto._id
                ? { ...photo, ...updatedPhoto, user: photo.user || updatedPhoto.user }
                : photo
        )));
        setSelectedPhoto((prev) => (
            prev && prev._id === updatedPhoto._id
                ? { ...prev, ...updatedPhoto, user: prev.user || updatedPhoto.user }
                : prev
        ));
    };

    const handleToggleLike = async (photo) => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLikeError(null);
        setLikingPhotoIds((prev) => [...prev, photo._id]);
        try {
            const res = await api.post(`/photos/${photo._id}/like`);
            mergeUpdatedPhoto(res.data);
        } catch (err) {
            setLikeError(err.response?.data?.message || 'Failed to update like.');
        } finally {
            setLikingPhotoIds((prev) => prev.filter((id) => id !== photo._id));
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchPhotos(1);
        }, 0);

        return () => clearTimeout(timeoutId);
    }, []);

    const handleLoadMore = () => {
        if (page < totalPages) {
            fetchPhotos(page + 1, true);
        }
    };

    const getPhotoOwnerId = (photo) => photo.user?._id || photo.user;
    const getCurrentUserId = () => user?.id || user?._id;
    const isOwnPhoto = (photo) => (
        user && String(getPhotoOwnerId(photo)) === String(getCurrentUserId())
    );

    const openViewModal = (photo) => {
        setSelectedPhoto(photo);
        setModalMode('view');
    };

    const openEditModal = (photo) => {
        setSelectedPhoto(photo);
        setModalMode('edit');
    };

    const handleViewOnMap = (photo) => {
        navigate(`/map?photo=${photo._id}`);
    };

    const closeModal = () => {
        setSelectedPhoto(null);
        setModalMode('view');
    };

    const handlePhotoUpdate = (updatedPhoto) => {
        const normalizedPhoto = {
            ...updatedPhoto,
            user: selectedPhoto?.user || updatedPhoto.user,
        };
        const replacePhoto = (photo) => (
            photo._id === normalizedPhoto._id ? normalizedPhoto : photo
        );

        setPhotos((prev) => (
            normalizedPhoto.isPublic
                ? prev.map(replacePhoto)
                : prev.filter((photo) => photo._id !== normalizedPhoto._id)
        ));
        setSelectedPhoto(normalizedPhoto);
    };

    const handleDelete = (deletedId) => {
        setPhotos((prev) => prev.filter((photo) => photo._id !== deletedId));
        closeModal();
    };

    if (loading) return <p className="explore-status">Loading community photos...</p>;
    if (error) return <p className="explore-status explore-error">{error}</p>;

    return (
        <div className="explore-page">
            <h1 className="explore-title">Explore</h1>
            <p className="explore-subtitle">Public photos from the Momento community</p>
            {likeError && <p className="explore-like-error">{likeError}</p>}

            {photos.length === 0 ? (
                <p className="explore-status">No public photos yet. Be the first to share!</p>
            ) : (
                <>
                    <div className="explore-grid">
                        {photos.map((photo) => (
                            <ExploreCard
                                key={photo._id}
                                photo={photo}
                                isOwner={isOwnPhoto(photo)}
                                onClick={() => openViewModal(photo)}
                                onEdit={() => openEditModal(photo)}
                                onToggleLike={handleToggleLike}
                                liking={likingPhotoIds.includes(photo._id)}
                            />
                        ))}
                    </div>

                    {page < totalPages && (
                        <div className="explore-load-more">
                            <button
                                className="btn btn-primary"
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                            >
                                {loadingMore ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
            )}

            {selectedPhoto && (
                <PhotoDetailModal
                    photo={selectedPhoto}
                    onClose={closeModal}
                    onDelete={handleDelete}
                    onUpdate={handlePhotoUpdate}
                    isOwner={modalMode === 'edit'}
                    canLike={modalMode !== 'edit'}
                    onToggleLike={handleToggleLike}
                    onViewOnMap={handleViewOnMap}
                    liking={likingPhotoIds.includes(selectedPhoto._id)}
                />
            )}
        </div>
    );
}
