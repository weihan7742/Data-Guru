/*
Hardcode values
*/
mukimFiles = ['BandarKlang.geojson',
              'BANDARPETALINGJAYA.geojson',
              'bestariJaya.geojson',
              'BUKITRAJA.geojson',
              'Ijok.geojson',
              'jeram.geojson',
              'kapar.geojson',
              'Morib.geojson',
              'Ulu Kelang.geojson']


var dataStorage = [];
var markerCategory = {};
var result;
var map;
var plottedMarker = {};
var mukimJson = [];
var districtJson;

// Initialize map
function initMap(){

    retrieveMarkerData('googlemapsdata.json');
    retrievePropertyData('malaysia_commercial_prop.json');
    for(i=0;i<mukimFiles.length;i++){
      retrieveMukimJson(mukimFiles[i]);
    }
    retrieveDistrictJson('gadm36_MYS_2.geojson');
    formatPropertyMarker();
    getData();

    var options = {
      zoom:8,
      center:{lat:3.1390,lng:101.6869}
    }

    map = new google.maps.Map(document.getElementById('map'),options);

    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    for(var i=0; i<dataStorage.length; i++){
      if(typeof markerCategory[dataStorage[i].category] == "undefined"){
        markerCategory[dataStorage[i].category] = [];
        markerCategory[dataStorage[i].category].push(dataStorage[i]);
      } else{
        markerCategory[dataStorage[i].category].push(dataStorage[i]);
      }
    }  

    // Adding mukim geojson data 
    for(i=0;i<mukimJson.length;i++){
      map.data.addGeoJson(mukimJson[i]);
    }
    map.data.addGeoJson(districtJson);
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

    marker.addListener("click", () => {
      map.setZoom(14);
      map.setCenter(marker.getPosition());
    });

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
  let output = ``; // To be printed
  // Print out value 
  for(i=0;i<chipOutput.length;i++){
    output += `<div class="mdl-chip mdl-chip--contact mdl-chip--deletable">
    <span class="mdl-chip__contact mdl-color-text--white theme-color-2">${i + 1}</span>
    <span class="mdl-chip__text default-font" style="width: auto;">${chipOutput[i]}</span>
    <a class="mdl-chip__action"><i class="material-icons" onclick="deleteChip(${i})">cancel</i></a>
  </div>`; 
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

//expandable
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

/*
----------------------------------------------------------------------------------------------------
The codes below are for property price related data
----------------------------------------------------------------------------------------------------
*/

var showPropertyBool = false; 
var propertyDataStorage; 
var propertyMarkers = [];

// Retrieve raw markers data
function retrievePropertyData(file){
  var jsonData= (function() {
    $.ajax({
        type:'GET',
        url: file,
        dataType:'json',
        async:false,
        success:function(data){
            propertyDataStorage = data;
        }
    });
    return propertyDataStorage;
  })();
}

// Format property data to add markers
function formatPropertyMarker(){
  for(i=0; i<propertyDataStorage.length;i++){
    let tempDict ={};
    tempDict["coords"] = {lat:result[i].Lat, lng: result[i].Lng};
    tempDict["content"] = 
    `<dl>
    <b><dt>Name</dt></b>
    <dd>${propertyDataStorage[i].name}</dd>
    <b><dt>Price</dt></b>
    <dd>RM${propertyDataStorage[i].prices}</dd>
    </dl>`
    tempDict["iconImage"] = "https://img.icons8.com/emoji/48/000000/house-emoji.png";
    tempDict['category'] = "property";
    propertyMarkers.push(tempDict);
  }
}

// Function to show or hide property markers when user press the button
function showProperty(){
  if(document.getElementById('property').textContent == "Show Property Price"){
    document.getElementById('property').textContent = "Hide Property Price"
    showPropertyBool = true;
  } else{
    document.getElementById('property').textContent = "Show Property Price"
    showPropertyBool = false;
  }

  if(showPropertyBool){
    // Loop through all property markers
    for(i=0; i<propertyMarkers.length;i++){
      addMarker(propertyMarkers[i],map);
    } 
  } else {
    for(j=0; j<plottedMarker['property'].length;j++){
      plottedMarker['property'][j].setMap(null);
    }
    delete plottedMarker['property'];
  }
}

/*
----------------------------------------------------------------------------------------------------
The codes below are for chloropeth map related
----------------------------------------------------------------------------------------------------
*/
function retrieveMukimJson(file){
  var jsonData= (function() {
    $.ajax({
        type:'GET',
        url: file,
        dataType:'json',
        async:false,
        success:function(data){
            mukimJson.push(data);
        }
    });
    return mukimJson;
  })();
}

function retrieveDistrictJson(file){
  var jsonData= (function() {
    $.ajax({
        type:'GET',
        url: file,
        dataType:'json',
        async:false,
        success:function(data){
            districtJson = data;
        }
    });
    return districtJson;
  })();
}