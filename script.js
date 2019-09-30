
var mTracker = [];

//Initialize and add the map
function initMap() {
    var myLatlng = new google.maps.LatLng(43.451229, -76.543065);
    var mapOptions = {
        zoom: 10,
        center: myLatlng,
        mapTypeControl: false,
        disableDefaultUI: true
    }

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng);
    });

    function placeMarker(location) {
        removeMarker();
        var marker = new google.maps.Marker({
            position: location,
            map: map
        });

        mTracker.push(marker);
        var geocode = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&sensor=true&key=AIzaSyAxFPoD9u8bRmc90AyeZFM7GI0HMv0M-rw"
        showInformation(geocode);
    }

    function removeMarker() {
        for (var i = 0; i < mTracker.length; i++) {
            mTracker[i].setMap(null);
        }
    }
}

// https://maps.googleapis.com/maps/api/geocode/json?latlng=43.451229,-76.543065&sensor=true&key=AIzaSyAxFPoD9u8bRmc90AyeZFM7GI0HMv0M-rw


function showInformation(geocoder) {
    $.getJSON(geocoder, function(gcData) {
        console.log(gcData);

        // everything after first space
        var compoundCode = gcData['plus_code']['compound_code'].split(/\s(.+)/)[1];
        var city = compoundCode.split(', ')[0].replace(' ', '-');
        var state = compoundCode.split(', ')[1];

        // PARSE STATE TO FULL STATE NAME WITH HYPHENS
        $.getJSON("./states.json", function(json) {
            console.log(json[0]);
            for (var i = 0; i < json.length; i++) {
                if (json[i]['abbreviation'] == state) {
                    state = json[i]['name'].replace(' ', '-');
                    break;
                }
            }
            generateResults(compoundCode, city, state);
        })
    });
}

function generateResults(cc, city, state) {
    var page = document.getElementById('results');
    var url = 'http://www.city-data.com/city/' + city + '-' + state  + '.html'
    console.log(url);

    $.get(url, function(response) {

        page.innerHTML = '<p><a href="' + url + '">' + cc + '</href</p>';

        $.get(url, function(response) {
            var population = response.split('<section id="city-population" class="city-population" data-toc-header="Population">')[1].split('<section id="median-income"');//.split(" ")[0];
            console.log(population);
            page.innerHTML += population[0];
            //.split("<br/><a href='/income/income-Hannibal-New-York.html'>Hannibal village income, earnings, and wages data</a><br/>")[0]
        });



        console.log('werk');
    }).fail(function() {
        page.innerHTML = '<p>' + cc + '</p>' + '<a href="' + url + '">City not yet calculated!</href>';
        console.log('no werk');
    });
}


function test() {
    marker.setMap(null);
    console.log("test");
}


