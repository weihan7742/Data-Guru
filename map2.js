function initMap(){
    var arr = [];
    var markerLocation = [];
    getData();

    async function getData(){
        const response = await fetch('test_csv.csv');
        const data = await response.text();
        
        var tempArr = [];
        const rows = data.split('\n').slice(1); // Remove header
        rows.forEach(elt => {
            var tempDict = {};
            const row = elt.split(',');
            const category = row[0];
            const latitude = parseFloat(row[row.length-2]);
            const longtitude = parseFloat(row[row.length-1]);
            tempDict["coords"] = {lat: latitude,lng: longtitude};
            tempDict["content"] = '<p>'+category+'</p>';
            tempArr.push(tempDict);
        })
        return tempArr;
    }

    (async() => {
        arr = await getData();

        var options = {
            zoom:8,
            center:{lat:3.1390,lng:101.6869}
        }   

        // New map 
        var map = new google.maps.Map(document.getElementById('map'),options);

        // Loop through markers
        for(var i=0; i<arr.length; i++){
            addMarker(arr[i],map);
            markerLocation.push(arr[i]);
        }

        // Adding geojson data
        map.data.loadGeoJson(
            "https://storage.googleapis.com/mapsdevsite/json/google.json"
          );
    })()
    
    // Function to add markers
    function addMarker(props,currentMap){
        var marker = new google.maps.Marker({
        position:props.coords,
        map: currentMap,
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

            marker.addListener('mousemove', function(){
                infoWindow.open(map,marker)
            });

            marker.addListener('mouseout',function(){
                infoWindow.close(map,marker)
            })
        }
    }
}

