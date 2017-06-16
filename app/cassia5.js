/**
 * Created by BigMac on 4/13/17.
 */
google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(makeTable);

var jsonStream;
var token = "";
var scannedDevices = [];
var data;
var scanFlag = false;
var request = new XMLHttpRequest();
var node = document.getElementById("devices");
var connectedNode = document.getElementById("connected");
var macId = "CC:1B:E0:E0:3A:58";
var deviceString;
var tempArr= [];
var dataChart;
var chart;
var options;
var patchMap = {};
var currDevice = null;
var hashMap = {};


renewToken();
setInterval(renewToken, 1500000);

function Patch(adString, macId)
{
    this.mac = macId;
    this.serialNum = getSN(adString);
    this.temperaturePlot = [];
    this.temperature = function(tempData){
        this.temperaturePlot.push([displayTime(), (parseInt(tempData.substring(58, 62),16) ^ 0xffff) * 0.0625]);
        return (parseInt(tempData.substring(58, 62),16) ^ 0xffff) * 0.0625;
    };




    //this.battery = getBattery(hexBattery);

    //this.serialNum = getSN(getCode(uuidRaw));


}

function renewToken()
{
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

    console.log(token);
}


function scan() {

    clearDeviceList();

    jsonStream = new EventSource('http://api.cassianetworks.com/' +
        'gap/nodes/?event=1&mac='+macId+'&chip=0&access_token=' + token);

    scanFlag = true;

    jsonStream.onmessage = function(e) {
        try {
            var response = JSON.parse(e.data);

            if (!elementExists(scannedDevices, response.bdaddrs[0].bdaddr)) {

                scannedDevices.push(response.bdaddrs[0].bdaddr);


                if (response.adData.includes("0401008F")) {


                    if (!patchMap.hasOwnProperty(getSN(response.adData))) {
                        patchMap[getSN(response.adData)] = new Patch(response.adData, response.bdaddrs[0].bdaddr);

                        hashMap[response.bdaddrs[0].bdaddr] = getSN(response.adData);

                        $("#devices").append('<option value=' + response.bdaddrs[0].bdaddr +
                            '>' + getSN(response.adData) + '</option>');
                    }

                    if (currDevice != null)
                    {
                        graphData(patchMap[currDevice].temperaturePlot);
                    }

                    console.log(patchMap[getSN(response.adData)].mac);
                    console.log(patchMap[getSN(response.adData)].serialNum);
                    console.log(patchMap[getSN(response.adData)].temperature(response.adData));
                    console.log(response.adData);

                }

            }
        } catch (err) {
            //console.log("error");
            jsonStream.close();
            scan();
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
   // $('#devices').children().remove();
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
        if (scanFlag)
        {
            jsonStream.close();
            scanFlag = false;
        }
        var option = document.createElement("option");
        option.text = deviceString;
        $("#devices option[value='" + deviceString + "']").remove();
        displayConnectedDevices();
        scannedDevices.splice(scannedDevices.indexOf(deviceString, 1));
        console.log(response);
    });
}

function changeFunc() {
    var id = node.options[node.selectedIndex].value;
    deviceString = id;
    currDevice = hashMap[id];

    console.log(hashMap[id]);

    $('#patchName').html("Serial number: " + currDevice);
    $('#patchMac').html("Patch MAC ID: " + id);
    //$('#patchBattery').html("Patch serial #: " + currDevice);

    graphData(patchMap[hashMap[id]].temperaturePlot);
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
        var data = JSON.parse(response);
        $('#connected').children().remove();

        for(var i = 0; i < data.nodes.length; i++)
        {
            $("#connected").append('<option value=' + data.nodes[i].id +
                '>' + data.nodes[i].id + '</option>');
        }
    });

}


function getSN(scanResult)
{
    //var hexSN = scanResult.substring(20, 22) + scanResult.substring(26, 30) + scanResult.substring(32, 34);

    var hexSN = scanResult.substring(48, 56);

    var SNBinary = dec2bin(parseInt(hexSN, 16)^ 0xffffffff) ;


    SNBinary = addZeros(SNBinary, 32);


    var SNWeek = getIntString(SNBinary, 6, 12);
    var SNUnique = getIntString(SNBinary, 12, 32);


    SNUnique = addZeros(SNUnique, 8);


    return "B" + SNWeek + "/" + SNUnique;
}

function getIntString (binValue, begin, end)
{
    return parseInt(binValue.substring(begin, end), 2).toString();
}

function dec2bin(dec)
{
    return (dec >>> 0).toString(2);
}

function addZeros(num, desiredLength)
{
    var difference = desiredLength - num.length;
    num = num.split("");

    for (var i = 0; i < difference; i++)
    {
        num.unshift("0");
    }

    return num.join("");
}

function formatNum(n){
    return n > 9 ? "" + n: "0" + n;
}



function makeTable() {

    dataChart = new google.visualization.DataTable();
    dataChart.addColumn('timeofday', 'Time');
    dataChart.addColumn('number', 'Temperature');


    options = {
        hAxis: {
            title: 'Time'

        },
        vAxis: {
            title: 'Temperature',
            format: '##.## C'
        }
    };

    chart = new google.visualization.LineChart(document.getElementById('chart_div'));
}

function graphData(arr) {

    makeTable();

    console.log(arr);
    $('#patchTemp').html("Current temperature: " + arr[arr.length-1][1]);

    $('#lastUpdate').html("Last updated: " + formatNum(arr[arr.length-1][0][0]) + ":" +
        formatNum(arr[arr.length-1][0][1]) + ":" + formatNum(arr[arr.length-1][0][2]));

    dataChart.addRows(arr);

    chart.draw(dataChart, options);
}

function displayTime() {
    var str = [];

    var currentTime = new Date();
    str.push(currentTime.getHours());
    str.push(currentTime.getMinutes());
    str.push(currentTime.getSeconds());
    return str;
}

document.getElementById("scanDevice").onclick = scan;
document.getElementById("connectDevice").onclick = connectDevice;
document.getElementById("connectedButton").onclick = displayConnectedDevices;


