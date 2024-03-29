var markers = [];
var selected = [];
var map;
var init_center;

var wdir_intepret = {0: "N",
    1: "NE",
    2: "E",
    3: "SE",
    4: "S",
    5: "SW",
    6: "W",
    7: "NW"};


function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(updateMarkers);
    } else {

    }

    map = new google.maps.Map(document.getElementById('main'), {
        center: {lat: 57.70887, lng: 11.97456},
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false
    });
    var wdir = document.getElementById("wdir_control");
    var sidenav = document.getElementById("sidenav-wrapper");

    wdir.appendChild(sidenav.cloneNode(true));

    document.body.removeChild(sidenav);

    initSlider();

    map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById("wdir_control"));
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(document.getElementById("adv_opt"));

    if(typeof init_center === "undefined")
        init_center = map.getCenter();

    updateMarkers();

    google.maps.event.addListener(map, 'zoom_changed', function() {
        zoomChangeBoundsListener =
            google.maps.event.addListener(map, 'bounds_changed', function(event) {
                if (this.getZoom() > 15 && this.initialZoom === true) {
                    // Change max/min zoom here
                    this.setZoom(15);
                    this.initialZoom = false;
                }
                google.maps.event.removeListener(zoomChangeBoundsListener);
            });
    });


    $("#adv_opt").on("click", function () {
        var map = document.getElementById("main");
        map.style["margin-left"] = "300px";
    });

    $(document.body).on("click", "#sidenav-overlay", function () {
        var map = document.getElementById("main");
        map.style["margin-left"] = "0px";
    });

    $(document.body).on("click", ".drag-target", function () {
        var map = document.getElementById("main");
        map.style["margin-left"] = "0px";
    });

    $(".button-collapse").sideNav();

    //Init search box auto complete
    var searchBox = document.getElementById('pac-input');
    var autocomplete = new google.maps.places.Autocomplete(searchBox);
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', function() {
        //Center map and do new search
        var place = autocomplete.getPlace();
        init_center = place.geometry.location;
        console.log(init_center);
        updateMarkers();
    });
}

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['', ''],
        ['N', 1],
        ['NE', 1],
        ['E', 1],
        ['SE', 1],
        ['S', 1],
        ['SW', 1],
        ['W', 1],
        ['NW', 1]         
    ]);

    var options = {
        backgroundColor: "transparent",
        legend: {position: "none"},
        tooltip: {trigger: "none"},
        colors: ["#EAEAEA"],
        title: '',
        pieSliceText: 'label',
        pieStartAngle: 337.5,
        width: 500,
        height: 500,
        chartArea: {top: 60},
        fontName: "Roboto Mono",
        pieSliceTextStyle: {
            bold: true,
            color: '#605B56',
            fontSize: "20"
        },
        pieSliceBorderColor: "#605B56"
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));


    google.visualization.events.addListener(chart, "select", function() {
        var slice = {};
        var selection = chart.getSelection();  

        var idx = checkRow(selected, selection[0].row);

        if (idx === -1) {
            selected.push(selection[0]);
        } else {
            slice[selected[idx].row] = {offset: 0};
            selected = selected.filter(function (el) {
                return el.row !== selected[idx].row;
            });
        }
        
        for (var n = 0; n < selected.length ; n++) { 
            slice[selected[n].row] = {offset: 0.1};
            
        }
        options["slices"] =  slice;
        chart.draw(data, options);
        updateMarkers();
    });

    chart.draw(data, options);
}

function checkRow(selectedArr, row) {
    for (var n = 0 ; n < selectedArr.length ; n++) {
        if (selectedArr[n].row === row) {
            return n;
        }
    }
    return -1;
}



google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);


function initSlider() {
    var distanceSlider = document.getElementById('distance-slider');

    noUiSlider.create(distanceSlider, {
        start: [ 10 ],
        connect: [true, false],
        snap: true,
        range: {
            'min': 0,
            '5%': 5,
            '10%': 10,
            '13%': 15,
            '15%': 20,
            '18%': 25,
            '20%': 30,
            '22%': 35,
            '24%': 40,
            '26%': 45,
            '28%': 50,
            '30%': 60,
            '32%': 70,
            '34%': 80,
            '36%': 90,
            '38%': 100,
            '40%': 150,
            '45%': 200,
            '50%': 250,
            '55%': 300,
            '60%': 350,
            '65%': 400,
            '70%': 450,
            '75%': 500,
            '80%': 600,
            '85%': 700,
            '90%': 800,
            '95%': 900,
            '100%': 1000,
            'max': [ 1000 ]
        }
    });

    distanceSlider.noUiSlider.on('update', function( values, handle ) {
        document.getElementById('dist_counter').innerHTML = Math.round(values[handle])+" km";
        updateMarkers();
    });
}

function deleteMarkers() {
    for (var n = 0; n < markers.length; n++) {
        markers[n].setMap(null);
    }
    markers = [];
}

function updateMarkers(position) {
    var infowindow = new google.maps.InfoWindow();
    deleteMarkers();

    if(typeof position !== "undefined") {
        init_center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(init_center);
    }

    if(typeof init_center !== "undefined")
        var center = init_center;
    else
        var center = map.getCenter();

    var radius = Number(document.getElementById('dist_counter').innerHTML.split("km")[0])*1000;
    var wdir = [];
    if (selected.length !== 0 && selected.length !== 8) {
        for (var n = 0; n < selected.length; n++) {
            wdir.push(wdir_intepret[selected[n].row]);
        }
        wdir = JSON.stringify(wdir);
    }

    var url = "/api/v1/spots/" + center.lat() + "/" + center.lng() + "/" + radius.toString() + "/";
    if (wdir.length !== 0) {
        url = url + wdir;
    }
    $.get(url, function (data) {
        data = JSON.parse(data);
        if (data.length > 0) {
            for (var n = 0; n < data.length; n++) {
                var lat = data[n].coords.coordinates[1];
                var lng = data[n].coords.coordinates[0];
                var latlng = {lat: lat, lng: lng};


                var marker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                    title: 'Hello World!'
                });
                google.maps.event.addListener(marker,'click', (function(marker,data, infowindow){
                    return function() {
                        var info = document.getElementById("info");
                        var spot_namediv = document.getElementById("spot_name");
                        info.innerHTML = data.desc;
                        spot_namediv.innerHTML = data.name;

                        infowindow.setContent(data.name);
                        infowindow.open(map,marker);
                    };
                })(marker,data[n], infowindow));

                markers.push(marker);
            }

            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < markers.length; i++) {
                console.log(markers[i].getPosition())
                bounds.extend(markers[i].getPosition());
            }
            console.log(position, markers.length);
            map.initialZoom = true;
            map.fitBounds(bounds);
        }
    });
}
