function initMap(){
    var arr = [];
    getData();

    async function getData(){
        const response = await fetch('test_csv.csv');
        const data = await response.text();
        
        var tempArr = [];
        const rows = data.split('\n').slice(1);
        rows.forEach(elt => {
            var tempDict = {};
            const row = elt.split(',');
            const category = row[0];
            const latitude = row[row.length-2];
            const longtitude = row[row.length-1];
            tempDict["coords"] = {lat: latitude,lng: longtitude};
            tempDict["content"] = '<p>'+category+'</p>';
            tempArr.push(tempDict);
        })
        return tempArr;
    }

    (async() => {
        arr = await getData();
        console.log(arr);
    })()

    var options = {
        zoom:8,
        center:{lat:3.1390,lng:101.6869}
    }

    // New map 
    var map = new google.maps.Map(document.getElementById('map'),options);
    
    // Listen for click on map
    google.maps.event.addListener(map,"click",function(event){
        addMarker({coords:event.latLng});
    });

    // // Add marker
    // var marker = new google.maps.Marker({
    //     position:{lat:3.1279,lng:101.5945},
    //     map: map,
    //     icon: "https://img.icons8.com/ios/50/000000/building-with-rooftop-terrace.png" // Custom icom
    // });
    
    // // Add info to marker
    // var infowindow = new google.maps.InfoWindow({
    //     content:'<h1>Petaling Jaya</h1>'
    // })
    
    // // Show info when marker is clicked
    // marker.addListener('click',function(){
    //     infowindow.open(map,marker);
    // });
    
    // Array of markers
    var markers = [
        {
        coords:{lat:3.1279,lng:101.5945},
        content: '<h1>Petaling Jaya</h1>'
        }
    ];

    // Loop through markers
    for(var i=0; i<markers.length; i++){
        addMarker(markers[i]);
    }

    // Add marker function 
    function addMarker(props){
        var marker = new google.maps.Marker({
        position:props.coords,
        map: map,
        icon: props.iconImage
    });

        // Check for custom icon
        if(props.iconImage){
            // Set icon image
            marker.setIcon(props.iconImage);
        }

        // Check for content
        if(props.content){
            var infoWindow = new google.maps.InfoWindow({
                content:props.content
            });

            marker.addListener('click', function(){
                infoWindow.open(map,marker)
            });
        }
    }
}

