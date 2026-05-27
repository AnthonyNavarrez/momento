import { useEffect, useState } from 'react';
import api from '../api/axios';
import PhotoDetailModal from '../components/PhotoDetailModal';
import './GalleryPage.css';
import { TagInput } from '../components/TagInput';
import { SearchBar } from '../components/SearchBar';

export function GalleryPage() {
    const [photos, setPhotos] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [testTags, setTestTags] = useState([]); {/*for test */}

    const fetchPhotos = async () => {
        try {
            const res = await api.get('/photos');
            setPhotos(res.data);
        } catch (err) {
            setError('Failed to load photos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleDelete = (deletedId) => {
        setPhotos((prev) => prev.filter((p) => p._id !== deletedId));
        setSelected(null);
    };

    if (loading) return <p className="gallery-status">Loading your photos...</p>;
    if (error)   return <p className="gallery-status gallery-error">{error}</p>;

    return (
        <div className="gallery-page">
            <h1 className="gallery-title">My Photos</h1>
            <SearchBar                                                                 
                onSearch={(filters) => console.log(filters)}                           
                resultCount={photos.length}                                            
                totalCount={photos.length}
            /> 
            <TagInput tags={testTags} onChange={setTestTags} />  {/*for test */}

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
