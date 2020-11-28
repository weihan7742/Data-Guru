
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

function deleteChip(index){
  chipOutput.splice(index,1); 
  document.getElementById('chipDisplay').innerHTML = displayChip();
}

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