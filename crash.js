$(".enter_link").on("click", function() {
    $("#splashscreen").fadeOut(500);
    $("#intro-block").removeClass("hidden");
});

var osmBase = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> | Crash Data: Colorado DOT',
    opacity: .75
});

var jeffcoBoundary = L.geoJSON(jeffcoBoundary, {
    style: {
        "color": "#fefefe",
        fillOpacity: 0,
        dashArray: '6',
        "weight": 2,
    }
});

var cityBoundary = L.geoJSON(cities, {
    style: function(feature){
        switch (feature.properties.NAME) {
            case 'ARVADA': return {
                stroke: false,
                fillColor: "rgba(115, 100, 0, 1)"
            }
            case 'BOW MAR': return {
                stroke: false,
                fillColor: "rgba(190, 214, 0, 1)"
            }                
            case 'EDGEWATER': return {
                stroke: false,
                fillColor: "rgba(255, 145, 51, 1)"
            }
            case 'GOLDEN': return {
                stroke: false,
                fillColor: "rgba(215, 169, 0, 1)"
            }
            case 'LAKESIDE': return {
                stroke: false,
                fillColor: "rgba(94, 182, 228, 1)"
            }
            case 'LAKEWOOD': return {
                stroke: false,
                fillColor: "rgba(3, 86, 66, 1)"
            }
            case 'LITTLETON': return {
                stroke: false,
                fillColor: "rgba(106, 64, 97, 1)"
            }
            case 'MORRISON': return {
                stroke: false,
                fillColor: "rgba(152, 50, 34, 1)"
            }
            case 'MOUNTAIN VIEW': return {
                stroke: false,
                fillColor: "rgba(250, 121, 128, 1)"
            }
            case 'SUPERIOR': return {
                stroke: false,
                fillColor: "rgba(38, 63, 106, 1)"
            }
            case 'WESTMINSTER': return {
                stroke: false,
                fillColor: "rgba(157, 102, 112, 1)"
            }
            case 'WHEAT RIDGE': return {
                stroke: false,
                fillColor: "rgba(209, 223, 214, 1)"
            }
        }
    }
});

// create and add map to html element "map"
var map = L.map("map", {
    maxZoom: 18,
    layers: [osmBase, cityBoundary, jeffcoBoundary],
    home: true
}).setView([39.50, -105.21], 10);

// AGOL feature layer of crash data
var crashDataURL = "https://services3.arcgis.com/9ntQlfNHEhmpX4cl/arcgis/rest/services/Crash405c/FeatureServer/0";

// icons for animal crashes
var deerIcon = new L.icon({
    iconUrl: "images/animals/deer.png",
    iconSize: [20, 35]
});
var bearIcon = new L.icon({
    iconUrl: "images/animals/bear.png",
    iconSize: [20, 15]
});
var elkIcon = new L.icon({
    iconUrl: "images/animals/elk.png",
    iconSize: [20, 35]
});
var cowIcon = new L.icon({
    iconUrl: "images/animals/cow.png",
    iconSize: [20, 15]
});
var coyoteIcon = new L.icon({
    iconUrl: "images/animals/coyote.png",
    iconSize: [20, 25]
});
var pedIcon = new L.icon({
    iconUrl: "images/animals/ped.png",
    iconSize: [11, 20]
});
var lionIcon = new L.icon({
    iconUrl: "images/animals/lion.png",
    iconSize: [25, 10]
});
var circIcon = new L.icon({
    iconUrl: "images/animals/Black_Circle.png",
    iconSize: [15, 15]
});
var bikeIcon = new L.icon({
    iconUrl: "images/animals/bicycle.png",
    iconSize: [25, 17]
});

// create cluster container for All Crashes
var allMarkers = L.markerClusterGroup({chunkedLoading: true});
// create geoJSON data of feature layer
var allCrashLayerData = [];
allCrashQuery = L.esri.query({
    url: crashDataURL
});
allCrashQuery.fields(["*"])
allCrashQuery.where("OBJECTID > 0").run(function(error, data){
    var allCrashData = data;
    var allCrashLayer = L.geoJson(data, {
        onEachFeature: function(feature, layer){
            layer.setIcon(circIcon);
            var sev;
            if (layer.feature.properties.severity == "PDO"){
                sev = "Property Damage Only"
            } else if (layer.feature.properties.severity == "INJ"){
                sev = "Injury"
            } else if (layer.feature.properties.severity == "FAT"){
                sev = "Fatality"
            }
            var date = new Date(layer.feature.properties.date);
            var ddd = date.toString().split(" ");
            layer.bindPopup("<b>Date: </b>" + ddd[0] + ", " + ddd[1] + " " + ddd[2] + ", " + ddd[3] + "<br><b>Incident Type : </b>" + layer.feature.properties.acctype + "<br><b>Vehicle 1: </b>" + layer.feature.properties.vehicle_1 + "<br><b>Vehicle 2: </b>" + layer.feature.properties.vehicle_2 + "<br><b>Severity: </b>" + sev + "<br>");
        }
    });
    allCrashLayerData.push(allCrashData);
    allCrashLayerData.push(allCrashLayer);
});

