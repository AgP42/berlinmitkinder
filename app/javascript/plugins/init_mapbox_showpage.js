import mapboxgl from 'mapbox-gl';


const buildMap = (mapElementShow, center) => {
  mapboxgl.accessToken = mapElementShow.dataset.mapboxApiKey;
  return new mapboxgl.Map({
    container: 'show_map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: center,
    zoom: 8
  });
};

const addMarkersToMap = (map, marker) => {
    const popup = new mapboxgl.Popup().setHTML(marker.infoWindow);

    new mapboxgl.Marker()
      .setLngLat([ marker.lng, marker.lat ])
      .setPopup(popup)
      .addTo(map);

};

const fitMapToMarkers = (map, marker) => {
  const bounds = new mapboxgl.LngLatBounds();
  bounds.extend([ marker.lng, marker.lat ]);
  map.fitBounds(bounds, { padding: 70, maxZoom: 14 });
};

const initMapbox = () => {

  const mapElementShow = document.getElementById('show_map');

  if (mapElementShow) {
    const markers = JSON.parse(mapElementShow.dataset.markers);
    // console.log(markers)
    const center = [ markers.lng , markers.lat ]
    const map = buildMap(mapElementShow, center);
    addMarkersToMap(map, markers);
    fitMapToMarkers(map, markers);
  }
};

export { initMapbox };
