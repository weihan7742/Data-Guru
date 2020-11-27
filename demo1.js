        
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
        
    })()