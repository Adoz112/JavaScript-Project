console.log("launching map of TERROR!")

//Create layer groups: one for each terror attack group
var markers = L.layerGroup();
var assasination = L.layerGroup();
var kidnapping = L.layerGroup();
var bombing = L.layerGroup();
var facility = L.layerGroup();
var armed = L.layerGroup();
var hijacking = L.layerGroup();
var unknown = L.layerGroup();
var unarmed = L.layerGroup();
var hostage = L.layerGroup();

//Set up icon class
var terrorIcon = L.Icon.extend({
    options: {
        iconSize: [25,25],
    //    popupAnchor: [-3,25]
    }
})

//Set up each icon image for each layer above
var assaIcon = new terrorIcon({iconUrl:'static/icons/assassin.png'}),
      kidnIcon = new terrorIcon({iconUrl:'/static/icons/kidnapping.png'}),
      bombIcon = new terrorIcon({iconUrl:'/static/icons/bomb.png'}),
      faciIcon = new terrorIcon({iconUrl:'/static/icons/infrastructure.png'}),
      armeIcon = new terrorIcon({iconUrl:'/static/icons/armedassault.png'}),
      hijaIcon = new terrorIcon({iconUrl:'/static/icons/hijack.png'}),
      unknIcon = new terrorIcon({iconUrl:'/static/icons/question.png'}),
      unarIcon = new terrorIcon({iconUrl:'/static/icons/punch.png'}),
      hostIcon = new terrorIcon({iconUrl:'/static/icons/hostage.png'});

//Set up map instance
var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [assasination, kidnapping, bombing, facility, armed, hijacking, unknown, unarmed, hostage]
 });

 // Add a tile layer
 var landMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
   maxZoom: 18,
   id: "mapbox.light",
   accessToken: API_KEY
 }).addTo(myMap);

 // New Map for Chart-01 box

 //Set up map instance
 //var tMap = L.map("smlmap").setView([45.52, -122.67], 2);

 var tMap = L.map("smlmap", {
    center: [41.6488, -0.8891],
    zoom: 2,
    layers: [markers]
});

  // Add a tile layer
 var smallMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  }).addTo(tMap);

function buildSmlMap(year){
  markers.clearLayers();
 // tMap.removeLayer(marker);
  var url = `/smallmap/${year}`;
  d3.json(url).then(function(response) {

    var arr = response.centlat;
    var lookup = {};

    for (var i = 0; i < Object.keys(response.centlat).length; i++) {
        if(!(arr[i] in lookup)){
            lookup[arr[i]] = 0;
        }
         lookup[arr[i]] += 1;

    }


  for (var i = 0; i < Object.keys(response.centlat).length; i++) {
    var latitude = response.centlat[i];
    var longitude = response.centlong[i];
  //  if (!isNaN(latitude) && (latitude != 0)) {

    var numMarker = L.ExtraMarkers.icon({
        icon: 'fa-number',
        number: lookup[response.centlat[i]],
        markerColor: 'blue'
        });

      L.marker([latitude, longitude],{icon: numMarker}).addTo(markers);
  //  }

}
});
}

// define contol titles for map
 var overlayMaps = {
     "Assasination": assasination,
     "Kidnapping": kidnapping,
     "Bombing": bombing,
     "Facility/Infrastructure": facility,
     "Armed Assault": armed,
     "Hijacking": hijacking,
     "Unknown": unknown,
     "Unarmed Assault": unarmed,
     "Hostage Taking": hostage
 };

 // Pass our map layers into our layer control
 // Add the layer control to the map
 // Using null due to single baseMap choice
 L.control.layers(null, overlayMaps, {
     collapsed: false
 }).addTo(myMap);