// create cluster container for alcohol-related
var alcoholMarkers = L.markerClusterGroup({chunkedLoading: true});
// create geoJSON data of feature layer
var alcoholCrashLayerData = [];
var alcoholCrashQuery = L.esri.query({
    url: crashDataURL
});
alcoholCrashQuery.fields(["*"]);
alcoholCrashQuery.where("driver_1 LIKE '%ALCOHOL%'").run(function(error, data){
    var alcData = data;
    var alcoholLayer = L.geoJson(data, {
        onEachFeature: function(feature, layer){
            var sev;
            if (layer.feature.properties.severity == "PDO"){
                sev = "Property Damage Only"
            } else if (layer.feature.properties.severity == "INJ"){
                sev = "Injury"
            } else if (layer.feature.properties.severity == "FAT"){
                sev = "Fatality"
            }
            var date = new Date(layer.feature.properties.date);
            var ddd = date.toString().split(" ");
            layer.bindPopup("<b>Date: </b>" + ddd[0] + ", " + ddd[1] + " " + ddd[2] + ", " + ddd[3] + "<br><b>Incident Type : </b>" + layer.feature.properties.acctype + "<br><b>Vehicle 1: </b>" + layer.feature.properties.vehicle_1 + "<br><b>Vehicle 2: </b>" + layer.feature.properties.vehicle_2 + "<br><b>Severity: </b>" + sev + "<br>");
            layer.setIcon(circIcon);
        }
    });
    alcoholCrashLayerData.push(alcData);
    alcoholCrashLayerData.push(alcoholLayer);
});

var fatalityCluster = L.markerClusterGroup();
var fatalityCrashLayerData = [];
var fatalityCrashQuery = L.esri.query({
    url: crashDataURL
});
fatalityCrashQuery.fields(["*"]);
fatalityCrashQuery.where("severity = 'FAT'").run(function(error, data){
    var fatalityData = data;
    var fatalityLayer = L.geoJson(data, {
        onEachFeature: function(feature, layer){
            var sev;
            if (layer.feature.properties.severity == "PDO"){
                sev = "Property Damage Only"
            } else if (layer.feature.properties.severity == "INJ"){
                sev = "Injury"
            } else if (layer.feature.properties.severity == "FAT"){
                sev = "Fatality"
            }
            var date = new Date(layer.feature.properties.date);
            var ddd = date.toString().split(" ");
            layer.bindPopup("<b>Date: </b>" + ddd[0] + ", " + ddd[1] + " " + ddd[2] + ", " + ddd[3] + "<br><b>Incident Type : </b>" + layer.feature.properties.acctype + "<br><b>Vehicle 1: </b>" + layer.feature.properties.vehicle_1 + "<br><b>Vehicle 2: </b>" + layer.feature.properties.vehicle_2 + "<br><b>Severity: </b>" + sev + "<br>");
            layer.setIcon(circIcon);
        }
    });
    fatalityCrashLayerData.push(fatalityData);
    fatalityCrashLayerData.push(fatalityLayer);
});

// create geoJSON data of feature layer
var wildCluster = L.markerClusterGroup();
var wildanimalLayerData = [];
var wildanimalCrashQuery = L.esri.query({
    url: crashDataURL
});
wildanimalCrashQuery.fields(["*"]);
wildanimalCrashQuery.where("wan_type IS NOT NULL").run(function(error, data){
    var wildanimalData = data;
    var wildanimalLayer = L.geoJson(data, {
        onEachFeature: function(feature, layer){
            if (layer.feature.properties.wan_type == 'DEER'){
                layer.setIcon(deerIcon);
            } else if (layer.feature.properties.wan_type == 'BEAR'){
                layer.setIcon(bearIcon);
            } else if (layer.feature.properties.wan_type == 'ELK'){
                layer.setIcon(elkIcon);
            } else if (layer.feature.properties.wan_type == 'CATTLE'){
                layer.setIcon(cowIcon);
            } else if (layer.feature.properties.wan_type == 'COYOTE'){
                layer.setIcon(coyoteIcon);
            } else if (layer.feature.properties.wan_type == 'LION'){
                layer.setIcon(lionIcon);
            } else {
                layer.setIcon(circIcon);
            }
            layer.bindPopup("Animal involved: <b>" + layer.feature.properties.wan_type + "</b>");
        }
    });
    wildanimalLayerData.push(wildanimalData);
    wildanimalLayerData.push(wildanimalLayer);
});

var bikeCluster = L.markerClusterGroup();
var bikeCrashLayerData = [];
var bikeCrashQuery = L.esri.query({
    url: crashDataURL
});
bikeCrashQuery.fields(["*"]);
bikeCrashQuery.where("vehicle_1 = 'BICYCLE' OR vehicle_2 = 'BICYCLE' OR vehicle_3 = 'BICYCLE'").run(function(error, data){
    var bikeCrashData = data;
    var bikeCrashLayer = L.geoJson(data, {
        onEachFeature: function(feature, layer){
            var sev;
            if (layer.feature.properties.severity == "PDO"){
                sev = "Property Damage Only"
            } else if (layer.feature.properties.severity == "INJ"){
                sev = "Injury"
            } else if (layer.feature.properties.severity == "FAT"){
                sev = "Fatality"
            }
            
            var date = new Date(layer.feature.properties.date);
            var ddd = date.toString().split(" ");
            layer.bindPopup("<b>Date: </b>" + ddd[0] + ", " + ddd[1] + " " + ddd[2] + ", " + ddd[3] + "<br><b>Incident Type : </b>" + layer.feature.properties.acctype + "<br><b>Vehicle 1: </b>" + layer.feature.properties.vehicle_1 + "<br><b>Vehicle 2: </b>" + layer.feature.properties.vehicle_2 + "<br><b>Severity: </b>" + sev + "<br>");
            layer.setIcon(bikeIcon);
        }
    });
    bikeCrashLayerData.push(bikeCrashData);
    bikeCrashLayerData.push(bikeCrashLayer);
});

