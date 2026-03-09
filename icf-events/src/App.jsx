import { useState, useMemo } from 'react'
import './App.css'

const SAMPLE_EVENTS = [
  {
    id: 1,
    name: 'ICF Canoe Sprint World Cup - Szeged',
    date: '2025-05-16',
    location: 'Szeged, Hungary',
    type: 'Sprint',
    status: 'Upcoming'
  },
  {
    id: 2,
    name: 'ICF Canoe Sprint World Cup - Poznań',
    date: '2025-05-23',
    location: 'Poznań, Poland',
    type: 'Sprint',
    status: 'Upcoming'
  },
  {
    id: 3,
    name: 'ICF Slalom World Cup - Ivrea',
    date: '2025-04-11',
    location: 'Ivrea, Italy',
    type: 'Slalom',
    status: 'Upcoming'
  },
  {
    id: 4,
    name: 'ICF Slalom World Cup - Markkleeberg',
    date: '2025-05-09',
    location: 'Markkleeberg, Germany',
    type: 'Slalom',
    status: 'Upcoming'
  },
  {
    id: 5,
    name: 'ICF Canoe Sprint U23 & Junior World Championships',
    date: '2025-08-01',
    location: 'Belgrade, Serbia',
    type: 'Sprint',
    status: 'Upcoming'
  },
  {
    id: 6,
    name: 'ICF Canoe Slalom World Championships',
    date: '2025-09-08',
    location: 'Brasília, Brazil',
    type: 'Slalom',
    status: 'Upcoming'
  },
  {
    id: 7,
    name: 'ICF Canoe Marathon World Championships',
    date: '2025-10-04',
    location: 'TBD',
    type: 'Marathon',
    status: 'Upcoming'
  },
  {
    id: 8,
    name: 'ICF Canoe Sprint World Championships',
    date: '2025-09-13',
    location: 'Tokyo, Japan',
    type: 'Sprint',
    status: 'Upcoming'
  },
  {
    id: 9,
    name: 'ICF Wildwater Canoeing World Championships',
    date: '2026-06-15',
    location: 'TBD',
    type: 'Wildwater',
    status: 'Upcoming'
  },
  {
    id: 10,
    name: 'ICF Dragon Boat World Championships',
    date: '2025-11-15',
    location: 'China',
    type: 'Dragon Boat',
    status: 'Upcoming'
  },
  {
    id: 11,
    name: 'ICF Canoe Polo World Championships',
    date: '2026-08-01',
    location: 'TBD',
    type: 'Polo',
    status: 'Upcoming'
  },
  {
    id: 12,
    name: 'ICF Sprint European Championships',
    date: '2025-06-14',
    location: 'Plovdiv, Bulgaria',
    type: 'Sprint',
    status: 'Upcoming'
  },
  {
    id: 13,
    name: 'ICF Slalom European Championships',
    date: '2025-07-16',
    location: 'Krakow, Poland',
    type: 'Slalom',
    status: 'Upcoming'
  },
  {
    id: 14,
    name: 'ICF Marathon European Championships',
    date: '2025-09-28',
    location: 'Portugal',
    type: 'Marathon',
    status: 'Upcoming'
  },
  {
    id: 15,
    name: 'ICF Canoe Sprint World Cup - Paris',
    date: '2025-06-20',
    location: 'Paris, France',
    type: 'Sprint',
    status: 'Upcoming'
  },
  {
    id: 16,
    name: 'ICF Slalom World Cup - Prague',
    date: '2025-06-27',
    location: 'Prague, Czech Republic',
    type: 'Slalom',
    status: 'Upcoming'
  },
]

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const eventTypes = [...new Set(SAMPLE_EVENTS.map(e => e.type))]
  const locations = [...new Set(SAMPLE_EVENTS.map(e => e.location))]

  const filteredEvents = useMemo(() => {
    return SAMPLE_EVENTS.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = !selectedType || event.type === selectedType
      const matchesLocation = !selectedLocation || event.location === selectedLocation
      return matchesSearch && matchesType && matchesLocation
    })
  }, [searchTerm, selectedType, selectedLocation])

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
