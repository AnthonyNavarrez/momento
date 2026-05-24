import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.heat/dist/leaflet-heat.js'

const DEFAULT_OPTIONS = {
  radius: 25,
  blur: 15,
  maxZoom: 17,
}

function HeatmapLayer({ points = [], radius, blur, maxZoom, gradient }) {
  const map = useMap()
  const heatLayerRef = useRef(null)

  useEffect(() => {
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current)
      heatLayerRef.current = null
    }

    if (points.length === 0) return

    const options = { ...DEFAULT_OPTIONS }
    if (radius != null) options.radius = radius
    if (blur != null) options.blur = blur
    if (maxZoom != null) options.maxZoom = maxZoom
    if (gradient != null) options.gradient = gradient

    heatLayerRef.current = L.heatLayer(points, options).addTo(map)

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current)
        heatLayerRef.current = null
      }
    }
  }, [map, points, radius, blur, maxZoom, gradient])

  return null
}

export default HeatmapLayer
