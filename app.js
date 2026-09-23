const weatherTemp = document.getElementById('weather-temp');
const weatherSummary = document.getElementById('weather-summary');
const weatherLocation = document.getElementById('weather-location');
const weatherIcon = document.getElementById('weather-icon');

function getWeatherEmoji(code) {
  const clear = [0];
  const partlyCloudy = [1, 2, 3];
  const fog = [45, 48];
  const drizzle = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67];
  const snow = [71, 73, 75, 77, 85, 86];
  const thunder = [95, 96, 99];

  if (clear.includes(code)) return '☀️';
  if (partlyCloudy.includes(code)) return '⛅';
  if (fog.includes(code)) return '🌫️';
  if (drizzle.includes(code)) return '🌦️';
  if (snow.includes(code)) return '❄️';
  if (thunder.includes(code)) return '⛈️';
  return '🌤️';
}

function getWeatherLabel(code) {
  const labels = {
    0: 'Clear',
    1: 'Mostly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Rime fog',
    51: 'Light drizzle',
    53: 'Drizzle',
    55: 'Heavy drizzle',
    56: 'Freezing drizzle',
    57: 'Heavy freezing drizzle',
    61: 'Light rain',
    63: 'Rain',
    65: 'Heavy rain',
    66: 'Freezing rain',
    67: 'Heavy freezing rain',
    71: 'Light snow',
    73: 'Snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Rain showers',
    81: 'Heavy showers',
    82: 'Violent showers',
    85: 'Light snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Severe thunderstorm'
  };

  return labels[code] || 'Current conditions';
}

function updateWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Weather fetch failed');
      }
      return response.json();
    })
    .then((data) => {
      const temperature = Math.round(data.current.temperature_2m);
      const code = data.current.weather_code;
      const summary = getWeatherLabel(code);

      weatherTemp.textContent = `${temperature}°F`;
      weatherSummary.textContent = summary;
      weatherIcon.textContent = getWeatherEmoji(code);
      weatherLocation.textContent = data.timezone || 'Your location';
    })
    .catch(() => {
      weatherTemp.textContent = 'Unavailable';
      weatherSummary.textContent = 'Location weather is temporarily unavailable.';
      weatherLocation.textContent = 'Try again in a moment';
      weatherIcon.textContent = '🌍';
    });
}

function showLocationDenied() {
  weatherTemp.textContent = 'Enable location';
  weatherSummary.textContent = 'Enable location to see your weather.';
  weatherLocation.textContent = 'Weather unavailable';
  weatherIcon.textContent = '📍';
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      updateWeather(position.coords.latitude, position.coords.longitude);
    },
    () => {
      showLocationDenied();
    },
    { enableHighAccuracy: true, timeout: 15000 }
  );
} else {
  showLocationDenied();
}
