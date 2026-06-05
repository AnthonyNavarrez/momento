import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import PhotoDetailModal from '../components/PhotoDetailModal';
import { SearchBar } from '../components/SearchBar';
import './GalleryPage.css';

function parseTagsParam(tagsParam) {
    if (!tagsParam) return [];
    return tagsParam.split(',').map((t) => t.trim()).filter(Boolean);
}

export function GalleryPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [photos, setPhotos] = useState([]);
    const [allPhotos, setAllPhotos] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [isFiltering, setIsFiltering] = useState(false);

    const activeTags = parseTagsParam(searchParams.get('tags'));

    const fetchPhotos = async () => {
        try {
            const res = await api.get('/photos');
            setAllPhotos(res.data);

            if (activeTags.length > 0) {
                setIsFiltering(true);
                const searchRes = await api.get('/photos/search', {
                    params: { tags: activeTags.join(','), limit: 1000 },
                });
                setPhotos(searchRes.data.photos);
                setTotalCount(searchRes.data.totalPhotos);
            } else {
                setPhotos(res.data);
                setTotalCount(res.data.length);
            }
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
            setTotalCount(allPhotos.length);
            return;
        }

        setIsFiltering(true);
        try {
            const params = { limit: 1000 };
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

    const handlePhotoUpdate = (updatedPhoto) => {
        const replacePhoto = (photo) => (
            photo._id === updatedPhoto._id ? updatedPhoto : photo
        );

        setPhotos((prev) => prev.map(replacePhoto));
        setAllPhotos((prev) => prev.map(replacePhoto));
        setSelected(updatedPhoto);
    };

    const handleTagClick = (tag) => {
        if (activeTags.includes(tag)) return;
        setSearchParams({ tags: [...activeTags, tag].join(',') });
    };

    const handleTagsChange = (tags) => {
        const current = parseTagsParam(searchParams.get('tags'));
        if (tags.join(',') === current.join(',')) return;

        if (tags.length > 0) {
            setSearchParams({ tags: tags.join(',') }, { replace: true });
        } else {
            setSearchParams({}, { replace: true });
        }
    };

    const handleClearFilters = () => {
        setSearchParams({});
        setPhotos(allPhotos);
        setIsFiltering(false);
        setTotalCount(allPhotos.length);
    };

    if (loading) {
        return (
            <div className="gallery-page">
                <div className="gallery-page-inner">
                    <p className="gallery-status">Loading your photos...</p>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="gallery-page">
                <div className="gallery-page-inner">
                    <p className="gallery-status gallery-error">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="gallery-page">
            <div className="gallery-page-inner">
                <h1 className="gallery-title">My Gallery</h1>
                <SearchBar
                    onSearch={handleSearch}
                    onClear={handleClearFilters}
                    onTagsChange={handleTagsChange}
                    resultCount={photos.length}
                    totalCount={isFiltering ? totalCount : photos.length}
                    initialTags={activeTags}
                />
                {photos.length === 0 ? (
                    <div className="gallery-empty">
                        <p className="gallery-empty-title">No photos yet</p>
                        <p className="gallery-empty-hint">
                            Upload photos from the map to start building your gallery.
                        </p>
                    </div>
                ) : (
                    <div className="gallery-grid">
                        {photos.map((photo) => (
                            <div
                                key={photo._id}
                                className="gallery-card card"
                                onClick={() => setSelected(photo)}
                            >
                                <img
                                    src={photo.imageUrl}
                                    alt={photo.caption || 'Photo'}
                                    className="gallery-card-img"
                                />
                                <div className="gallery-card-body">
                                    {photo.caption && (
                                        <p className="gallery-card-caption">{photo.caption}</p>
                                    )}
                                    <div className="gallery-card-meta">
                                        <p className="gallery-card-date">
                                            {new Date(photo.createdAt).toLocaleDateString()}
                                        </p>
                                        <span
                                            className={[
                                                'gallery-card-visibility',
                                                photo.isPublic
                                                    ? 'gallery-card-visibility-public'
                                                    : 'gallery-card-visibility-private',
                                            ].join(' ')}
                                        >
                                            {photo.isPublic ? 'Public' : 'Private'}
                                        </span>
                                    </div>
                                    {photo.tags && photo.tags.length > 0 && (
                                        <div className="gallery-card-tags">
                                            {photo.tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="tag tag-clickable"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleTagClick(tag);
                                                    }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selected && (
                <PhotoDetailModal
                    photo={selected}
                    onClose={() => setSelected(null)}
                    onDelete={handleDelete}
                    onUpdate={handlePhotoUpdate}
                />
            )}
        </div>
    );
}
