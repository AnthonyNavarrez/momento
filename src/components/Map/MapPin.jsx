import { Marker, Popup } from 'react-leaflet'

function MapPin({ position, children }) {
  return (
    <Marker position={position}>
      <Popup>{children ?? 'Pinned location'}</Popup>
    </Marker>
  )
}

export default MapPin
