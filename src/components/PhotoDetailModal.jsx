import { useState } from 'react';
import api from '../api/axios';
import { TagInput } from './TagInput';
import './PhotoDetailModal.css';

export default function PhotoDetailModal({
    photo,
    onClose,
    onDelete,
    onUpdate,
    isOwner = true,
    canLike = false,
    onToggleLike,
    onViewOnMap,
    liking = false,
}) {
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    const applyPhotoUpdate = (updatedPhoto) => {
        onUpdate?.(updatedPhoto);
    };

    const handleTagsChange = async (newTags) => {
        setUpdating(true);
        setError(null);
        try {
            const res = await api.put(`/photos/${photo._id}`, { tags: newTags });
            applyPhotoUpdate(res.data);
        } catch {
            setError('Failed to update tags.');
        } finally {
            setUpdating(false);
        }
    };

    const handleTogglePublic = async () => {
        setUpdating(true);
        setError(null);
        try {
            const res = await api.put(`/photos/${photo._id}`, {
                isPublic: !photo.isPublic,
            });
            applyPhotoUpdate(res.data);
        } catch {
            setError('Failed to update visibility.');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this photo? This cannot be undone.')) return;
        setDeleting(true);
        try {
            await api.delete(`/photos/${photo._id}`);
            onDelete(photo._id);
        } catch {
            setError('Failed to delete photo.');
            setDeleting(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="overlay" onClick={handleBackdropClick}>
            <div className="modal photo-detail-modal">
                <button
                    type="button"
                    className="photo-detail-modal-close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>

                <img
                    src={photo.imageUrl}
                    alt={photo.caption || 'Photo'}
                    className="photo-detail-modal-image"
                />

                <div className="photo-detail-modal-body">
                    {photo.caption && (
                        <p className="photo-detail-modal-caption">{photo.caption}</p>
                    )}

                    <p className="photo-detail-modal-meta">
                        <span className="photo-detail-modal-meta-label">Location</span>
                        {photo.location.lat.toFixed(4)}, {photo.location.lng.toFixed(4)}
                    </p>

                    <p className="photo-detail-modal-meta">
                        <span className="photo-detail-modal-meta-label">Date</span>
                        {new Date(photo.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>

                    {photo.isPublic !== undefined && (
                        <span
                            className={`photo-detail-modal-badge ${
                                photo.isPublic
                                    ? 'photo-detail-modal-badge--public'
                                    : 'photo-detail-modal-badge--private'
                            }`}
                        >
                            {photo.isPublic ? 'Public' : 'Private'}
                        </span>
                    )}

                    {canLike && (
                        <button
                            type="button"
                            className={[
                                'photo-detail-modal-like',
                                photo.likedByMe ? 'photo-detail-modal-like--liked' : '',
                            ].join(' ')}
                            onClick={() => onToggleLike?.(photo)}
                            disabled={liking}
                            aria-pressed={Boolean(photo.likedByMe)}
                        >
                            {photo.likedByMe ? 'Liked' : 'Like'} · {photo.likeCount || 0}
                        </button>
                    )}

                    {isOwner ? (
                        <div className="photo-detail-modal-tags-section">
                            <label className="photo-detail-modal-label">Tags</label>
                            <TagInput
                                tags={photo.tags || []}
                                onChange={handleTagsChange}
                            />
                        </div>
                    ) : (
                        photo.tags && photo.tags.length > 0 && (
                            <div className="photo-detail-modal-tags">
                                {photo.tags.map((tag, i) => (
                                    <span key={i} className="tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )
                    )}

                    {error && <p className="photo-detail-modal-error">{error}</p>}

                    {onViewOnMap && (
                        <button
                            type="button"
                            className="btn btn-primary photo-detail-modal-map"
                            onClick={() => onViewOnMap(photo)}
                        >
                            View on Map
                        </button>
                    )}

                    {isOwner && (
                        <div className="photo-detail-modal-owner-actions">
                            <label className="photo-detail-modal-toggle">
                                <input
                                    type="checkbox"
                                    checked={photo.isPublic}
                                    onChange={handleTogglePublic}
                                    disabled={updating || deleting}
                                />
                                Share publicly
                            </label>

                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDelete}
                                disabled={deleting || updating}
                            >
                                {deleting ? 'Deleting...' : 'Delete Photo'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