var pedCluster = L.markerClusterGroup();
var pedLayerData = [];
var pedQuery = L.esri.query({
    url: crashDataURL
});
pedQuery.fields(["*"]);
pedQuery.where("acctype LIKE '%PEDESTRIAN%'").run(function(error, data){
    var pedData = data;
    var pedLayer = L.geoJson(data, {
        onEachFeature: function(feature, layer){
            var sev;
            if (layer.feature.properties.severity == "PDO"){
                sev = "Property Damage Only"
            } else if (layer.feature.properties.severity == "INJ"){
                sev = "Injury"
            } else if (layer.feature.properties.severity == "FAT"){
                sev = "Fatality"
            }
            var date = new Date(layer.feature.properties.date);
            var ddd = date.toString().split(" ");
            layer.bindPopup("<b>Date: </b>" + ddd[0] + ", " + ddd[1] + " " + ddd[2] + ", " + ddd[3] + "<br><b>Incident Type : </b>" + layer.feature.properties.acctype + "<br><b>Vehicle 1: </b>" + layer.feature.properties.vehicle_1 + "<br><b>Vehicle 2: </b>" + layer.feature.properties.vehicle_2 + "<br><b>Severity: </b>" + sev + "<br>");
            layer.setIcon(pedIcon);
        }
    });
    pedLayerData.push(pedData);
    pedLayerData.push(pedLayer);
});


// timout function to make sure all data is added to cluster layers
setTimeout(function(){
    // add relative data to marker cluster layers
    allMarkers.addLayer(allCrashLayerData[1]);
    alcoholMarkers.addLayer(alcoholCrashLayerData[1]);
    pedCluster.addLayer(pedLayerData[1]);
    bikeCluster.addLayer(bikeCrashLayerData[1]);
    wildCluster.addLayer(wildanimalLayerData[1]);
    fatalityCluster.addLayer(fatalityCrashLayerData[1]);
    
}, 5000);

// create crash layer object for leaflet layer control
var crashLayers;

// timeout function to make sure all data and all layers are added to leaflet layer control
setTimeout(function(){
    crashLayers = {
        "All Crashes": allMarkers,
        "Alcohol Related Crashes": alcoholMarkers,
        "Wild Animal Related Crashes": wildCluster,
        "Bicycle Related Crashes": bikeCluster,
        "Pedestrian Related Crashes": pedCluster,
        "Fatal Crashes": fatalityCluster
    };
}, 6000)

// timeout function to add layer control with all layers and data to map
setTimeout(function(){
    L.control.layers(crashLayers).addTo(map);
}, 6005);

// create/add draw control for drawing rectangles/polygons
var drawControl = new L.Control.Draw({
    draw: {
        // remove unnecessary buttons
        marker: false,
        polyline: false,
        polygon: false,
        circle: false
    },
});
map.addControl(drawControl);

// variable to hold leaflet_id for removal later
var leafID;

// functions when rectangle/polygon are completed on map
map.on(L.Draw.Event.CREATED, function (e) {
    //get data for polygon drawings based on layer on map...ONLY ONE LAYER CAN BE ON!!!
    var data;
    var type;
    if (map.hasLayer(allMarkers)) {
        data = allCrashLayerData[0];
        type = "All Types of"
    } else if (map.hasLayer(alcoholMarkers)) {
        data = alcoholCrashLayerData[0]
        type = "Alcohol Related"
    } else if (map.hasLayer(wildCluster)) {
        data = wildanimalLayerData[0]
        type = "Wild Animal Related"
    } else if (map.hasLayer(fatalityCluster)) {
        data = fatalityCrashLayerData[0]
        type = "Fatality"
    } else if (map.hasLayer(bikeCluster)) {
        data = bikeCrashLayerData[0]
        type = "Bicycle Related"
    } else if (map.hasLayer(pedCluster)) {
        data = pedLayerData[0]
        type = "Pedestrian Related"
    }
    
    // empties respective html elements for re-creation
    emptyCharts();
    $("#typeTitle").removeClass("hidden");
    $("#timeTitle").removeClass("hidden");
    
    // hide initial html text elements
    $("#intro-block").addClass("hidden");
    
    // unhide container into which all charts are entered
    $("#chart-container").removeClass("hidden");
    $("#damage-container").addClass("hidden");
    
    //unhide pertinent buttons in navbar
    $("#refresh-button").removeClass("hidden");
    $("#remove-AOI-button").removeClass("hidden");
    $("#chart-button").addClass("hidden");
    
    // if drawn rectangle is on map, this function removes it
    map.eachLayer(function(layer){
        if (layer._leaflet_id == leafID){
            map.removeLayer(layer);
        };
    });
    
    // add drawn rectangle/polygon to map
    map.addLayer(e.layer);
    
    // add drawn rectange to feature service
    var aois = L.esri.featureLayer({
        url: "https://services3.arcgis.com/9ntQlfNHEhmpX4cl/ArcGIS/rest/services/website_aois/FeatureServer/0"
    });
    
    aois.addFeature(e.layer.toGeoJSON());
        
    // zoom to drawn rectangle/polygon
    map.fitBounds(e.layer.getBounds());
        
    // random gif creator
    var image = randomLoader();    
    $("#loader").css({
        "width": "100%",
        "height": "100%", 
        "background": 'url("' + image + '")',
        "background-repeat": "no-repeat",
        "background-position": "center 0%",
        "margin-top": "200px"
    });
    $(".loader").removeClass("hidden").delay(8000).fadeOut("slow");
    
    // add hidden class to gif loader for remove on next area selection
    setTimeout(function(){
        $(".loader").addClass("hidden").fadeIn(1);
    }, 9000);
    
    // run the "info()" function to get data for area of interest and populate charts
    info(e.layerType, e.layer, data, type);
    
    // leaflet_id of drawn rectangle/polygon
    leafID = e.layer._leaflet_id;
    
});

