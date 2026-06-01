import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { TagInput } from '../components/TagInput';
import './PhotoDetailPage.css';

export function PhotoDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchPhoto = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get(`/photos/${id}`);
                setPhoto(res.data);
            } catch (err) {
                const status = err?.response?.status;
                if (status === 404) {
                    setError('Photo not found.');
                } else if (status === 403) {
                    setError('You do not have permission to view this photo.');
                } else {
                    setError('Failed to load photo.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPhoto();
    }, [id]);

    const photoOwnerId = photo?.user?._id || photo?.user;
    const isOwner = user && photo && String(photoOwnerId) === String(user.id);

    const handleTogglePublic = async () => {
        setUpdating(true);
        try {
            const res = await api.put(`/photos/${id}`, { isPublic: !photo.isPublic });
            setPhoto(res.data);
        } catch (err) {
            setError('Failed to update visibility.');
        } finally {
            setUpdating(false);
        }
    };

    const handleTagsChange = async (newTags) => {
        try {
            const res = await api.put(`/photos/${id}`, { tags: newTags });
            setPhoto(res.data);
        } catch (err) {
            setError('Failed to update tags.');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this photo? This cannot be undone.')) return;
        setDeleting(true);
        try {
            await api.delete(`/photos/${id}`);
            navigate('/gallery');
        } catch (err) {
            setError('Failed to delete photo.');
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="photo-detail-page">
                <div className="photo-detail-page-inner">
                    <p className="photo-detail-status">Loading photo...</p>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="photo-detail-page">
                <div className="photo-detail-page-inner">
                    <p className="photo-detail-status photo-detail-error">{error}</p>
                </div>
            </div>
        );
    }
    if (!photo) return null;

    return (
        <div className="photo-detail-page">
            <div className="photo-detail-page-inner">
            <Link to="/explore" className="photo-detail-back">← Back to Explore</Link>

            <div className="card photo-detail-card">
                <img
                    src={photo.imageUrl}
                    alt={photo.caption || 'Photo'}
                    className="photo-detail-image"
                />

                <div className="photo-detail-body">
                    {photo.caption && (
                        <p className="photo-detail-caption">{photo.caption}</p>
                    )}

                    <p className="photo-detail-meta">
                        {new Date(photo.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>

                    <p className="photo-detail-meta">
                        {photo.location.lat.toFixed(4)}, {photo.location.lng.toFixed(4)}
                    </p>

                    <span
                        className={`photo-detail-badge ${
                            photo.isPublic
                                ? 'photo-detail-badge--public'
                                : 'photo-detail-badge--private'
                        }`}
                    >
                        {photo.isPublic ? 'Public' : 'Private'}
                    </span>

                    {isOwner ? (
                        <div className="photo-detail-tags-section">
                            <label className="photo-detail-label">Tags</label>
                            <TagInput tags={photo.tags || []} onChange={handleTagsChange} />
                        </div>
                    ) : (
                        photo.tags && photo.tags.length > 0 && (
                            <div className="photo-detail-tags">
                                {photo.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="tag tag-clickable"
                                        onClick={() => navigate(`/gallery?tags=${tag}`)}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )
                    )}

                    {isOwner && (
                        <div className="photo-detail-owner-actions">
                            <label className="photo-detail-toggle">
                                <input
                                    type="checkbox"
                                    checked={photo.isPublic}
                                    onChange={handleTogglePublic}
                                    disabled={updating}
                                />
                                Share publicly
                            </label>

                            <button
                                type="button"
                                className="btn btn-danger photo-detail-delete"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete Photo'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
}
