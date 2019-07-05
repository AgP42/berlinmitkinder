import mapboxgl from 'mapbox-gl';

const buildMap = (mapElement, center) => {
  mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
  return new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: center,
    zoom: 8
  });
};

// fct to add the places markers on the map
const addMarkersToMap = (map, markers) => {

  const mapMarkers = []

  markers.forEach((marker) => {
    const popup = new mapboxgl.Popup().setHTML(marker.infoWindow);

    const newMarker = new mapboxgl.Marker()
      .setLngLat([ marker.lng, marker.lat ])
      .setPopup(popup)
      .addTo(map);
    mapMarkers.push(newMarker)
    // We use the "getElement" funtion provided by mapbox-gl to access to the marker's HTML and set an id
    newMarker.getElement().dataset.markerId = marker.id;
    // Put a microphone on the new marker listening for a mouseenter event
    newMarker.getElement().addEventListener('mouseenter', (e) => toggleCardHighlighting(e) );
    // We put a microphone on listening for a mouseleave event
    newMarker.getElement().addEventListener('mouseleave', (e) => toggleCardHighlighting(e) );
  });

  openInfoWindow(mapMarkers);
};

// fct to allow marker interaction with cards just with mouseover
const openInfoWindow = (markers) => {

  // Select all cards
  const cards = document.querySelectorAll('.card-trip');

  cards.forEach((card, index) => {

    if (!card.aEventListenerExist) { // if an eventlistener has already been defined, we don't re-set it..., otherwise :

      // search the marker associated to this card
      const cardMarker = markers.filter(marker => marker._element.attributes["data-marker-id"].value == card.dataset.placeId)

      if (cardMarker[0]) { // if it exist (don't know why but several issues without this check...)

        // Put an EventListener on each card listening for a mouseenter event
        card.addEventListener('mouseenter', () => {
          // Here we trigger the display of the corresponding marker infoWindow with the "togglePopup" function provided by mapbox-gl
          card.aaadEventListenerExist = true;
          cardMarker[0].togglePopup();
        });
        // We also put an EventListener listening for a mouseleave event to close the modal when user doesn't hover the card anymore
        card.addEventListener('mouseleave', () => {
          cardMarker[0].togglePopup();
        });
      }
    }
  }); // end forEach card
}

// fct to allow card hightlight with map markers mouseover
const toggleCardHighlighting = (event) => {
  // We select the card corresponding to the marker's id
  const card = document.querySelector(`[data-place-id="${event.currentTarget.dataset.markerId}"]`);
  // Then we toggle the class "highlight" to the card
  card.classList.toggle('highlight');
}

// fct to add the search address on the map (if existing)
const addAddrMarkerToMap = (map, addr) => {
    new mapboxgl.Marker({ "color": "#b40219" })
      .setLngLat([ addr[0], addr[1] ])
      // .setPopup(popup)
      .addTo(map);
};

const fitMapToMarkers = (map, markers) => {
  const bounds = new mapboxgl.LngLatBounds();
  markers.forEach(marker => bounds.extend([ marker.lng, marker.lat ]));
  map.fitBounds(bounds, { padding: 70, maxZoom: 14 });
};

const grabSelectedServices = () => {
    const cb_change_table = document.getElementById('Change_table');
    const cb_baby_chair = document.getElementById('Baby_chair');
    const cb_playing_area = document.getElementById('Playing_area');
    const cb_toys = document.getElementById('Toys');
    const cb_spielplatz = document.getElementById('Public_Playing_area');

    let checkedServicesIds = [];
    if (cb_change_table && cb_change_table.checked) {
      checkedServicesIds.push(parseInt(cb_change_table.value));
    }
    if (cb_baby_chair && cb_baby_chair.checked) {
      checkedServicesIds.push(parseInt(cb_baby_chair.value));
    }
    if (cb_playing_area && cb_playing_area.checked) {
      checkedServicesIds.push(parseInt(cb_playing_area.value));
    }
    if (cb_toys && cb_toys.checked) {
      checkedServicesIds.push(parseInt(cb_toys.value));
    }
    if (cb_spielplatz && cb_spielplatz.checked) {
      checkedServicesIds.push(parseInt(cb_spielplatz.value));
    }
    return checkedServicesIds;
};

const filterMarkersBySelectedServices = (mapElement, checkedServicesIds) => {
    const allMarkers = JSON.parse(mapElement.dataset.markers);

    let markers = [];

    markers = allMarkers.filter((marker, index) => {
      const result = marker.services.filter(service => checkedServicesIds.includes(service)).length == checkedServicesIds.length;

      const card = document.querySelector(`[data-place-id="${marker.id}"]`);

      if (!result) // si result faux c'est qu'il ne faut pas les afficher
      {
        card.classList.add('disabled');
      } else {
        card.classList.remove('disabled');
      }

      return result
    });

    return markers;
};

const defineMapCenter = (addr) => {

    // define the center to the center of Berlin if no address or autolocation
    let center = [13.365783, 52.529846];
    // update if user address available
    if (addr !== null) {
      center = [ addr.addr[1], addr.addr[0] ];
    }

    return center;
};

// fct called at init or each checkbox events
// it display all markers (address filter done in the controller) if no checkbox checked
// otherwise only the selected services are displayed
const displayMapWithFilteredMarkers = () => {
  const mapElement = document.getElementById('map');

  if (mapElement){

    let checkedServicesIds = grabSelectedServices();
    let markers = filterMarkersBySelectedServices(mapElement, checkedServicesIds);

    const addr = JSON.parse(mapElement.dataset.addr);
    let center = defineMapCenter(addr);

    const map = buildMap(mapElement, center);

    if (markers.length != 0){
      addMarkersToMap(map, markers);
      fitMapToMarkers(map, markers);
    }
    if (addr !== null) {
      addAddrMarkerToMap(map, center);
    }
  }
};

const initCheckboxesListener = () => {

  const cb_change_table = document.getElementById('Change_table');
  if (cb_change_table) {
    cb_change_table.onchange = () => {
      displayMapWithFilteredMarkers();
    };
  }

  const cb_baby_chair = document.getElementById('Baby_chair');
  if (cb_baby_chair) {
    cb_baby_chair.onchange = () => {
      displayMapWithFilteredMarkers();
    };
  }

  const cb_playing_area = document.getElementById('Playing_area');
  if (cb_playing_area) {
    cb_playing_area.onchange = () => {
      displayMapWithFilteredMarkers();
    };
  }

  const cb_toys = document.getElementById('Toys');
  if (cb_playing_area) {
    cb_toys.onchange = () => {
      displayMapWithFilteredMarkers();
    };
  }

  const cb_spielplatz = document.getElementById('Public_Playing_area');
  if (cb_spielplatz) {
    cb_spielplatz.onchange = () => {
      displayMapWithFilteredMarkers();
    };
  }

};

const initMapboxWithCheckboxes = () => {
  initCheckboxesListener();
  displayMapWithFilteredMarkers();
};

export { initMapboxWithCheckboxes };
