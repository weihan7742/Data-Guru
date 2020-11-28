var result;

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

export{result};
  
// var data;

// function readTextFile(file, callback) {
//     var rawFile = new XMLHttpRequest();
//     rawFile.overrideMimeType("application/json");
//     rawFile.open("GET", file, true);
//     rawFile.onreadystatechange = function() {
//         if (rawFile.readyState === 4 && rawFile.status == "200") {
//             callback(rawFile.responseText);
//         }
//     }
//     rawFile.send(null);
// }

// //usage:
// readTextFile("test_csv.json", function(text){
//     var data = JSON.parse(text);
//     console.log(data);
// });

// console.log(data)