//function for initial extent button
map.on("move", function(){
    $("#initial-extent-button").removeClass("hidden");
});
//functions for buttons in navbar
$("#initial-extent-button").on("click", function(){
    map.setView([39.50, -105.21], 10);
    setTimeout(function(){
        $("#initial-extent-button").addClass("hidden");
    }, 500);
});
$("#refresh-button").on("click", function() {
    setTimeout(function(){
        $("#initial-extent-button").addClass("hidden");
    }, 500);
    $("#intro-block").removeClass("hidden");
    $("#refresh-button").addClass("hidden");
    $("#remove-AOI-button").addClass("hidden");
    $("#damage-button").addClass("hidden");
    $("#chart-button").addClass("hidden");
    $("#damage-container").addClass("hidden");
    map.setView([39.50, -105.21], 10);
    map.eachLayer(function(layer){
        if (layer._leaflet_id == leafID){
            map.removeLayer(layer);
        };
    });
    emptyCharts();
});
$("#remove-AOI-button").on("click", function(){
    map.eachLayer(function(layer){
        if (layer._leaflet_id == leafID){
            map.removeLayer(layer);
        };
    });
    emptyCharts();
    $("#remove-AOI-button").addClass("hidden");
    $("#damage-button").addClass("hidden");
    $("#chart-button").addClass("hidden");
    $("#damage-container").addClass("hidden");
});

function emptyCharts(){
    $("#totalCrashes").empty();
    $("#typeTitle").addClass("hidden");
    $("#timeTitle").empty();
    $("#incidentChartsTitle").empty();
    $("#incidentChart").empty();
    $("#factorChart").empty();
    $("#violationChart").empty();
    $("#genderChart").empty();
    $("#directionChart").empty();
    $("#percentages").empty();
    $("#yearChart").empty();
    $("#monthChart").empty();
    $("#dayChart").empty();
    $("#hourChart").empty();
}

// random gif loader function
function randomLoader(){
    // gif list
    var gifs = ["images/1.gif", "images/2.gif", "images/3.gif", "images/4.gif", "images/5.gif", "images/6.gif", "images/7.gif", "images/8.gif", "images/9.gif", "images/10.gif", "images/11.gif", "images/12.gif", "images/13.gif", "images/14.gif", "images/15.gif", "images/16.gif", "images/17.gif", "images/18.gif", "images/19.gif", "images/20.gif", "images/21.gif", "images/22.gif", "images/23.gif"];
    // random number
    var num = Math.floor(Math.random() * 23);
    return gifs[num];
}

