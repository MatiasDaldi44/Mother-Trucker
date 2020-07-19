L.mapquest.key = "73YJDA218NrKCKrYr26MlqZldZPNKktE";

let pathArray = window.location.pathname.split("/");
let searchTerm = pathArray[pathArray.length - 1];
if (!searchTerm || isNaN(searchTerm)) {
  let arrayOfAddresses = [];
  $.ajax('/api/foodtrucks/', {
    type: "GET"
  }).then(result => {
    if (result.length === 0) {
      $(".map-container").hide();
    } else {
      $(".map-container").show();
      for (i = 0; i < result.length; i++) {
        let fullAddress =
          result[i].truck_name +
          ": " +
          result[i].street_address +
          ", " +
          result[i].city +
          ", " +
          result[i].state +
          " " +
          result[i].zipcode;
        arrayOfAddresses.push(fullAddress);
      }
      Promise.all(arrayOfAddresses)
        .then(() => L.mapquest.geocoding().geocode(arrayOfAddresses, createMap))
    }
  });
} else {
  getMap(parseInt(searchTerm))
}

function getMap(searchTerm) {
  let arrayOfAddresses = [];
  $.ajax("/api/foodtrucks", {
    type: "GET"
  }).then(result => {
    for (i = 0; i < result.length; i++) {
      if (result[i].CategoryId === searchTerm) {
        $(".map-container").show();
        let fullAddress =
          result[i].truck_name +
          ": " +
          result[i].street_address +
          ", " +
          result[i].city +
          ", " +
          result[i].state +
          " " +
          result[i].zipcode;;
        arrayOfAddresses.push(fullAddress);
      }
      if (arrayOfAddresses.length === 0) {
        $(".map-container").hide();
      }
    }
    Promise.all(arrayOfAddresses)
      .then(L.mapquest.geocoding().geocode(arrayOfAddresses, createMap))
  });
}

function createMap(error, response) {
  let map = L.mapquest.map("map", {
    layers: L.mapquest.tileLayer("map"),
    center: [28.536275, -81.382162],
    zoom: 50
  });

  map.addControl(L.mapquest.control({
    position: 'bottomleft'
  }));
  map.addControl(L.mapquest.geocodingControl({
    position: 'topleft'
  }));

  L.marker([0, 0], {
    icon: L.mapquest.icons.marker({
      primaryColor: '#22407F',
      secondaryColor: '#3B5998',
      shadow: true,
      size: 'md',
      symbol: 'A'
    })
  });

  map.on(L.Draw.Event.CREATED, event => {
    const layer = event.layer;

    drawnItems.addLayer(layer);
  });


  const featureGroup = generateMarkersFeatureGroup(response);

  featureGroup.addTo(map);
  map.fitBounds(featureGroup.getBounds());
}

function generateMarkersFeatureGroup(response) {
  const group = [];
  for (let i = 0; i < response.results.length; i++) {
    const location = response.results[i].locations[0];
    const locationLatLng = location.latLng;

    const marker = L.marker(locationLatLng, {
      icon: L.mapquest.icons.marker()
    }).bindPopup(
      response.results[i].providedLocation.street
    );

    group.push(marker);
  }
  return L.featureGroup(group);
}
