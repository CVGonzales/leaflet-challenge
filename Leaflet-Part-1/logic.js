const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

const sigs = [10, 30, 75, 150, 300];
const colours = ["lightyellow", "khaki", "gold", "orange", "orangered", "darkred"];

d3.json(url).then(function (data) {

  createFeatures(data.features);

});

// Marker size affected by magnitude
function markerSize(mag) {
  return ((mag+3)*0.6)**2;
}

// Marker colour affected by depth(sig)
function markerColor(depth){
  if ( depth <= sigs[0] ) {
    return colours[0];
  } else
  if ( depth < sigs[1]) {
    return colours[1];
  } else
  if ( depth < sigs[2]) {
    return colours[2];
  } else
  if ( depth < sigs[3]) {
    return colours[3];
  } else
  if ( depth < sigs[4]) {
    return colours[4];
  } else {
    return colours[5];
  }
}

// Create earthquakes layer and popup and pass to createMap() function
var min=0;
var max=0;
function createFeatures(earthquakeData) {

  function addPopup(feature, layer) {
    layer.bindPopup(`<h2>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km<br><h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    
    if ( min > feature.geometry.coordinates[2] ) {
      min = feature.geometry.coordinates[2];
    }
    if ( max < feature.geometry.coordinates[2] ) {
      max = feature.geometry.coordinates[2];
    }
  }

  let earthquakesLayer = L.geoJSON(earthquakeData, {
    onEachFeature: addPopup,
    pointToLayer(feature,latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        color: markerColor(feature.geometry.coordinates[2]),
        weight: 1,
        opacity: 1,
        fillopacity: 0.6
      });
    }
  });

  createMap(earthquakesLayer);
}

// createMap() takes the earthquake data and incorporates it into the visualization:
function createMap(earthquakesLayer) {
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    // Create baseMaps object.
    let baseMaps = {
      "World Map": street
    };
  
    // Create overlays object.
    let overlayMaps ={
      "Earthquakes" : earthquakesLayer
    }
  
    // Create new map.
    let myMap = L.map("map", {
      center: [
        -26.23, 135.39
      ],
      zoom: 3,
      layers: [street,earthquakesLayer]
    });
  
    // Create a layer control that contains our baseMaps.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);