import places from 'places.js';

const initAutocomplete = () => {
  const addressInput = document.getElementById('address');

  if (addressInput) {
    let placesAutocomplete = places({ container: addressInput }).configure({
      countries: ['de']
    });

    let $button = document.querySelector('.ap-icon-pin');

    /* If the user does a click on the Locate me button, do a reverse query */
    $button.addEventListener('click', function(e) {
      e.preventDefault();
      $button.textContent = 'Searching...';

      navigator.geolocation.getCurrentPosition(function(position) {
        // console.log(position.coords.latitude, position.coords.longitude);
        const newURL = window.location.pathname + `?&lat=${position.coords.latitude}&long=${position.coords.longitude}`;
        window.location = newURL;

      });

    });

  }
};

const initAutocompleteNewForm = () => {
  const addressInput = document.getElementById('place_address');
  // console.log("hello");

  if (addressInput) {
    let placesAutocomplete = places({ container: addressInput }).configure({
      countries: ['de']
    });
  }

};

export { initAutocomplete };
export { initAutocompleteNewForm };