// function to get all data from area of interest
function info(type, layer, d, t){
    // various arrays for counting
    var count = [];
    var incidents = [];
    var factors = [];
    var viol = [];
    var dirs = [];
    var ints = [];
    var condition = [];
    var lighting = [];
    var weather = [];
    var ages = [];
    var gender = [];
    var years = [];
    var months = [];
    var days = [];
    var hours = [];
    var totalState = [];
    var noCOState = [];
    
    if (type === 'rectangle') {
        // add line break between rich and temporal data
        $("hr").removeClass("hidden");
        
        // get bounds of drawn rectangle/polygon
        var bounds = layer.getBounds();
        
        // get point data from points inside rectangle/polygon
        var points = L.geoJson(d, {
            onEachFeature: function (feature, layerG) {
                // get all features within rectangle/polygon
                if (bounds.contains([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])){
                    // to count
                    count.push(feature);
                }
                var stateAbreves = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", 
                    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
                    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
                    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
                    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
                
                if (bounds.contains([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])) {
                    if (feature.properties.age_1 != 0 && feature.properties.age_1 != undefined){
                        ages.push(feature.properties.age_1);
                    }
                    if (feature.properties.sex_1 != undefined){
                        gender.push(feature.properties.sex_1);
                    }
                    if (feature.properties.state_1 != undefined && stateAbreves.includes(feature.properties.state_1)){
                        totalState.push(feature.properties.state_1);
                    }
                    if (stateAbreves.includes(feature.properties.state_1) && feature.properties.state_1 != "CO") {
                        noCOState.push(feature.properties.state_1);
                    }
                    if (feature.properties.acctype != undefined){
                        incidents.push(feature.properties.acctype);
                    }
                    if (feature.properties.dir_1 != undefined){
                        dirs.push(feature.properties.dir_1);
                    }
                    if (feature.properties.road_desc != undefined){
                        ints.push(feature.properties.road_desc);
                    }
                    if (feature.properties.condition != undefined){
                        condition.push(feature.properties.condition);
                    }
                    if (feature.properties.lighting != undefined){
                        lighting.push(feature.properties.lighting);
                    }
                    if (feature.properties.weather != undefined){
                        weather.push(feature.properties.weather);
                    }
                    if (feature.properties.violcode_1 != undefined){
                        viol.push(feature.properties.violcode_1);
                    }
                    if (feature.properties.factor_1 != "NONE APPARENT" && feature.properties.factor_1 != "UNKNOWN" && feature.properties.factor_1 != undefined){
                        factors.push(feature.properties.factor_1);
                    }
                    if (feature.properties.Year != undefined){
                        years.push(feature.properties.Year);
                    }
                    if (feature.properties.Month != undefined){
                        months.push(feature.properties.Month);
                    }
                    if (feature.properties.DayofWeek1 != undefined){
                        days.push(feature.properties.DayofWeek1);
                    }
                    if (feature.properties.Hour != undefined){
                        hours.push(feature.properties.Hour);
                    }
                }
            }
        });
    };
    
    // get number of "rich" data points
    var incidentCount = incidents.length;
    var factorCount = factors.length;
    var violationCount = viol.length;
    var ageCount = ages.length;
    var genderCount = gender.length;
    var directionCount = dirs.length;
    var lightingCount = lighting.length;
    var weatherCount = weather.length;
    var conditionCount = condition.length;
    var stateAllCount = totalState.length;
    var stateNOCOCount = noCOState.length;
    
    // get data points for temporal charts
    var counts = count.length;
    
    // get counts for each type of thing (incident type counts, factor type counts, etc.)
    var incidentCounts = {};
    incidents.forEach (function(x) 
        { incidentCounts[x] = (incidentCounts[x] || 0)+1;
    });
    
    var factorCounts = {};
    factors.forEach (function(x) 
        { factorCounts[x] = (factorCounts[x] || 0)+1;
    });
    
    var violationCounts = {};
    viol.forEach (function(x) 
        { violationCounts[x] = (violationCounts[x] || 0)+1;
    });
    
    var directionCounts = {};
    dirs.forEach (function(x) 
        { directionCounts[x] = (directionCounts[x] || 0)+1;
    });
    
    var conditionCounts = {};
    condition.forEach (function(x) 
        { conditionCounts[x] = (conditionCounts[x] || 0)+1;
    });
    
    var weatherCounts = {};
    weather.forEach (function(x) 
        { weatherCounts[x] = (weatherCounts[x] || 0)+1;
    });

    var lightingCounts = {};
    lighting.forEach (function(x) 
        { lightingCounts[x] = (lightingCounts[x] || 0)+1;
    });
    
    var genderCounts = {};
    gender.forEach (function(x) 
        { genderCounts[x] = (genderCounts[x] || 0)+1;
    });
    
    var yearCounts = {};
    years.forEach (function(x) 
        { yearCounts[x] = (yearCounts[x] || 0)+1;
    });

    var monthCounts = {};
    months.forEach (function(x) 
        { monthCounts[x] = (monthCounts[x] || 0)+1;
    });
    
    var dayCounts = {};
    days.forEach (function(x) 
        { dayCounts[x] = (dayCounts[x] || 0)+1;
    });
    
    var hourCounts = {};
    hours.forEach (function(x) 
        { hourCounts[x] = (hourCounts[x] || 0)+1;
    });
    
    var stateCounts = {};
    totalState.forEach (function(x) 
        { stateCounts[x] = (stateCounts[x] || 0)+1;
    });
    
    var noCOStateCounts = {};
    noCOState.forEach (function(x) 
        { noCOStateCounts[x] = (noCOStateCounts[x] || 0)+1;
    });
    
    // timeout for collection of data from within area of interest
    setTimeout(function(){
        $("#incidentChartsTitle").html("<br><b>Crash Specific Data</b>");
        // create title for temporal data charts
        $("#typeTitle").html("<b>" + t + " Crashes (" + counts + " total crashes: 2011 to 2015)</b><br><br>");
        $("#timeTitle").html("<b>Temporal Breakdown</b>");
        
        // get variables based on respective functions
        var conditions = getConditionPercentages(conditionCounts, incidentCount);
        var weather = getWeatherPercentages(weatherCounts, incidentCount, "weather conditions");
        var lighting = getLightingPercentages(lightingCounts, incidentCount);
//        var averageAge = avgAge(ages);
//        var stateStuff = stateData(noCOStateCounts, stateAllCount, stateNOCOCount);
        
        // call functions to create charts...timeout ensures all charts are populated with data prior to display
        setTimeout(function(){
            incidentChart(incidentCounts, incidentCount);
            factorChart(factorCounts, factorCount);
            violationChart(violationCounts, violationCount);
//            directionChart(directionCounts, directionCount);
//            genderChart(genderCounts, genderCount);
            yearChart(yearCounts);
            monthChart(monthCounts);
            dayChart(dayCounts);
            hourChart(hourCounts);
//            percentageWords(averageAge, ageCount, lighting[0], lighting[1], lightingCount, weather[0], weather[1], weatherCount, conditions[0], conditions[1], conditionCount, stateStuff[0], stateAllCount, stateStuff[1][0], stateStuff[1][1]);
//            $("#contains-all").removeClass("hidden");
        }, 2500)
        
    }, 4000);
    
}

