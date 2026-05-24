import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet'
import { useEffect, useState } from 'react'
import api from '../../api/axios'
import MapPin from './MapPin.jsx'
import HeatmapLayer from './HeatmapLayer.jsx'
import PhotoUpload from '../PhotoUpload.jsx'
import './Map.css'

const TEST_HEATMAP_POINTS = [
  [34.0522, -118.2437, 1],  // DTLA
  [34.0094, -118.4973, 1],  // Santa Monica
  [34.0094, -118.4973, 1],  // Santa Monica (duplicate = hotter)
  [34.1184, -118.3004, 1],  // Griffith
  [34.0689, -118.4452, 1],  // UCLA
]

const LOS_ANGELES_COORDS = [34.0522, -118.2437]
const LA_BOUNDS = [
  [33.7, -118.7],  // southwest corner
  [34.4, -118.0],  // northeast corner
]

function MapClickLogger({ onMapClick }) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng
      onMapClick({ lat, lng })
    },
  })

  return null
}

function Map() {
  const [photos, setPhotos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  useEffect(() => {
    const fetchPhotos = async () => {
      setIsLoading(true)
      try {
        const response = await api.get('/photos')
        setPhotos(response.data)
        setFetchError(null)
      } catch (error) {
        console.error('Failed to load photos', error)
        const msg = error?.response?.data?.message || error.message || 'Failed to load photos'
        setFetchError(msg)
      }

      setIsLoading(false)
    }

    fetchPhotos()
  }, [])

  const handleMapClick = ({ lat, lng }) => {
    setSelectedLocation({ lat, lng })
    setIsUploadOpen(true)
  }

  const handleCloseUpload = () => {
    setIsUploadOpen(false)
    setSelectedLocation(null)
  }

  const handleUploadSuccess = (newPhoto) => {
    try {
      if (newPhoto) {
        setPhotos((prev) => [newPhoto, ...prev])
      }
    } catch (err) {
      console.error('Error updating photos after upload', err)
    }
  }

  const handleDelete = async (photoId) => {
    if (!photoId) return
    const ok = window.confirm('Delete this photo?')
    if (!ok) return

    try {
      await api.delete(`/photos/${photoId}`)
      setPhotos((prev) => prev.filter((p) => p._id !== photoId))
    } catch (err) {
      console.error('Failed to delete photo', err)
      alert(err?.response?.data?.message || err.message || 'Delete failed')
    }
  }

  return (
    <MapContainer
      className='map-container'
      center={LOS_ANGELES_COORDS}
      zoom={12}
      maxBounds={LA_BOUNDS}
      maxBoundsViscosity={1.0}
      minZoom={10}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {photos.map((photo) => {
        const lat = photo?.location?.lat
        const lng = photo?.location?.lng
        if (lat == null || lng == null) return null

        const rawImageUrl = photo.imageUrl
        const thumbnailSrc = rawImageUrl
          ? rawImageUrl.startsWith('http') || rawImageUrl.startsWith('/')
            ? rawImageUrl
            : `/uploads/${rawImageUrl}`
          : null

        const formattedDate = photo.createdAt
          ? new Date(photo.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : 'Unknown date'

        return (
          <MapPin key={photo._id || `${lat}-${lng}`} position={[lat, lng]}>
            <div className="map-pin-popup">
              {thumbnailSrc && (
                <img
                  className="map-pin-thumbnail"
                  src={thumbnailSrc}
                />
              )}
              <div className="popup-caption">{photo.caption || 'No caption'}</div>
              <div className="popup-date">Uploaded {formattedDate}</div>
              <div className="popup-actions">
                <button className="popup-delete" onClick={() => handleDelete(photo._id)}>Delete</button>
              </div>
            </div>
          </MapPin>
        )
      })}
      {fetchError && (
        <div className="map-no-photos" role="alert">Error loading photos: {fetchError}</div>
      )}
      {!isLoading && photos.length === 0 && (
        <div className="map-no-photos">No photos yet — click the map to add one</div>
      )}
      {isUploadOpen && selectedLocation && (
        <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
      )}
      <HeatmapLayer points={TEST_HEATMAP_POINTS} />
      {!isUploadOpen && <MapClickLogger onMapClick={handleMapClick} />}
      <PhotoUpload
        lat={selectedLocation?.lat}
        lng={selectedLocation?.lng}
        open={isUploadOpen}
        onClose={handleCloseUpload}
        onUploadSuccess={handleUploadSuccess}
      />
    </MapContainer>
  )
}

export default Map
