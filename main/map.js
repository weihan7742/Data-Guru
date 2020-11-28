
var arr = [];
var markerLocation = [];
var result;

// Initialize map
function initMap(){

    retrieveJSON();
    getData();

    var options = {
      zoom:8,
      center:{lat:3.1390,lng:101.6869}
    }

    var map = new google.maps.Map(document.getElementById('map'),options);

    for(var i=0; i<arr.length; i++){
      addMarker(arr[i],map);
      markerLocation.push(arr[i]);
    } 

    console.log(markerLocation);

    // Adding geojson data 
    map.data.loadGeoJson(
        "https://storage.googleapis.com/mapsdevsite/json/google.json"
    )
}

// Retrieve raw markers data
function retrieveJSON(){
  var jsonData= (function() {
    $.ajax({
        type:'GET',
        url:'test_csv.json',
        dataType:'json',
        async:false,
        success:function(data){
            result = data;
        }
    });
    return result;
  })();
}

// Function to set markers format
function getData(){
  for(i=0; i<result.length;i++){
    let tempDict ={};
    tempDict["coords"] = {lat:result[i].Lat, lng: result[i].Lng};
    tempDict["content"] = '<p>'+result[i].Name+'</p>';
    tempDict["category"] = result[i].Category;
    arr.push(tempDict);
  }
}

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

// Search box function
function filterFunction() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('categoryInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');
    
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("button")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }

var chipOutput = []; // Store unique categories

// Function to select chip 
function selectFunction(value){
    console.log("Clicked successful!"); // Testing purpose
    
    // Check if value is in list already
    const chipExist = chipOutput.includes(value);
    
    // Add value if not exist
    if(!chipExist){
      chipOutput.push(value);
    }

    document.getElementById('chipDisplay').innerHTML = displayChip();
}

// Function to delete selected chip
function deleteChip(index){
  chipOutput.splice(index,1); 
  document.getElementById('chipDisplay').innerHTML = displayChip();
}

// Function to display chip
function displayChip(){
  let output = ` `; // To be printed
  // Print out value 
  for(i=0;i<chipOutput.length;i++){
    output += `    <div class="mdl-chip mdl-chip--contact mdl-chip--deletable" onclick="deleteChip(${i})">
    <span class="mdl-chip__contact mdl-color-text--white theme-color-2">${i + 1}</span>
    <span class="mdl-chip__text default-font" style="width: 150px;">${chipOutput[i]}</span>
    <a class="mdl-chip__action"><i class="material-icons">cancel</i></a>
  </div>
  <br/>`; 
  }

  return output;
}

// Display marker 
function displayMarker(){
  // loop through chipoutput
}