// function to populate the 'percentages' div
function percentageWords(age, ageTotal, lightingPer, lighting, lightingTotal, weatherPer, weather, weatherTotal, condPer, cond, condTotal, oosPercent, stateTotal, oosOOSPercent, offState){
    $("#percentages").append("The <em><b>average age</b></em> of driver at fault for <b><em>" + ageTotal + " crashes</b></em> is <b><em>" + age + " years.</b></em><br><br> <em><b>" + lightingPer + "%</b></em> of <b><em>" + lightingTotal + " crashes</b></em> occur during <em><b>" + lighting + "</b></em> hours. <em><b><br><br>" + weatherPer + "%</b></em> of <em><b>" + weatherTotal + " crashes</b></em> occur when the weather was <em><b>" + weather + "</b></em>.<br><br> <em><b>" + condPer + "%</b></em> of <em><b>" + condTotal + " crashes</b></em> occur when conditions were <em><b>" + cond + "</b></em>.<br><br><em><b>" + oosPercent + "%</b></em> of <em><b>" + stateTotal + "</b></em> crashes were caused by someone from out-of-state. <em><b>" + oosOOSPercent + "%</b></em> of these were caused by someone from <em><b>" + offState + "</b></em>");
    $("#percentages").css({
        "width": "100%",
        "font-family": "Arial",
        "color": "#666",
        "font-style": "bold",
        "font-size": 13,
        "margin-top": "15px",
        "padding-right": "25px"
    }
    );
}

// using the counts from the age data obtained from info() function, finds average age of violators in area of interest
function avgAge(a){
    var sum = 0;
    
    for( var i = 0; i < a.length; i++ ){
        sum += parseInt( a[i], 10 );
    }   

    var avg = sum/a.length;
    
    var avgAge = avg.toFixed(1).toString();
    
    return avgAge;
}

// create chart based on incidents with data obtained from info() function
function incidentChart(data, total){
    // create canvase in which chart can be inserted (required by Chart.js)
    $("#incidentChart").append('<canvas id="iChart" class="newChart" width="100%" height="65px"></canvas>');
    
    // array container for all incidents and counts
    var allNumbers = [];
    
    // array container for three most occuring keys
    var threeMax = [];
    
    // push all values to allNumbers array
    for (var g = 0; g < Object.keys(data).length; g++){
        allNumbers.push(Object.values(data)[g]);
    };
    
    // push the three highest values to the threeMax array
    var c = 0;
    while (c < 3) {
        var ma = Math.max(...allNumbers)
        threeMax.push(ma);
        allNumbers.splice(allNumbers.indexOf(ma), 1);
        c++;
    }
        // create a data object of the three most-occurring keys and values
        var incidentData = {};
        for (var t = 0; t < threeMax.length; t++){
            for (var k = 0; k < Object.values(data).length; k++){
                if (threeMax[t] == Object.values(data)[k]){
                    incidentData[Object.keys(data)[k]] = threeMax[t];
                }
            };
        };
        
        // configure data to be consumed by the new Chart instance
        var d = {
            datasets: [
                {
                data: [(Object.values(incidentData)[0] / total * 100).toFixed(1), (Object.values(incidentData)[1] / total * 100).toFixed(1), (Object.values(incidentData)[2] / total * 100).toFixed(1)],
                backgroundColor: ["#983222", "#FF9133", "#FADD80"],
                }
            ],
            labels: [Object.keys(incidentData)[0], Object.keys(incidentData)[1], Object.keys(incidentData)[2]]
        };
        
        // create chart
        var iChart = new Chart(document.getElementById('iChart'), {
            type: 'bar',
            data: d,
            options: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    fontSize: 12,
                    text: "Three Most Common Incidents (% of " + total + " crashes)"
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            fontSize: 8,
                            // this rotation configuration keeps labels horizontal
                            maxRotation: 0,
                            minRotation: 0
                        }
                    }]
                }
            }
        });
        
}

// pseudocode for charts is similar to that found in incidentChart function
function factorChart(data, total){
    $("#factorChart").append('<canvas id="fChart" class="newChart" width="100%" height="65px"></canvas>');
    var allNumbers = [];
    var threeMax = [];
    for (var g = 0; g < Object.keys(data).length; g++){
        allNumbers.push(Object.values(data)[g]);
    };

    var c = 0;
    while (c < 3) {
        var ma = Math.max(...allNumbers)
        threeMax.push(ma);
        allNumbers.splice(allNumbers.indexOf(ma), 1);
        c++;
    }
    
    var factorData = {};
        for (var t = 0; t < threeMax.length; t++){
            for (var k = 0; k < Object.values(data).length; k++){
                if (threeMax[t] == Object.values(data)[k]){
                    factorData[Object.keys(data)[k]] = threeMax[t];
                }
            };
        };
        
        var d = {
            datasets: [
                {
                data: [(Object.values(factorData)[0] / total * 100).toFixed(1), (Object.values(factorData)[1] / total * 100).toFixed(1), (Object.values(factorData)[2] / total * 100).toFixed(1)],
                backgroundColor: ["#983222", "#FF9133", "#FADD80"],
                }
            ],
            labels: [Object.keys(factorData)[0], Object.keys(factorData)[1], Object.keys(factorData)[2]]
        };
    
        
        var iChart = new Chart(document.getElementById('fChart'), {
            type: 'bar',
            data: d,
            options: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    fontSize: 12,
                    text: "Three Most Common Factors (% of " + total +" crashes)"
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            fontSize: 8,
                            maxRotation: 0,
                            minRotation: 0
                        }
                    }]
                }
            }
        });
}

