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

// Calculate distance between two coordinates (in km)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return (R * c).toFixed(0)
}

const SAMPLE_EVENTS = [
  {
    id: 1,
    name: 'ICF Slalom World Cup - Ivrea',
    date: '2026-04-11',
    location: 'Ivrea, Italy',
    lat: 45.4615,
    lng: 7.8744,
    type: 'Slalom',
    status: 'Upcoming',
    description: 'Technical slalom gates on the Dora Baltea River - first major event of spring',
    trackDistance: '350m',
    trackType: 'Rapid Natural Course',
    difficulty: 'Advanced',
    capacity: '1,500 spectators'
  },
  {
    id: 2,
    name: 'ICF Canoe Sprint World Cup - Szeged',
    date: '2026-05-16',
    location: 'Szeged, Hungary',
    lat: 46.2530,
    lng: 20.1461,
    type: 'Sprint',
    status: 'Upcoming',
    description: 'World-class sprint racing on the Tisza River in Hungary',
    trackDistance: '250m',
    trackType: 'Outdoor Straight Course',
    difficulty: 'Elite',
    capacity: '2,500 spectators'
  },
  {
    id: 3,
    name: 'ICF Slalom World Cup - Markkleeberg',
    date: '2026-05-09',
    location: 'Markkleeberg, Germany',
    lat: 51.3227,
    lng: 12.3674,
    type: 'Slalom',
    status: 'Upcoming',
    description: 'Challenging whitewater slalom in Leipzig - Olympic standard venue',
    trackDistance: '300m',
    trackType: 'Artificial Whitewater',
    difficulty: 'Advanced',
    capacity: '4,000 spectators'
  },
  {
    id: 4,
    name: 'ICF Sprint European Championships',
    date: '2026-06-14',
    location: 'Plovdiv, Bulgaria',
    lat: 42.1481,
    lng: 24.7504,
    type: 'Sprint',
    status: 'Upcoming',
    description: 'Europe\'s best sprint paddlers compete on the Danube',
    trackDistance: '250m',
    trackType: 'River Straight Course',
    difficulty: 'Elite',
    capacity: '3,500 spectators'
  },
  {
    id: 5,
    name: 'ICF Canoe Sprint World Cup - Poznań',
    date: '2026-05-23',
    location: 'Poznań, Poland',
    lat: 52.4082,
    lng: 16.9454,
    type: 'Sprint',
    status: 'Upcoming',
    description: 'Sprint competition on Malta Lake - premier Polish venue',
    trackDistance: '250m',
    trackType: 'Lake Straight Course',
    difficulty: 'Elite',
    capacity: '3,000 spectators'
  },
  {
    id: 6,
    name: 'ICF Canoe Sprint World Cup - Paris',
    date: '2026-06-20',
    location: 'Paris, France',
    lat: 48.8566,
    lng: 2.3522,
    type: 'Sprint',
    status: 'Upcoming',
    description: 'Sprint racing in the heart of Paris on the Seine River',
    trackDistance: '250m',
    trackType: 'River Course',
    difficulty: 'Elite',
    capacity: '4,500 spectators'
  },
  {
    id: 7,
    name: 'ICF Slalom World Cup - Prague',
    date: '2026-06-27',
    location: 'Prague, Czech Republic',
    lat: 50.0755,
    lng: 14.4378,
    type: 'Slalom',
    status: 'Upcoming',
    description: 'Slalom competition on the Vltava River - summer highlight',
    trackDistance: '350m',
    trackType: 'River Rapid Course',
    difficulty: 'Advanced',
    capacity: '3,000 spectators'
  },
  {
    id: 8,
    name: 'ICF Slalom European Championships',
    date: '2026-07-16',
    location: 'Krakow, Poland',
    lat: 50.0647,
    lng: 19.9450,
    type: 'Slalom',
    status: 'Upcoming',
    description: 'Top European slalom athletes showcase skills in Krakow',
    trackDistance: '350m',
    trackType: 'River Course',
    difficulty: 'Advanced',
    capacity: '2,500 spectators'
  },
  {
    id: 9,
    name: 'ICF Canoe Sprint U23 & Junior World Championships',
    date: '2026-08-01',
    location: 'Belgrade, Serbia',
    lat: 44.8176,
    lng: 20.4572,
    type: 'Sprint',
    status: 'Upcoming',
    description: 'Next generation of sprint champions compete on the Danube',
    trackDistance: '250m',
    trackType: 'River Straight Course',
    difficulty: 'Elite',
    capacity: '5,000 spectators'
  },
  {
    id: 10,
    name: 'ICF Canoe Polo World Championships',
    date: '2026-08-15',
    location: 'London, England',
    lat: 51.5074,
    lng: -0.1278,
    type: 'Polo',
    status: 'Upcoming',
    description: 'Team-based canoe polo action - thrilling international competition',
    trackDistance: '60x40m',
    trackType: 'Pool Course',
    difficulty: 'Intermediate',
    capacity: '2,000 spectators'
  },
  {
    id: 11,
    name: 'ICF Canoe Sprint World Championships',
    date: '2026-09-13',
    location: 'Rio de Janeiro, Brazil',
    lat: -22.9068,
    lng: -43.1729,
    type: 'Sprint',
    status: 'Upcoming',
    description: 'Elite sprint racing on a world-class South American venue',
    trackDistance: '250m',
    trackType: 'Lake Straight Course',
    difficulty: 'Elite',
    capacity: '8,000 spectators'
  },
  {
    id: 12,
    name: 'ICF Canoe Slalom World Championships',
    date: '2026-09-08',
    location: 'Augsburg, Germany',
    lat: 48.3668,
    lng: 10.8927,
    type: 'Slalom',
    status: 'Upcoming',
    description: 'The ultimate test of slalom skills at Europe\'s premier whitewater venue',
    trackDistance: '300m',
    trackType: 'Artificial Whitewater',
    difficulty: 'Advanced',
    capacity: '6,000 spectators'
  },
  {
    id: 13,
    name: 'ICF Marathon European Championships',
    date: '2026-09-28',
    location: 'Portugal',
    lat: 39.3999,
    lng: -8.2245,
    type: 'Marathon',
    status: 'Upcoming',
    description: 'Endurance test across Portuguese waterways - scenic and challenging',
    trackDistance: '42km',
    trackType: 'Long Distance River Course',
    difficulty: 'Elite',
    capacity: '2,000 spectators'
  },
  {
    id: 14,
    name: 'ICF Dragon Boat World Championships',
    date: '2026-11-15',
    location: 'Guangzhou, China',
    lat: 23.1291,
    lng: 113.2644,
    type: 'Dragon Boat',
    status: 'Upcoming',
    description: 'Traditional dragon boat racing at its finest in China',
    trackDistance: '500m',
    trackType: 'Straight Racing Course',
    difficulty: 'Intermediate',
    capacity: '10,000 spectators'
  },
  {
    id: 15,
    name: 'ICF Canoe Marathon World Championships',
    date: '2026-10-04',
    location: 'Treia, Italy',
    lat: 43.2243,
    lng: 13.2349,
    type: 'Marathon',
    status: 'Upcoming',
    description: 'Long-distance endurance championship - ultimate test of stamina',
    trackDistance: '50km',
    trackType: 'Marathon River Course',
    difficulty: 'Elite',
    capacity: '1,500 spectators'
  },
  {
    id: 16,
    name: 'ICF Wildwater Canoeing World Championships',
    date: '2027-06-15',
    location: 'Meuse River, France',
    lat: 49.5000,
    lng: 5.2500,
    type: 'Wildwater',
    status: 'Upcoming',
    description: 'Navigate challenging rapids and natural obstacles in a true wilderness setting',
    trackDistance: '20km',
    trackType: 'Wild Rapid Course',
    difficulty: 'Advanced',
    capacity: '1,200 spectators'
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
    const timer = setInterval(calculateTimeLeft, 60000)

    return () => clearInterval(timer)
  }, [targetDate])

  return <span className="countdown">{timeLeft}</span>
}

