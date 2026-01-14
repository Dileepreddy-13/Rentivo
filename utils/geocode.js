
async function geocodeLocation(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Rentivo-App"
    }
  });

  if (!response.ok) {
    throw new Error("Geocoding request failed");
  }

  const data = await response.json();

  if (!data.length) {
    throw new Error("Location not found");
  }

  return [
    parseFloat(data[0].lon),
    parseFloat(data[0].lat)
  ];
}

module.exports = geocodeLocation;
