import { useEffect, useState } from 'react';
import api from '../api/axios';
import PhotoDetailModal from '../components/PhotoDetailModal';
import './GalleryPage.css';
import { SearchBar } from '../components/SearchBar';

export function GalleryPage() {
    const [photos, setPhotos] = useState([]);
    const [allPhotos, setAllPhotos] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [isFiltering, setIsFiltering] = useState(false);

    const fetchPhotos = async () => {
        try {
            const res = await api.get('/photos');
            setPhotos(res.data);
            setAllPhotos(res.data);
            setTotalCount(res.data.length);
        } catch (err) {
            setError('Failed to load photos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleSearch = async (filters) => {
        const { q, tags, startDate, endDate } = filters;
        const hasFilters = q || (tags && tags.length > 0) || startDate || endDate;

        if (!hasFilters) {
            setPhotos(allPhotos);
            setIsFiltering(false);
            return;
        }

        setIsFiltering(true);
        try {
            const params = {};
            if (q) params.q = q;
            if (tags && tags.length > 0) params.tags = tags.join(',');
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const res = await api.get('/photos/search', { params });
            setPhotos(res.data.photos);
            setTotalCount(res.data.totalPhotos);
        } catch (err) {
            setError('Search failed.');
        }
    };

    const handleDelete = (deletedId) => {
        setPhotos((prev) => prev.filter((p) => p._id !== deletedId));
        setAllPhotos((prev) => prev.filter((p) => p._id !== deletedId));
        setSelected(null);
    };

    if (loading) return <p className="gallery-status">Loading your photos...</p>;
    if (error)   return <p className="gallery-status gallery-error">{error}</p>;

    return (
        <div className="gallery-page">
            <h1 className="gallery-title">My Photos</h1>
            <SearchBar
                onSearch={handleSearch}
                resultCount={photos.length}
                totalCount={isFiltering ? totalCount : photos.length}
            />
            {photos.length === 0 ? (
                <p className="gallery-status">No photos yet. Upload some from the map!</p>
            ) : (
                <div className="gallery-grid">
                    {photos.map((photo) => (
                        <div
                            key={photo._id}
                            className="gallery-card"
                            onClick={() => setSelected(photo)}
                        >
                            <img
                                src={photo.imageUrl}
                                alt={photo.caption || 'Photo'}
                                className="gallery-card-img"
                            />
                            <div className="gallery-card-info">
                                {photo.caption && (
                                    <p className="gallery-card-caption">{photo.caption}</p>
                                )}
                                <p className="gallery-card-date">
                                    {new Date(photo.createdAt).toLocaleDateString()}
                                </p>
                                {photo.tags && photo.tags.length > 0 && (
                                    <div className="gallery-card-tags">
                                        {photo.tags.map((tag, i) => (
                                            <span key={i} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selected && (
                <PhotoDetailModal
                    photo={selected}
                    onClose={() => setSelected(null)}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}
