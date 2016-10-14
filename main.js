function initMap() {
    map = new google.maps.Map(document.getElementById('main'), {
        center: {lat: 57.70887, lng: 11.97456},
        zoom: 12,
         mapTypeControl: false,
         streetViewControl: false
    });
    var wdir = document.getElementById("wdir_control");
    wdir.appendChild(document.getElementById("sidenav-wrapper").cloneNode(true));

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
            color: '#605B56',
            fontSize: "14"
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

var handlesSlider = document.getElementById('handle-slider');

noUiSlider.create(handlesSlider, {
	start: [ 4000, 8000 ],
	range: {
		'min': [  2000 ],
		'max': [ 10000 ]
	}
});
