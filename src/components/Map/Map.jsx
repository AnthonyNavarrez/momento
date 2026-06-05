import { MapContainer, TileLayer, useMapEvents, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../../api/axios'
import MapPin from './MapPin.jsx'
import HeatmapLayer from './HeatmapLayer.jsx'
import MapViewToggle from './MapViewToggle.jsx'
import PhotoUpload from '../PhotoUpload.jsx'
import './Map.css'

const LOS_ANGELES_COORDS = [34.0522, -118.2437]
const SELECTED_PHOTO_ZOOM = 15
const LA_BOUNDS = [
  [33.7, -118.7],  // southwest corner
  [34.4, -118.0],  // northeast corner
]

function getPhotoPosition(photo) {
  const lat = photo?.location?.lat
  const lng = photo?.location?.lng
  if (lat == null || lng == null) return null

  return [lat, lng]
}

function getPhotoImageSrc(photo) {
  const rawImageUrl = photo?.imageUrl
  if (!rawImageUrl) return null

  return rawImageUrl.startsWith('http') || rawImageUrl.startsWith('/')
    ? rawImageUrl
    : `/uploads/${rawImageUrl}`
}

function formatPhotoDate(photo) {
  return photo?.createdAt
    ? new Date(photo.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown date'
}

function MapFocus({ position, zoom = SELECTED_PHOTO_ZOOM }) {
  const map = useMap()

  useEffect(() => {
    if (!position) return

    map.setView(position, zoom)
  }, [map, position, zoom])

  return null
}

function MapClickLogger({ onMapClick }) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng
      onMapClick({ lat, lng })
    },
  })

  return null
}