function EventModal({ event, onClose, allEvents }) {
  if (!event) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-body">
          <h2>{event.name}</h2>

          <div className="modal-meta">
            <div className="meta-item">
              <strong>📅 Date:</strong>
              <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="meta-item">
              <strong>📍 Location:</strong>
              <span>{event.location}</span>
            </div>
            <div className="meta-item">
              <strong>🏷️ Type:</strong>
              <span className={`event-type ${event.type.toLowerCase()}`}>{event.type}</span>
            </div>
            <div className="meta-item">
              <strong>⏱️ Countdown:</strong>
              <Countdown targetDate={event.date} />
            </div>
          </div>

          <div className="modal-details">
            <h3>Event Details</h3>
            <p className="description">{event.description}</p>

            <div className="details-grid">
              <div className="detail-box">
                <strong>📏 Track Distance</strong>
                <p>{event.trackDistance}</p>
              </div>
              <div className="detail-box">
                <strong>🏁 Track Type</strong>
                <p>{event.trackType}</p>
              </div>
              <div className="detail-box">
                <strong>💪 Difficulty</strong>
                <p className="difficulty-badge">{event.difficulty}</p>
              </div>
              <div className="detail-box">
                <strong>👥 Capacity</strong>
                <p>{event.capacity}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ICFEventsApp() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)

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
                  <div className="popup-content" onClick={() => setSelectedEvent(event)}>
                    <h4>{event.name}</h4>
                    <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>Type:</strong> {event.type}</p>
                    <button className="popup-button">View Details</button>
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
              <div key={event.id} className="event-card" onClick={() => setSelectedEvent(event)}>
                <div className="event-header">
                  <h3>{event.name}</h3>
                  <span className={`event-type ${event.type.toLowerCase()}`}>
                    {event.type}
                  </span>
                </div>
                <div className="event-details">
                  <p><strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                  <p><strong>📍 Location:</strong> {event.location}</p>
                  <p><strong>📏 Track:</strong> {event.trackDistance}</p>
                  <p><strong>Status:</strong> <span className="status upcoming">{event.status}</span></p>
                  <p className="countdown-label"><strong>⏱️ Countdown:</strong></p>
                  <Countdown targetDate={event.date} />
                  <button className="view-details-btn">Click for more details →</button>
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

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} allEvents={filteredEvents} />
    </div>
  )
}
