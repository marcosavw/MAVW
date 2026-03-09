import { useState, useMemo, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

const SAMPLE_EVENTS = [
  {
    id: 1,
    name: 'ICF Canoe Sprint World Cup - Szeged',
    date: '2025-05-16',
    location: 'Szeged, Hungary',
    lat: 46.2530,
    lng: 20.1461,
    type: 'Sprint',
    status: 'Upcoming'
  },
  {
    id: 2,
    name: 'ICF Canoe Sprint World Cup - Poznań',
    date: '2025-05-23',
    location: 'Poznań, Poland',
    lat: 52.4082,
    lng: 16.9454,
    type: 'Sprint',
    status: 'Upcoming'
  },
  {
    id: 3,
    name: 'ICF Slalom World Cup - Ivrea',
    date: '2025-04-11',
    location: 'Ivrea, Italy',
    lat: 45.4615,
    lng: 7.8744,
    type: 'Slalom',
    status: 'Upcoming'
  },
  {
    id: 4,
    name: 'ICF Slalom World Cup - Markkleeberg',
    date: '2025-05-09',
    location: 'Markkleeberg, Germany',
    lat: 51.3227,
    lng: 12.3674,
    type: 'Slalom',
    status: 'Upcoming'
  },
  {
    id: 5,
    name: 'ICF Canoe Sprint U23 & Junior World Championships',
    date: '2025-08-01',
    location: 'Belgrade, Serbia',
    lat: 44.8176,
    lng: 20.4572,
    type: 'Sprint',
    status: 'Upcoming'
  },
  {
    id: 6,
    name: 'ICF Canoe Slalom World Championships',
    date: '2025-09-08',
    location: 'Brasília, Brazil',
    lat: -15.7975,
    lng: -47.8919,
    type: 'Slalom',
    status: 'Upcoming'
  },
  {
    id: 7,
    name: 'ICF Canoe Marathon World Championships',
    date: '2025-10-04',
    location: 'TBD',
    lat: null,
    lng: null,
    type: 'Marathon',
    status: 'Upcoming'
  },
  {
    id: 8,
    name: 'ICF Canoe Sprint World Championships',
    date: '2025-09-13',
    location: 'Tokyo, Japan',
    lat: 35.6762,
    lng: 139.6503,
    type: 'Sprint',
    status: 'Upcoming'
  },
  {
    id: 9,
    name: 'ICF Wildwater Canoeing World Championships',
    date: '2026-06-15',
    location: 'TBD',
    lat: null,
    lng: null,
    type: 'Wildwater',
    status: 'Upcoming'
  },
  {
    id: 10,
    name: 'ICF Dragon Boat World Championships',
    date: '2025-11-15',
    location: 'China',
    lat: 39.9042,
    lng: 116.4074,
    type: 'Dragon Boat',
    status: 'Upcoming'
  },
  {
    id: 11,
    name: 'ICF Canoe Polo World Championships',
    date: '2026-08-01',
    location: 'TBD',
    lat: null,
    lng: null,
    type: 'Polo',
    status: 'Upcoming'
  },
  {
    id: 12,
    name: 'ICF Sprint European Championships',
    date: '2025-06-14',
    location: 'Plovdiv, Bulgaria',
    lat: 42.1481,
    lng: 24.7504,
    type: 'Sprint',
    status: 'Upcoming'
  },
  {
    id: 13,
    name: 'ICF Slalom European Championships',
    date: '2025-07-16',
    location: 'Krakow, Poland',
    lat: 50.0647,
    lng: 19.9450,
    type: 'Slalom',
    status: 'Upcoming'
  },
  {
    id: 14,
    name: 'ICF Marathon European Championships',
    date: '2025-09-28',
    location: 'Portugal',
    lat: 39.3999,
    lng: -8.2245,
    type: 'Marathon',
    status: 'Upcoming'
  },
  {
    id: 15,
    name: 'ICF Canoe Sprint World Cup - Paris',
    date: '2025-06-20',
    location: 'Paris, France',
    lat: 48.8566,
    lng: 2.3522,
    type: 'Sprint',
    status: 'Upcoming'
  },
  {
    id: 16,
    name: 'ICF Slalom World Cup - Prague',
    date: '2025-06-27',
    location: 'Prague, Czech Republic',
    lat: 50.0755,
    lng: 14.4378,
    type: 'Slalom',
    status: 'Upcoming'
  },
]

function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime()
      const now = new Date().getTime()
      const difference = target - now

      if (difference <= 0) {
        setTimeLeft('Event started')
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)

      setTimeLeft(`${days}d ${hours}h ${minutes}m`)
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [targetDate])

  return <span className="countdown">{timeLeft}</span>
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const eventTypes = [...new Set(SAMPLE_EVENTS.map(e => e.type))]
  const locations = [...new Set(SAMPLE_EVENTS.map(e => e.location).filter(l => l !== 'TBD'))]

  const filteredEvents = useMemo(() => {
    return SAMPLE_EVENTS.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = !selectedType || event.type === selectedType
      const matchesLocation = !selectedLocation || event.location === selectedLocation
      return matchesSearch && matchesType && matchesLocation
    })
  }, [searchTerm, selectedType, selectedLocation])

  const eventsWithCoords = filteredEvents.filter(e => e.lat && e.lng)

  return (
    <div className="app">
      <header className="header">
        <h1>🛶 ICF Events</h1>
        <p>International Canoe Federation Events</p>
      </header>

      <div className="filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search events by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label>Event Type:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="filter-select"
            >
              <option value="">All Types</option>
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Location:</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="filter-select"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {eventsWithCoords.length > 0 && (
        <div className="map-container">
          <MapContainer center={[20, 0]} zoom={3} className="leaflet-map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {eventsWithCoords.map(event => (
              <Marker key={event.id} position={[event.lat, event.lng]}>
                <Popup>
                  <div className="popup-content">
                    <h4>{event.name}</h4>
                    <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>Type:</strong> {event.type}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      <div className="events-container">
        <div className="results-count">
          Found {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
        </div>

        {filteredEvents.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <h3>{event.name}</h3>
                  <span className={`event-type ${event.type.toLowerCase()}`}>
                    {event.type}
                  </span>
                </div>
                <div className="event-details">
                  <p><strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                  <p><strong>📍 Location:</strong> {event.location}</p>
                  <p><strong>Status:</strong> <span className="status upcoming">{event.status}</span></p>
                  <p className="countdown-label"><strong>⏱️ Countdown:</strong></p>
                  <Countdown targetDate={event.date} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No events found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
