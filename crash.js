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
var crashDataURL = "https://services3.arcgis.com/9ntQlfNHEhmpX4cl/arcgis/rest/services/Crash/FeatureServer/1";

//https://services3.arcgis.com/9ntQlfNHEhmpX4cl/arcgis/rest/services/Crash405c/FeatureServer/0 - mycontenct
//https://services3.arcgis.com/9ntQlfNHEhmpX4cl/arcgis/rest/services/Crash/FeatureServer/1 - open data

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
allCrashQuery.where("1 = 1").run(function(error, data){
    var allCrashData = data;
    var allCrashLayer = L.geoJson(data, {
        onEachFeature: function(feature, layer){
            layer.setIcon(circIcon);
            var sev;
            if (layer.feature.properties.SEVERITY == "PDO"){
                sev = "Property Damage Only"
            } else if (layer.feature.properties.SEVERITY == "INJ"){
                sev = "Injury"
            } else if (layer.feature.properties.SEVERITY == "FAT"){
                sev = "Fatality"
            }
            
            console.log(feature);
            
            var date = new Date(layer.feature.properties.DATE_);
            var ddd = date.toString().split(" ");
            layer.bindPopup("<b>Date: </b>" + ddd[0] + ", " + ddd[1] + " " + ddd[2] + ", " + ddd[3] + "<br><b>Incident Type : </b>" + layer.feature.properties.ACCTYPE + "<br><b>Vehicle 1: </b>" + layer.feature.properties.VEHICLE_1 + "<br><b>Vehicle 2: </b>" + layer.feature.properties.VEHICLE_2 + "<br><b>Severity: </b>" + sev + "<br>");
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
alcoholCrashQuery.where("DRIVER_1 LIKE '%ALCOHOL%'").run(function(error, data){
    var alcData = data;
    var alcoholLayer = L.geoJson(data, {
        onEachFeature: function(feature, layer){
            var sev;
            if (layer.feature.properties.SEVERITY == "PDO"){
                sev = "Property Damage Only"
            } else if (layer.feature.properties.SEVERITY == "INJ"){
                sev = "Injury"
            } else if (layer.feature.properties.SEVERITY == "FAT"){
                sev = "Fatality"
            }
            var date = new Date(layer.feature.properties.DATE_);
            var ddd = date.toString().split(" ");
            layer.bindPopup("<b>Date: </b>" + ddd[0] + ", " + ddd[1] + " " + ddd[2] + ", " + ddd[3] + "<br><b>Incident Type : </b>" + layer.feature.properties.ACCTYPE + "<br><b>Vehicle 1: </b>" + layer.feature.properties.VEHICLE_1 + "<br><b>Vehicle 2: </b>" + layer.feature.properties.VEHICLE_2 + "<br><b>Severity: </b>" + sev + "<br>");
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
fatalityCrashQuery.where("SEVERITY = 'FAT'").run(function(error, data){
    var fatalityData = data;
    var fatalityLayer = L.geoJson(data, {
        onEachFeature: function(feature, layer){
            var sev;
            if (layer.feature.properties.SEVERITY == "PDO"){
                sev = "Property Damage Only"
            } else if (layer.feature.properties.SEVERITY == "INJ"){
                sev = "Injury"
            } else if (layer.feature.properties.SEVERITY == "FAT"){
                sev = "Fatality"
            }
            var date = new Date(layer.feature.properties.DATE_);
            var ddd = date.toString().split(" ");
            layer.bindPopup("<b>Date: </b>" + ddd[0] + ", " + ddd[1] + " " + ddd[2] + ", " + ddd[3] + "<br><b>Incident Type : </b>" + layer.feature.properties.ACCTYPE + "<br><b>Vehicle 1: </b>" + layer.feature.properties.VEHICLE_1 + "<br><b>Vehicle 2: </b>" + layer.feature.properties.VEHICLE_2 + "<br>");
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
wildanimalCrashQuery.where("WAN_TYPE IS NOT NULL").run(function(error, data){
    var wildanimalData = data;
    var wildanimalLayer = L.geoJson(data, {
        onEachFeature: function(feature, layer){
            if (layer.feature.properties.WAN_TYPE == 'DEER'){
                layer.setIcon(deerIcon);
            } else if (layer.feature.properties.WAN_TYPE == 'BEAR'){
                layer.setIcon(bearIcon);
            } else if (layer.feature.properties.WAN_TYPE == 'ELK'){
                layer.setIcon(elkIcon);
            } else if (layer.feature.properties.WAN_TYPE == 'CATTLE'){
                layer.setIcon(cowIcon);
            } else if (layer.feature.properties.WAN_TYPE == 'COYOTE'){
                layer.setIcon(coyoteIcon);
            } else if (layer.feature.properties.WAN_TYPE == 'LION'){
                layer.setIcon(lionIcon);
            } else {
                layer.setIcon(circIcon);
            }
            layer.bindPopup("Animal involved: <b>" + layer.feature.properties.WAN_TYPE + "</b>");
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
bikeCrashQuery.where("VEHICLE_1 = 'BICYCLE' OR VEHICLE_2 = 'BICYCLE' OR VEHICLE_3 = 'BICYCLE'").run(function(error, data){
    var bikeCrashData = data;
    var bikeCrashLayer = L.geoJson(data, {
        onEachFeature: function(feature, layer){
            var sev;
            if (layer.feature.properties.SEVERITY == "PDO"){
                sev = "Property Damage Only"
            } else if (layer.feature.properties.SEVERITY == "INJ"){
                sev = "Injury"
            } else if (layer.feature.properties.SEVERITY == "FAT"){
                sev = "Fatality"
            }
            
            var date = new Date(layer.feature.properties.DATE_);
            var ddd = date.toString().split(" ");
            layer.bindPopup("<b>Date: </b>" + ddd[0] + ", " + ddd[1] + " " + ddd[2] + ", " + ddd[3] + "<br><b>Incident Type : </b>" + layer.feature.properties.ACCTYPE + "<br><b>Vehicle 1: </b>" + layer.feature.properties.VEHICLE_1 + "<br><b>Vehicle 2: </b>" + layer.feature.properties.VEHICLE_2 + "<br><b>Severity: </b>" + sev + "<br>");
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
pedQuery.where("ACCTYPE LIKE '%PEDESTRIAN%'").run(function(error, data){
    var pedData = data;
    var pedLayer = L.geoJson(data, {
        onEachFeature: function(feature, layer){
            var sev;
            if (layer.feature.properties.SEVERITY == "PDO"){
                sev = "Property Damage Only"
            } else if (layer.feature.properties.SEVERITY == "INJ"){
                sev = "Injury"
            } else if (layer.feature.properties.SEVERITY == "FAT"){
                sev = "Fatality"
            }
            var date = new Date(layer.feature.properties.DATE_);
            var ddd = date.toString().split(" ");
            layer.bindPopup("<b>Date: </b>" + ddd[0] + ", " + ddd[1] + " " + ddd[2] + ", " + ddd[3] + "<br><b>Incident Type : </b>" + layer.feature.properties.ACCTYPE + "<br><b>Vehicle 1: </b>" + layer.feature.properties.VEHICLE_1 + "<br><b>Vehicle 2: </b>" + layer.feature.properties.VEHICLE_2 + "<br><b>Severity: </b>" + sev + "<br>");
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
    
}, 6000);

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
}, 6050)

// timeout function to add layer control with all layers and data to map
setTimeout(function(){
    L.control.layers(crashLayers).addTo(map);
}, 6055);

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
                
                if (bounds.contains([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])) {
                    
                    if (feature.properties.ACCTYPE != undefined){
                        incidents.push(feature.properties.ACCTYPE);
                    }
                    if (feature.properties.VIOLCODE_1 != undefined){
                        viol.push(feature.properties.VIOLCODE_1);
                    }
                    if (feature.properties.FACTOR_1 != "NONE APPARENT" && feature.properties.FACTOR_1 != "UNKNOWN" && feature.properties.FACTOR_1 != undefined){
                        factors.push(feature.properties.FACTOR_1);
                    }
                    if (feature.properties.YEAR != undefined){
                        years.push(feature.properties.YEAR);
                    }
                    if (feature.properties.MONTH != undefined){
                        months.push(feature.properties.MONTH);
                    }
                    if (feature.properties.DAYOFWEEK1 != undefined){
                        days.push(feature.properties.DAYOFWEEK1 );
                    }
                    if (feature.properties.HOUR != undefined){
                        hours.push(feature.properties.HOUR);
                    }
                }
            }
        });
    };
    
    // get number of "rich" data points
    var incidentCount = incidents.length;
    var factorCount = factors.length;
    var violationCount = viol.length;
    
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

    // timeout for collection of data from within area of interest
    setTimeout(function(){
        $("#incidentChartsTitle").html("<br><b>Crash Specific Data</b>");
        // create title for temporal data charts
        $("#typeTitle").html("<b>" + t + " Crashes (" + counts + " total crashes: 2011 to 2015)</b><br><br>");
        $("#timeTitle").html("<b>Temporal Breakdown</b>");
        
        // call functions to create charts...timeout ensures all charts are populated with data prior to display
        setTimeout(function(){
            incidentChart(incidentCounts, incidentCount);
            factorChart(factorCounts, factorCount);
            violationChart(violationCounts, violationCount);
            yearChart(yearCounts);
            monthChart(monthCounts);
            dayChart(dayCounts);
            hourChart(hourCounts);
        }, 2500)
        
    }, 4000);
    
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