function violationChart(data, total){
    $("#violationChart").append('<canvas id="vChart" class="newChart" width="100%" height="65px"></canvas>');
    var allNumbers = [];
    var threeMax = [];
    for (var g = 0; g < Object.keys(data).length; g++){
        allNumbers.push(Object.values(data)[g]);
    };

    var c = 0;
    while (c < 3) {
        var ma = Math.max(...allNumbers)
        threeMax.push(ma);
        allNumbers.splice(allNumbers.indexOf(ma), 1);
        c++;
    }
    
        var violationData = {};
        for (var t = 0; t < threeMax.length; t++){
            for (var k = 0; k < Object.values(data).length; k++){
                if (threeMax[t] == Object.values(data)[k]){
                    violationData[Object.keys(data)[k]] = threeMax[t];
                }
            };
        };
        
        var d = {
            datasets: [
                {
                data: [(Object.values(violationData)[0] / total * 100).toFixed(1), (Object.values(violationData)[1] / total * 100).toFixed(1), (Object.values(violationData)[2] / total * 100).toFixed(1)],
                backgroundColor: ["#983222", "#FF9133", "#FADD80"],
                }
            ],
            labels: [Object.keys(violationData)[0], Object.keys(violationData)[1], Object.keys(violationData)[2]],
        };
    
        
        var iChart = new Chart(document.getElementById('vChart'), {
            type: 'bar',
            data: d,
            options: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    fontSize: 12,
                    text: "Three Most Common Violations (% of " + total + " crashes)"
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            fontSize: 8,
                            maxRotation: 0,
                            minRotation: 0
                        }
                    }]
                }
            }
        });
}

function yearChart(data){
    $("#yearChart").append('<canvas id="yChart" class="newChart" width="100%" height="35px"></canvas>');

    var d = {
        datasets: [
            {
                data: [data["2011"], data["2012"], data["2013"], data["2014"], data["2015"]],
                backgroundColor: ["#9D6670"],
                borderColor: "#3d1348"
            }
        ],
        labels: ["2011", "2012", "2013", "2014", "2015"]
    }
    
    var yChart = new Chart(document.getElementById('yChart'), {
            type: 'line',
            data: d,
            options: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        fontSize: 14,
                        text: "Crashes by Year"
                    }
            }
    });
}

function monthChart(data){
    $("#monthChart").append('<canvas id="mChart" class="newChart" width="100%" height="35px"></canvas>');

    var d = {
        datasets: [
            {
                data: [data["1"], data["2"], data["3"], data["4"], data["5"], data["6"], data["7"], data["8"], data["9"], data["10"], data["11"], data["12"]],
                borderColor: ["#F2C545"],
                backgroundColor: "#335D7E",
            }
        ],
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    }
    
    var yChart = new Chart(document.getElementById('mChart'), {
            type: 'line',
            data: d,
            options: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        fontSize: 14,
                        text: "Crashes by Month"
                    }
            }
    });
}

function dayChart(data){
    $("#dayChart").append('<canvas id="daChart" class="newChart" width="100%" height="35px"></canvas>');

    var d = {
        datasets: [
            {
                data: [data["1"], data["2"], data["3"], data["4"], data["5"], data["6"], data["7"]],
                borderColor: ["#335D7E"],
                backgroundColor: "#627D77",
            }
        ],
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    }
    
    var yChart = new Chart(document.getElementById('daChart'), {
            type: 'line',
            data: d,
            options: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        fontSize: 14,
                        text: "Crashes by Day"
                    }
            }
    });
}

function hourChart(data){
    $("#hourChart").append('<canvas id="hoChart" class="newChart" width="100%" height="35px"></canvas>');
    var d = {
        datasets: [
            {
                data: [data["1"], data["2"], data["3"], data["4"], data["5"], data["6"], data["7"], data["8"], data["9"], data["10"], data["11"], data["12"], data["13"], data["14"], data["15"], data["16"], data["17"], data["18"], data["19"], data["20"], data["21"], data["22"], data["23"], data["24"]],
                borderColor: ["#ff8822"],
                backgroundColor: "#3d1348",
            }
        ],
        labels: ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12a"]
    }
    
    var yChart = new Chart(document.getElementById('hoChart'), {
            type: 'line',
            data: d,
            options: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    fontSize: 14,
                    text: "Crashes by Hour"
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            fontSize: 8,
                            maxRotation: 0,
                            minRotation: 0
                        }
                    }]
                }
            }
    });
}

