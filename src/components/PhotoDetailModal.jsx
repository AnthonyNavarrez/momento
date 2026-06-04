import { useState } from 'react';
import api from '../api/axios';
import './PhotoDetailModal.css';

export default function PhotoDetailModal({ photo, onClose, onDelete, isOwner = true }) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        if (!window.confirm('Delete this photo? This cannot be undone.')) return;
        setDeleting(true);
        try {
            await api.delete(`/photos/${photo._id}`);
            onDelete(photo._id);
        } catch (err) {
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

                    {photo.tags && photo.tags.length > 0 && (
                        <div className="photo-detail-modal-tags">
                            {photo.tags.map((tag, i) => (
                                <span key={i} className="tag">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {error && <p className="photo-detail-modal-error">{error}</p>}

                    {isOwner && (
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete Photo'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
