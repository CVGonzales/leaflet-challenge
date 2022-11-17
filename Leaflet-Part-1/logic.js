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

