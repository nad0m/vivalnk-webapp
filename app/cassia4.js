

var jsonStream;
var token = "5643753e98d2f922d88c798d9b06dedfec8a73ffa3d370f88456a3bbe6c07765fd1fb3838b0f887f79a73c753e4329993d1effb3a31b462ef97de738785d8d69";
var scannedDevices = [];
var data;
var deleteFlag = false;
var request = new XMLHttpRequest();
var node = document.getElementById("test");

request.open('POST', 'http://api.cassianetworks.com/oauth2/token');

request.setRequestHeader('Content-Type', 'application/json');
request.setRequestHeader('Authorization', 'Basic dml2YWxuazpiOGJlYjk5ZWVkZjY2ZGZi');

request.onreadystatechange = function () {
    if (this.readyState === 4) {
        data = JSON.parse(this.responseText);
        token = data.access_token;
    }
};

var body = {
    'grant_type': 'client_credentials'
};

request.send(JSON.stringify(body));





function scan() {
    jsonStream = new EventSource('http://api.cassianetworks.com/' +
        'gap/nodes/?event=1&mac=CC:1B:E0:E0:43:B4&chip=0&access_token=' + token);


    jsonStream.onmessage = function(e) {
        try {
            var response = JSON.parse(e.data);

            if (scannedDevices.length == 0)
            {
                console.log("(0) Back to main menu");
            }

            if (!elementExists(scannedDevices, response.bdaddrs[0].bdaddr)) {
                scannedDevices.push(response.bdaddrs[0].bdaddr);

                console.log("(" + scannedDevices.length + ") " + response.bdaddrs[0].bdaddr);

                ReactDOM.render("hello world", document.getElementById("test"));

            }

        } catch (err) {
            console.log("error");
            jsonStream.close();
            //chooseDevice();
        }

    }
}

function elementExists(arr, needle) {
    return arr.indexOf(needle) > -1;
}


