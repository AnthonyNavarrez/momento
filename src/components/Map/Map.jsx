import { MapContainer, TileLayer } from 'react-leaflet'

const LOS_ANGELES_COORDS = [34.0522, -118.2437]

function Map() {
  return (
    <MapContainer
      center={LOS_ANGELES_COORDS}
      zoom={12}
      style={{ width: '100%', height: '100vh' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
    </MapContainer>
  )
}

export default Map
