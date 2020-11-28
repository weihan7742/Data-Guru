
var dataStorage = [];
var markerCategory = {};
var result;
var map;
var plottedMarker = {};

// Initialize map
function initMap(){

    retrieveMarkerData('googlemapsdata.json');
    getData();

    var options = {
      zoom:8,
      center:{lat:3.1390,lng:101.6869}
    }

    map = new google.maps.Map(document.getElementById('map'),options);
    var count = 1;
    for(var i=0; i<dataStorage.length; i++){
      if(typeof markerCategory[dataStorage[i].category] == "undefined"){
        markerCategory[dataStorage[i].category] = [];
        markerCategory[dataStorage[i].category].push(dataStorage[i]);
      } else{
        markerCategory[dataStorage[i].category].push(dataStorage[i]);
      }
    }  

    // Adding geojson data 
    map.data.loadGeoJson(
        "https://storage.googleapis.com/mapsdevsite/json/google.json"
    )
}

// Retrieve raw markers data
function retrieveMarkerData(file){
  var jsonData= (function() {
    $.ajax({
        type:'GET',
        url: file,
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
    dataStorage.push(tempDict);
  }
}

// Function to add markers
function addMarker(props,currentMap){
    var marker = new google.maps.Marker({
    position:props.coords,
    map: currentMap,
    icon: props.iconImage
});

    var infoWindow = new google.maps.InfoWindow({
        content:props.content
    });

    marker.addListener('mouseover', function(){
        infoWindow.open(map,marker)
    });

    marker.addListener('mouseout',function(){
        infoWindow.close(map,marker)
    })

    // Store markers which are plotted
    if(typeof plottedMarker[props.category] == "undefined"){
      plottedMarker[props.category] = [];
      plottedMarker[props.category].push(marker);
    } else{
      plottedMarker[props.category].push(marker);
    }

    // Check for custom icon
    if(props.iconImage){
        // Set icon image
        marker.setIcon(props.iconImage);
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
    
    // Check if value is in list already
    const chipExist = chipOutput.includes(value);
    
    // Add value if not exist
    if(!chipExist){
      chipOutput.push(value);
    }

    document.getElementById('chipDisplay').innerHTML = displayChip();
    displayMarker();
}

// Function to delete selected chip
function deleteChip(index){
  // Loop through plotted marker
  let tempMarkers = plottedMarker[chipOutput[index]];

  for(i=0;i<tempMarkers.length;i++){
    tempMarkers[i].setMap(null); 
  }

  delete plottedMarker[chipOutput[index]]; // Clear markers

  chipOutput.splice(index,1); 
  document.getElementById('chipDisplay').innerHTML = displayChip();
  displayChip();
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
  for(i=0;i<chipOutput.length;i++){
    let tempArr = markerCategory[chipOutput[i]];
    // Loop through all ther markers
    for(j=0;j<tempArr.length;j++){
      addMarker(tempArr[j],map);
    }
  }
}