function directionChart(data, total){
    $("#directionChart").append('<canvas id="dChart" class="newChart" width="100%" height="55px"></canvas>');
    var ne = {};
    var ea = {};
    var se = {};
    var so = {};
    var sw = {};
    var we = {};
    var nw = {};
    var no = {};
    
    for (var f = 0; f < Object.keys(data).length; f++){
        if (Object.keys(data)[f] == "NE"){
            ne["direction"] = Object.keys(data)[f];
            ne["value"] = ((Object.values(data)[f]) / total * 100).toFixed(0);
        };
        if (Object.keys(data)[f] == "E"){
            ea["direction"] = Object.keys(data)[f];
            ea["value"] = ((Object.values(data)[f]) / total * 100).toFixed(0);
        };
        if (Object.keys(data)[f] == "SE"){
            se["direction"] = Object.keys(data)[f];
            se["value"] = ((Object.values(data)[f]) / total * 100).toFixed(0);
        };
        if (Object.keys(data)[f] == "S"){
            so["direction"] = Object.keys(data)[f];
            so["value"] = ((Object.values(data)[f]) / total * 100).toFixed(0);
        };
        if (Object.keys(data)[f] == "SW"){
            sw["direction"] = Object.keys(data)[f];
            sw["value"] = ((Object.values(data)[f]) / total * 100).toFixed(0);
        };
        if (Object.keys(data)[f] == "W"){
            we["direction"] = Object.keys(data)[f];
            we["value"] = ((Object.values(data)[f]) / total * 100).toFixed(0);
        };
        if (Object.keys(data)[f] == "NW"){
            nw["direction"] = Object.keys(data)[f];
            nw["value"] = ((Object.values(data)[f]) / total * 100).toFixed(0);
        };
        if (Object.keys(data)[f] == "N"){
            no["direction"] = Object.keys(data)[f];
            no["value"] = ((Object.values(data)[f]) / total * 100).toFixed(0);
        }
    };
    
    var directionData = {
        labels: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
        datasets: [{
            data: [no["value"], ne["value"], ea["value"], se["value"], so["value"], sw["value"], we["value"], nw["value"]],
            backgroundColor: "#ff8822",
            pointHoverBackgroundColor: "#3d1348"
        }],
    };
    
    var radarChart = new Chart(document.getElementById('dChart'), {
        type: 'radar',
        data: directionData,
        options: {
            scale: {
                ticks: {
                    display: false
                }
            },
            legend: {
                display: false,
            },
            title: {
                display: true,
                fontSize: 12,
                text: "Direction of Travel (% " + total + " crashes)" 
            }
        }
    });
}

function genderChart(data, total){
    $("#genderChart").append('<canvas id="gChart" class="newChart" width="100%" height="55px"></canvas>');

    var mPer = (data.M / total * 100).toFixed(0);
    var fPer = (data.F / total * 100).toFixed(0);
    
    var d = {
        datasets: [
            {
            data: [mPer, fPer],
            backgroundColor: ["#335D7E", "#f0a7c2"],
            }
        ],
        labels: ['Male', 'Female']
    };
    
    var gChart = new Chart(document.getElementById('gChart'), {
        type: 'pie',
        data: d,
        options: {
            title: {
                display: true,
                fontSize: 12,
                text: "Gender Breakdown (% of " + total + ") crashes"
            }
        }
    });
}

// using data obtained from info() function, get percentages
function getConditionPercentages(counts, total){
    var allNumbers = [];
    for (var i = 0; i < Object.keys(counts).length; i++){
        allNumbers.push(Object.values(counts)[i]);
    };
    var maximum = Math.max(...allNumbers);
    
    var conditions = [];
    
    for (var t = 0; t < Object.values(counts).length; t++){
        if (Object.values(counts)[t] == maximum) {
            conditions.push((Object.values(counts)[t] / total * 100).toFixed(1).toString());
            conditions.push(Object.keys(counts)[t].toLowerCase());
        }
    };
    
    return conditions;
}

function getLightingPercentages(counts, total){
    var allNumbers = [];
    for (var i = 0; i < Object.keys(counts).length; i++){
        allNumbers.push(Object.values(counts)[i]);
    };
    
    var maximum = Math.max(...allNumbers);

    var lighting = [];
    
    for (var t = 0; t < Object.values(counts).length; t++){
        if (Object.values(counts)[t] == maximum) {
            lighting.push((Object.values(counts)[t] / total * 100).toFixed(1).toString());
            lighting.push(Object.keys(counts)[t].toLowerCase());
        }
    };

    return lighting;

}

function getWeatherPercentages(counts, total){
    var allNumbers = [];
    for (var i = 0; i < Object.keys(counts).length; i++){
        allNumbers.push(Object.values(counts)[i]);
    };

    var maximum = Math.max(...allNumbers);
    
    var weather = [];
    
    for (var t = 0; t < Object.values(counts).length; t++){
        if (Object.values(counts)[t] == maximum) {
            if (Object.keys(counts)[t] == "NONE"){
                weather.push((Object.values(counts)[t] / total * 100).toFixed(1).toString());
                weather.push("not adverse");
            } else {
                weather.push((Object.values(counts)[t] / total * 100).toFixed(1).toString());
                weather.push(Object.keys(counts)[t].toLowerCase());
            }
        }
    };
    
    return weather;
}

function stateData(noCO, total, totalNOCO){
    var allNumbers = [];
    for (var i = 0; i < Object.keys(noCO).length; i++){
        allNumbers.push(Object.values(noCO)[i]);
    };

    var maximum = Math.max(...allNumbers);
    
    var state = [];
    
    for (var t = 0; t < Object.values(noCO).length; t++){
        if (Object.values(noCO)[t] == maximum) {
            if (Object.keys(noCO)[t] != undefined){
                state.push((Object.values(noCO)[t] / totalNOCO * 100).toFixed(1).toString());
                state.push(Object.keys(noCO)[t]);
            } 
        }
    };
    
    var percentOOS = ((totalNOCO / total * 100).toFixed(1));
    
    return [percentOOS, state];
}
