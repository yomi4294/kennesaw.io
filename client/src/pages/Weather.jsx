import { useState } from 'react';

const CITIES = [
  'Atlanta', 'New York', 'Los Angeles', 'Houston', 'New Orleans',
  'Dallas', 'Miami', 'Raleigh', 'Cleveland', 'Portland', 'Phoenix', 'San Jose',
];

const WEATHER_ICONS = {
  'clear sky': '☀️',
  'few clouds': '🌤️',
  'scattered clouds': '⛅️',
  'broken clouds': '🌁',
  'overcast clouds': '🌥',
  'light rain': '🌧',
  'moderate rain': '🌧',
  'heavy intensity rain': '⛈',
  'thunderstorm': '⛈',
  'light snow': '❄️',
  'snow': '❄️',
  'mist': '🌫️',
  'fog': '🌫️',
};

function getIcon(desc) {
  return WEATHER_ICONS[desc.toLowerCase()] || '🌡️';
}

export default function Weather() {
  const [city, setCity] = useState('');
  const [type, setType] = useState('weather');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchWeather(selectedCity, selectedType) {
    if (!selectedCity) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(selectedCity)}&type=${selectedType}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || json.error || 'Request failed');
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCityChange(e) {
    const val = e.target.value;
    setCity(val);
    if (val) fetchWeather(val, type);
  }

  function handleTypeChange(e) {
    const val = e.target.value;
    setType(val);
    setCity('');
    setData(null);
  }

  const isCurrentWeather = type === 'weather';

  return (
    <div>
      <h2>Weather App</h2>
      <p style={{ marginBottom: '16px', color: '#666' }}>Current weather and 5-day forecasts for major US cities.</p>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
          <input type="radio" name="type" value="weather" checked={type === 'weather'} onChange={handleTypeChange} />
          Current Weather
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
          <input type="radio" name="type" value="forecast" checked={type === 'forecast'} onChange={handleTypeChange} />
          5-Day Forecast
        </label>

        <select value={city} onChange={handleCityChange} disabled={loading}>
          <option value="">Select a city…</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading && <p className="loading" style={{ marginTop: '20px' }}>Loading weather data…</p>}
      {error && <p className="error" style={{ marginTop: '16px' }}>{error}</p>}

      {data && isCurrentWeather && (
        <div className="weather-box">
          <div style={{ fontSize: '14px', marginBottom: '4px', color: '#adc6e5' }}>
            {new Date(data.dt * 1000).toLocaleString()}
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{data.name}</div>
          <div className="temp">{Math.round(data.main.temp)}°C</div>
          {data.weather.map((w) => (
            <div key={w.id} className="desc">
              {getIcon(w.description)} {w.description}
            </div>
          ))}
          <div className="meta">
            Feels like {Math.round(data.main.feels_like)}°C &nbsp;·&nbsp;
            Humidity {data.main.humidity}% &nbsp;·&nbsp;
            Wind {Math.round(data.wind.speed)} m/s
          </div>
        </div>
      )}

      {data && !isCurrentWeather && data.list && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '12px' }}>5-Day Forecast for {data.city?.name}</h3>
          {(() => {
            // Group by day
            const days = {};
            data.list.forEach((item) => {
              const day = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
              if (!days[day]) days[day] = [];
              days[day].push(item);
            });
            return Object.entries(days).map(([day, items]) => {
              const temps = items.map((i) => i.main.temp);
              const min = Math.round(Math.min(...temps));
              const max = Math.round(Math.max(...temps));
              const desc = items[Math.floor(items.length / 2)].weather[0].description;
              return (
                <div key={day} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{day}</strong>
                  <span>{getIcon(desc)} {desc}</span>
                  <span>{min}°C – {max}°C</span>
                </div>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
}
