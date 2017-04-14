/**
 * Created by BigMac on 4/13/17.
 */


var jsonStream;
var token = "";
var scannedDevices = [];
var data;
var deleteFlag = false;
var scanFlag = false;
var request = new XMLHttpRequest();
var node = document.getElementById("devices");
var connectedNode = document.getElementById("connected");
var macId = "CC:1B:E0:E0:43:B4";
var deviceString;



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

    clearDeviceList();

    jsonStream = new EventSource('http://api.cassianetworks.com/' +
        'gap/nodes/?event=1&mac=CC:1B:E0:E0:43:B4&chip=0&access_token=' + token);

    scanFlag = true;

    jsonStream.onmessage = function(e) {
        try {
            var response = JSON.parse(e.data);

            if (scannedDevices.length == 0)
            {
                console.log("(0) Back to main menu");
            }

            if (!elementExists(scannedDevices, response.bdaddrs[0].bdaddr)) {

                scannedDevices.push(response.bdaddrs[0].bdaddr);

                console.log("(" + scannedDevices.length + ") " + scannedDevices[scannedDevices.length-1]);

                var option = document.createElement("option");

                option.text = scannedDevices[scannedDevices.length-1];

                node.add(option);


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

function clearDeviceList()
{
    if(scanFlag){
        jsonStream.close();
        scanFlag = false;
    }

    scannedDevices = [];
    var length = node.options.length;

    for(var i = 0; i < length; i++)
    {
        node.remove(0);
    }
}

function connectDevice()
{
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": 'http://api.cassianetworks.com/gap/nodes/' + deviceString +
        '/connection?mac=' + macId + '&chip=0&access_token=' + token,
        "method": "POST",
        "headers": {
        }
    }

    $.ajax(settings).done(function (response) {
        var option = document.createElement("option");
        option.text = deviceString;
        node.remove(scannedDevices.indexOf(deviceString));
        connectedNode.add(option);
        scannedDevices.splice(scannedDevices.indexOf(deviceString, 1));
        console.log(response);
    });
}

function changeFunc() {
    deviceString = node.options[node.selectedIndex].value;
    console.log(node.options[node.selectedIndex].value);
}

function displayConnectedDevices()
{
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": 'http://api.cassianetworks.com/gap/nodes/' +
        '?connection_state=connected&mac=' + macId + '&access_token=' + token,
        "method": "GET",
        "headers": {
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
    });




}

document.getElementById("scanDevice").onclick = scan;
document.getElementById("connectDevice").onclick = connectDevice;
document.getElementById("connectedButton").onclick = displayConnectedDevices;


