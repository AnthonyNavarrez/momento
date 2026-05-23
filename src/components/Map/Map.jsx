import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import { useEffect, useState } from 'react'
import api from '../../api/axios'
import MapPin from './MapPin.jsx'
import PhotoUpload from '../PhotoUpload.jsx'
import './Map.css'

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
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await api.get('/photos')
        setPhotos(response.data)
      } catch (error) {
        console.error('Failed to load photos', error)
      }
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
    if (newPhoto) {
      setPhotos((prev) => [newPhoto, ...prev])
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
            </div>
          </MapPin>
        )
      })}
      <MapClickLogger onMapClick={handleMapClick} />
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