function buildMap(year,country){
//    console.log(year);

// TODO: Need to add country to position and pull in centlat and centlong
// Need to
    var url = `/position/${year}/${country}`;
    d3.json(url).then(function(response) {
    //    console.log(response.centlat);
    // clear out old markers on map
   // markers.clearLayers();
    assasination.clearLayers();
    kidnapping.clearLayers();
    bombing.clearLayers();
    facility.clearLayers();
    armed.clearLayers();
    hijacking.clearLayers();
    unknown.clearLayers();
    unarmed.clearLayers();
    hostage.clearLayers();
//    console.log(Object.keys(response.longitude).length);
    //cycle through all records and attach the correct icon and location to the correct attack layer
    for (var i = 0; i < Object.keys(response.longitude).length; i++) {
         var yearly = response.iyear[i];
         var latitude = response.latitude[i];
         var longitude = response.longitude[i];
         var target = response.targtype1_txt[i];
         var subtarget = response.targsubtype1_txt[i];
         if (!isNaN(latitude) && (latitude != 0)) {
             switch (response.attacktype1_txt[i]) {
                case 'Assassination':
                    if (!subtarget) {
                    L.marker([latitude, longitude], {icon: assaIcon}).addTo(assasination)
                        .bindPopup(response.attacktype1_txt[i] + '<br>Target: '+ target + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                    } else {
                    L.marker([latitude, longitude], {icon: assaIcon}).addTo(assasination)
                        .bindPopup(response.attacktype1_txt[i] + '<br>Target: '+ target + '<br>Aim: ' + subtarget + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                    }
                    break;
                case 'Hostage Taking (Kidnapping)':
                    if (!subtarget) {
                    L.marker([latitude, longitude], {icon: kidnIcon}).addTo(kidnapping)
                        .bindPopup(response.attacktype1_txt[i] + '<br>Target: '+ target + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                    } else {
                    L.marker([latitude, longitude], {icon: kidnIcon}).addTo(kidnapping)
                        .bindPopup(response.attacktype1_txt[i] + '<br>Target: '+ target + '<br>Aim: ' + subtarget + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                    }
                    break;
                case 'Bombing/Explosion':
                    if (!subtarget) {
                    L.marker([latitude, longitude], {icon: bombIcon}).addTo(bombing)
                        .bindPopup(response.attacktype1_txt[i] + '<br>Target: '+ target + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                    } else {
                    L.marker([latitude, longitude], {icon: bombIcon}).addTo(bombing)
                        .bindPopup(response.attacktype1_txt[i] + '<br>Target: '+ target + '<br>Aim: ' + subtarget + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                    }
                    break;
                case 'Facility/Infrastructure Attack':
                    if (!subtarget) {
                    L.marker([latitude, longitude], {icon: faciIcon}).addTo(facility)
                        .bindPopup(response.attacktype1_txt[i] + '<br>Target: '+ target + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                    } else {
                    L.marker([latitude, longitude], {icon: faciIcon}).addTo(facility)
                        .bindPopup(response.attacktype1_txt[i] + '<br>Target: '+ target + '<br>Aim: ' + subtarget + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                    }
                    break;
                case 'Armed Assault':
                    if (!subtarget) {
                    L.marker([latitude, longitude], {icon: armeIcon}).addTo(armed)
                        .bindPopup(response.attacktype1_txt[i] + '<br>Target: '+ target + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                    } else {
                    L.marker([latitude, longitude], {icon: armeIcon}).addTo(armed)
                        .bindPopup(response.attacktype1_txt[i] + '<br>Target: '+ target + '<br>Aim: ' + subtarget + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                    }
                    break;
                case 'Hijacking':
                    if (!subtarget) {
                L.marker([latitude, longitude], {icon: hijaIcon}).addTo(hijacking)
                    .bindPopup(response.attacktype1_txt[i] + '<br>Target: '+ target + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                } else {
                L.marker([latitude, longitude], {icon: hijaIcon}).addTo(hijacking)
                    .bindPopup(response.attacktype1_txt[i] + '<br>Target: '+ target + '<br>Aim: ' + subtarget + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                }
                    break;
                case 'Unknown':
                    if (!subtarget) {
                    L.marker([latitude, longitude], {icon: unknIcon}).addTo(unknown)
                        .bindPopup(response.attacktype1_txt[i] + '<br>Target: '+ target + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                    } else {
                    L.marker([latitude, longitude], {icon: unknIcon}).addTo(unknown)
                        .bindPopup(response.attacktype1_txt[i] + '<br>Target: '+ target + '<br>Aim: ' + subtarget + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                    }
                    break;
                case 'Unarmed Assault':
                    if (!subtarget) {
                    L.marker([latitude, longitude], {icon: unarIcon}).addTo(unarmed)
                        .bindPopup(response.attacktype1_txt[i] + '<br>Target: '+ target + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                    } else {
                    L.marker([latitude, longitude], {icon: unarIcon}).addTo(unarmed)
                        .bindPopup(response.attacktype1_txt[i] + '<br>Target: '+ target + '<br>Aim: ' + subtarget + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                    }
                    break;
                case 'Hostage Taking (Barricade Incident)':
                    if (!subtarget) {
                    L.marker([latitude, longitude], {icon: hostIcon}).addTo(hostage)
                        .bindPopup(response.attacktype1_txt[i] + '<br>Target: '+ target + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                    } else {
                    L.marker([latitude, longitude], {icon: hostIcon}).addTo(hostage)
                        .bindPopup(response.attacktype1_txt[i] + '<br>Target: '+ target + '<br>Aim: ' + subtarget + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                    }
                    break;
                default:
                    L.marker([latitude, longitude], {icon: unknIcon}).addTo(unknown)
                        .bindPopup(response.attacktype1_txt[i] + '<br>Latitude: ' + latitude + '<br>Longitude: ' + longitude);
                    break;
                }
          }
     }
    // myMap.panTo(new L.LatLng(response.centlat[0], response.centlong[0]), 6);
    myMap.setView(new L.LatLng(response.centlat[0], response.centlong[0]), 4)
     });
};


function buildBubble(year) {

 // @TODO: Use `d3.json` to fetch the sample data for the plots

 var url = `/bubble/${year}`;
 d3.json(url).then(function(response) {

     var arr = response.country_txt;
     var lookup = {};
     var countryExe = [];
     var countryCount = 0;

     for (var i = 0; i < Object.keys(response.country).length; i++) {
         if(!(arr[i] in lookup)){
             lookup[arr[i]] = 1;
             countryCount +=1;
             countryExe.push(countryCount);
         }
         else{ lookup[arr[i]] += 1;
         }
     }
     var countries = Object.keys(lookup);
     var counts = Object.values(lookup);
    var exes = countryExe;
    var whys = counts;
    var bigosmallo = counts;
   var colors = countryExe; // add a little pizzazz
   var text_stuff = countries;

    var trace1 = {
      x: exes,
      y: whys,
      text: text_stuff,
      mode: 'markers',
      marker: {
       color: colors,
       colorscale: 'Jet',
       size: bigosmallo,
       sizeref: 2.0 * Math.max(...bigosmallo) / (50**2),
       sizemode: 'area'
      }
   };

    var doom = [trace1];

   var layout = {
       title: 'Country Attacks by Year',
      xaxis: {
         // autotick: true,
          showgrid: false,
          zeroline: false,
          ticks: '',
          showticklabels: false      },
      margin: {
          l: 50,
          r: 50,
          b:  1,
          t: 85,
          pad: 0
      },
   //   // how do I get better more interesting colors?
    };
   //
   Plotly.newPlot('chart-02', doom, layout, {responsive: true});
 });
}

function buildHighChart() {
   var options = {
       chart: {
           renderTo: 'chart-03',
           type: 'streamgraph'
       },
       title: { text: 'Total Terror Attacks by Target Type'
       },
       plotOptions:{
           area: {
               stacking: 'normal',
               lineColor: '#000000',
               lineWidth: 0,
               marker: {
                   lineWidth: 0,
                   lineColor: '#000000'
               }
           }
       },
       yAxis: {
           visible: false,
           startOnTick: false,
           endOnTick: false
        },

       series: [{}]
   };
   var url =  "/highchart";
   d3.json(url).then(function(response) {

   var attackArr = [];
   var lookup = {};
   var year = {}

   for (var i = 0; i < Object.keys(response).length; i++) {
       if(!(response[i].targtype1_txt in lookup)){
           lookup[response[i].targtype1_txt] = [];
       }
       lookup[response[i].targtype1_txt].push(response[i].thing)
   }
   // console.log(lookup);


   // console.log(lookup['Abortion Related'])

   for (var i = 0; i < Object.keys(lookup).length; i++) {
       options.series[i] = {}
       options.series[i].pointStart = 1970;
       options.series[i].data = lookup[Object.keys(lookup)[i]];
       options.series[i].name = Object.keys(lookup)[i];
       options.series[i].showInLegend = false;
   }

   var chart = new Highcharts.Chart(options);
 //  chart.legend = false;
   });
}






function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selYears");
  var bubbleSelector = d3.select("#bubSelYears");
  var countryselector = d3.select("#selCountry");
  var smallYears = d3.select("#selSmallYears");
  var firstYear = 1970;
  var firstCountry;

  //large map years dropdown

  var years = d3.json("/years")
  years.then((Years) => {
    Years.forEach((year) => {
      selector
        .append("option")
        .text(year)
        .property("value", year);
      bubbleSelector
       .append("option")
       .text(year)
       .property("value", year);
      smallYears
       .append("option")
       .text(year)
       .property("value", year);
    });
    firstYear = Years[0];
   });

    var url = `/country/${firstYear}`
    var country = d3.json(url)
    country.then((Country) => {
      Country.forEach((country) => {
        countryselector
          .append("option")
          .text(country)
          .property("value", country);
      });
      firstCountry = Country[0];
//      console.log(Country.length);
     });

// need to define and pull in firstCountry
// pass firstCountry to buildMap call

   Promise.all([years,country]).then(() =>{
     buildMap(firstYear,firstCountry);
     buildBubble(firstYear);
     buildHighChart();
     buildSmlMap(firstYear);
   })

 }

function resetCountryList(){
    //reset function
}

function optionChanged(newYear) {
  // need to call a function to reset country list
  // need to pull country selector choice
  d3.selectAll("#selCountry").html("");
  var countryselector = d3.select("#selCountry");
  var newCountry;
  var url = `/country/${newYear}`;
  var country = d3.json(url)
  country.then((Country) => {
    Country.forEach((country) => {
      countryselector
        .append("option")
        .text(country)
        .property("value", country);
    });
    newCountry = Country[0];
   });

   Promise.all([country]).then(() =>{
     buildMap(newYear,newCountry);
     console.log(newCountry);
   })
}


function optionSmallChanged(newYear) {
   buildSmlMap(newYear);
}

function countryOptionChange(country) {
    var year = d3.select("#selYears").property("value");
//    console.log(year);
  // selecting country to pass to buildMap
   buildMap(year, country);
}

function bubbleOptionChange(newYear) {
    buildBubble(newYear);
}

// Initialize the dashboard
init();