function SelectedCommunityMarker({ photo }) {
  const markerRef = useRef(null)
  const position = getPhotoPosition(photo)
  const thumbnailSrc = getPhotoImageSrc(photo)
  const formattedDate = formatPhotoDate(photo)

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup()
    }
  }, [photo?._id])

  if (!position) return null

  return (
    <Marker position={position} ref={markerRef}>
      <Popup>
        <div className="map-pin-popup map-pin-popup-community">
          {thumbnailSrc && (
            <img
              className="map-pin-thumbnail"
              src={thumbnailSrc}
              alt={photo.caption || 'Photo'}
            />
          )}
          <div className="map-pin-body">
            <div className="popup-caption">{photo.caption || 'No caption'}</div>
            <div className="popup-date">
              {photo.user?.username ? `${photo.user.username} · ` : ''}
              {formattedDate}
            </div>
            {photo.tags && photo.tags.length > 0 && (
              <div className="popup-tags">
                {photo.tags.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
            )}
            <div className="popup-actions">
              <Link to={`/photos/${photo._id}`} className="popup-view-link">View Details</Link>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

function Map() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedPhotoId = searchParams.get('photo')
  const [photos, setPhotos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const [mapView, setMapView] = useState('my-photos')
  const [heatmapPeriod, setHeatmapPeriod] = useState('all')
  const [heatmapPoints, setHeatmapPoints] = useState([])
  const [heatmapCount, setHeatmapCount] = useState(null)
  const [selectedCommunityPhoto, setSelectedCommunityPhoto] = useState(null)
  const [selectedCommunityError, setSelectedCommunityError] = useState(null)

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

  useEffect(() => {
    if (!selectedPhotoId) return

    let ignore = false

    const fetchSelectedPhoto = async () => {
      setMapView('heatmap')
      setIsUploadOpen(false)
      setSelectedLocation(null)
      setSelectedCommunityError(null)

      try {
        const response = await api.get(`/photos/${selectedPhotoId}`)
        if (ignore) return

        const photo = response.data
        if (!getPhotoPosition(photo)) {
          setSelectedCommunityPhoto(null)
          setSelectedCommunityError('Selected photo does not have a map location.')
          return
        }

        setSelectedCommunityPhoto(photo)
      } catch (error) {
        if (ignore) return

        setSelectedCommunityPhoto(null)
        setSelectedCommunityError(
          error?.response?.data?.message || 'Failed to load selected photo.'
        )
      }
    }

    fetchSelectedPhoto()

    return () => {
      ignore = true
    }
  }, [selectedPhotoId])

  useEffect(() => {
    if (mapView !== 'heatmap') return

    const fetchHeatmap = async () => {
      try {
        const response = await api.get(`/photos/heatmap?period=${heatmapPeriod}`)
        const points = response.data.points.map(([lat, lng]) => [lat, lng, 1])
        setHeatmapPoints(points)
        setHeatmapCount(response.data.count)
      } catch (err) {
        console.error('Failed to load heatmap data', err)
        setHeatmapPoints([])
        setHeatmapCount(null)
      }
    }

    fetchHeatmap()
  }, [mapView, heatmapPeriod])

  const handleViewChange = (view) => {
    setMapView(view)
    if (view === 'heatmap') {
      setIsUploadOpen(false)
      setSelectedLocation(null)
    } else {
      setSelectedCommunityPhoto(null)
      setSelectedCommunityError(null)
      if (selectedPhotoId) {
        const nextParams = new URLSearchParams(searchParams)
        nextParams.delete('photo')
        setSearchParams(nextParams, { replace: true })
      }
    }
  }

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

  const isMyPhotos = mapView === 'my-photos'

  return (
    <div className="map-wrapper">
    <MapContainer
      className='map-container'
      center={LOS_ANGELES_COORDS}
      zoom={12}
      maxBounds={LA_BOUNDS}
      maxBoundsViscosity={1.0}
      minZoom={10}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        subdomains='abcd'
      />
      <MapViewToggle
        view={mapView}
        period={heatmapPeriod}
        photoCount={heatmapCount}
        onViewChange={handleViewChange}
        onPeriodChange={setHeatmapPeriod}
      />
      {selectedPhotoId && selectedCommunityPhoto && (
        <MapFocus position={getPhotoPosition(selectedCommunityPhoto)} />
      )}
      {isMyPhotos && photos.map((photo) => {
        const position = getPhotoPosition(photo)
        if (!position) return null

        const thumbnailSrc = getPhotoImageSrc(photo)
        const formattedDate = formatPhotoDate(photo)

        return (
          <MapPin key={photo._id || position.join('-')} position={position}>
            <div className="map-pin-popup">
              {thumbnailSrc && (
                <img
                  className="map-pin-thumbnail"
                  src={thumbnailSrc}
                  alt={photo.caption || 'Photo'}
                />
              )}
              <div className="map-pin-body">
                <div className="popup-caption">{photo.caption || 'No caption'}</div>
                <div className="popup-date">{formattedDate}</div>
                {photo.tags && photo.tags.length > 0 && (
                  <div className="popup-tags">
                    {photo.tags.map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="popup-actions">
                  <Link to={`/photos/${photo._id}`} className="popup-view-link">View Details</Link>
                  <button className="btn btn-danger popup-delete-btn" onClick={() => handleDelete(photo._id)}>Delete</button>
                </div>
              </div>
            </div>
          </MapPin>
        )
      })}
      {isMyPhotos && fetchError && (
        <div className="map-no-photos" role="alert">Error loading photos: {fetchError}</div>
      )}
      {isMyPhotos && !isLoading && photos.length === 0 && (
        <div className="map-no-photos">No photos yet — click the map to add one</div>
      )}
      {isMyPhotos && isUploadOpen && selectedLocation && (
        <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
      )}
      {!isMyPhotos && <HeatmapLayer points={heatmapPoints} />}
      {!isMyPhotos && selectedPhotoId && selectedCommunityPhoto && (
        <SelectedCommunityMarker photo={selectedCommunityPhoto} />
      )}
      {!isMyPhotos && selectedPhotoId && selectedCommunityError && (
        <div className="map-no-photos map-community-error" role="alert">
          {selectedCommunityError}
        </div>
      )}
      {isMyPhotos && !isUploadOpen && <MapClickLogger onMapClick={handleMapClick} />}
    </MapContainer>
    {isMyPhotos && (
      <PhotoUpload
        lat={selectedLocation?.lat}
        lng={selectedLocation?.lng}
        open={isUploadOpen}
        onClose={handleCloseUpload}
        onUploadSuccess={handleUploadSuccess}
      />
    )}
    </div>
  )
}

export default Map
