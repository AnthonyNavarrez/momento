import './MapViewToggle.css'

const PERIODS = [
  { value: 'week', label: 'Past Week' },
  { value: 'month', label: 'Past Month' },
  { value: 'year', label: 'Past Year' },
  { value: 'all', label: 'All Time' },
]

function MapViewToggle({ view, period, photoCount, onViewChange, onPeriodChange }) {
  return (
    <div className="map-toggle-container">
      <div className="map-toggle-controls">
        <div className="map-toggle-segmented">
          <button
            className={`map-toggle-btn ${view === 'my-photos' ? 'active' : ''}`}
            onClick={() => onViewChange('my-photos')}
          >
            My Photos
          </button>
          <button
            className={`map-toggle-btn ${view === 'heatmap' ? 'active' : ''}`}
            onClick={() => onViewChange('heatmap')}
          >
            Community Heatmap
          </button>
        </div>

        {view === 'heatmap' && (
          <>
            <div className="map-toggle-periods">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  className={`map-period-btn ${period === p.value ? 'active' : ''}`}
                  onClick={() => onPeriodChange(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {photoCount != null && (
              <div className="map-toggle-count">
                {photoCount} public photo{photoCount !== 1 ? 's' : ''}{' '}
                {period === 'week' && 'this week'}
                {period === 'month' && 'this month'}
                {period === 'year' && 'this year'}
                {period === 'all' && 'all time'}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default MapViewToggle
