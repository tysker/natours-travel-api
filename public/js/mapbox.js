/* eslint-disable */

const locationArray = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken = 'pk.eyJ1IjoidHlza2VyIiwiYSI6ImNsZWczZzJqMDAybnU0NHFyamxrYjRjOHAifQ.KHig0tYLsAO_joZchFEUIg';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/tysker/cleg4s1ao002a01pozpb6xqf4',
  scrollZoom: false,
  // center: [x, y],
  // zoom: 10,
  // interactive: false,
});

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');

const bounds = new mapboxgl.LngLatBounds();

locationArray.forEach(loc => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});

