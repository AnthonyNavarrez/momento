import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import MapPin from './MapPin.jsx'

const LOS_ANGELES_COORDS = [34.0522, -118.2437]
const DEMO_PINS = [
  { label: 'Santa Monica Pier', position: [34.0094, -118.4973] },
  { label: 'Griffith Observatory', position: [34.1184, -118.3004] },
  { label: 'UCLA', position: [34.0689, -118.4452] },
  { label: 'Grand Central Market', position: [34.0508, -118.2494] },
]

function MapClickLogger() {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng
      console.log('Map click:', { lat, lng })
    },
  })

  return null
}

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
      {DEMO_PINS.map((pin) => (
        <MapPin key={pin.label} position={pin.position}>
          {pin.label}
        </MapPin>
      ))}
      <MapClickLogger />
    </MapContainer>
  )
}

export default Map
