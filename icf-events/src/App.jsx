import { useState, useMemo } from 'react'
import './App.css'

const SAMPLE_EVENTS = [
  {
    id: 1,
    name: 'ICF Canoe Sprint World Championships',
    date: '2024-08-10',
    location: 'Budapest, Hungary',
    type: 'Sprint',
    status: 'Upcoming'
  },
  {
    id: 2,
    name: 'ICF Slalom World Cup',
    date: '2024-04-15',
    location: 'Ljubljana, Slovenia',
    type: 'Slalom',
    status: 'Upcoming'
  },
  {
    id: 3,
    name: 'ICF Marathon Canoe World Championships',
    date: '2024-09-22',
    location: 'Egypt',
    type: 'Marathon',
    status: 'Upcoming'
  },
  {
    id: 4,
    name: 'ICF Canoe Slalom European Championships',
    date: '2024-06-05',
    location: 'Krakow, Poland',
    type: 'Slalom',
    status: 'Upcoming'
  },
  {
    id: 5,
    name: 'ICF Wildwater Canoeing World Championships',
    date: '2024-10-12',
    location: 'Portugal',
    type: 'Wildwater',
    status: 'Upcoming'
  },
  {
    id: 6,
    name: 'ICF Sprint European Championships',
    date: '2024-07-20',
    location: 'Poznań, Poland',
    type: 'Sprint',
    status: 'Upcoming'
  },
  {
    id: 7,
    name: 'ICF Dragon Boat World Championships',
    date: '2024-11-08',
    location: 'China',
    type: 'Dragon Boat',
    status: 'Upcoming'
  },
  {
    id: 8,
    name: 'ICF Canoe Polo World Championships',
    date: '2024-08-25',
    location: 'Rome, Italy',
    type: 'Polo',
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
