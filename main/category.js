
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

var output = ` `

function selectFunction(value){
    console.log("Clicked successful!");
    output +=
    `<p>${value}</p>`
    document.getElementById('chipDisplay').innerHTML = output;
}