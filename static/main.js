function initMap() {
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
    var selected = [];

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
    });
}