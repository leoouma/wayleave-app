// map class initialize
var map = L.map("map").setView([-3.42, 39.9093], 11);
map.zoomControl.setPosition("topright");

// adding various tilelayer
var googleHybrid = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
).addTo(map);

var googleStreets = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);

var googleSat = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);

var googleTerrain = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);

//add map scale
L.control.scale().addTo(map);

//Map coordinate display
map.on("mousemove", function (e) {
  $(".coordinate").html(`Lat: ${e.latlng.lat} Lng: ${e.latlng.lng}`);
});

//Geojson load towers
var centroids = L.markerClusterGroup();
var data = L.geoJSON(towers, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<b>Tower ID: </b>" +
        feature.properties.towerid +
        "<br>" +
        "<b>Span: </b>" +
        feature.properties.forwardspan +
        " Metres" +
        "<br>" +
        "<b>Height: </b>" +
        feature.properties.height +
        " Metres"
    );
  },
});
data.addTo(centroids);
centroids.addTo(map);

//Geojson load Kilifi
const cBoundary = L.markerClusterGroup();
const bdata = L.geoJSON(kilifi, {
  onEachFeature: function (feature, layer) {
    layer.setStyle({ color: "brown", fillColor: "#30D5C8", weight: 1 });
  },
});
bdata.addTo(cBoundary);
cBoundary.addTo(map);

//Geojson load land parcels
var surveyblocks = L.markerClusterGroup();
var surv = L.geoJSON(landparcels2, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<b>Parcel ID:</b> " +
        feature.properties.parcelid +
        "<br>" +
        "<b>Registered Area</b>" +
        feature.properties.regarea +
        "<br>" +
        "<b>Trace Area: </b>" +
        feature.properties.tracearea +
        " Ha" +
        "<br>" +
        "<b>Amount Paid: </b>" +
        "KES " +
        feature.properties.valuationamount
    );
    layer.setStyle({
      color: "black",
      fillColor: "grey",
      fillOpacity: 0.3,
      weight: 1,
    });
  },
});
surv.addTo(surveyblocks);
surveyblocks.addTo(map);

//Geojson load centerline
var nairobiVillages = L.markerClusterGroup();
var vill = L.geoJSON(centerline, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<b>Project: </b>" +
        feature.properties.projectnam +
        "<br>" +
        "<b>Voltage: </b>" +
        feature.properties.voltage +
        " kV" +
        "<br>" +
        "<b>Total Length : </b>" +
        feature.properties.length +
        " Kilometres"
    );
    layer.setStyle({ color: "red" });
  },
});
vill.addTo(nairobiVillages);
nairobiVillages.addTo(map);

//Geojson load Wayleave Trace
var nairobiSublocs = L.markerClusterGroup();
var sublocs = L.geoJSON(wayleavetrace, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<b>Project Name : </b>" +
        feature.properties.projectnam +
        "<br>" +
        "<b>Width: </b>" +
        feature.properties.width +
        " Metres"
    );
    layer.setStyle({ color: "green", fillColor: "#17436E", fillOpacity: 0.3 });
  },
});
sublocs.addTo(nairobiSublocs);
nairobiSublocs.addTo(map);

//Leaflet layer control
var baseMaps = {
  "Google Hybrid": googleHybrid,
  "Google Streets": googleStreets,
  "Google Satelite": googleSat,
  "Google Terrain": googleTerrain,
};

var overlayMaps = {
  "Kilifi Sub Counties": cBoundary,
  "Center Line": nairobiVillages,
  "Wayleave Trace": nairobiSublocs,
  "Tower Points": centroids,
  "Land Parcels": surveyblocks,
};

L.control
  .layers(baseMaps, overlayMaps, { collapsed: true, position: "topleft" })
  .addTo(map);
