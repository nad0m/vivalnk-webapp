function getData() {
  var token;
  var request = require('request');
  var username = 'vivalnk';
  var password = 'b8beb99eedf66dfb';
  var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

  const CallBack = function(error, response, body) {
    body = JSON.parse(body);

    token = body.access_token;

    //Insert a call here

    //displayList(token);

    scanForDevice(token);

  };

  function getToken(callBack) {
    request({
      method: 'POST',
      url: 'http://api.cassianetworks.com/oauth2/token',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth
      },
      body: "{  \"grant_type\": \"client_credentials\"}"
    }, callBack);

  }
// ------- Display connected devices --------
  function displayList(token) {
    request({
      method: 'GET',
      url: 'http://192.168.0.16/gap/nodes/?connection_state=connected',
    }, function(error, response, body) {

      console.log('Response:', JSON.parse(body));
    });
  }
// ------- Scan for surrounding devices --------
  function scanForDevice(token) {
    var EventSource = require("eventsource");
    var advlib = require('advlib');
    var jsonStream = new EventSource('http://api.cassianetworks.com/' +
      'gap/nodes/?event=1&mac=CC:1B:E0:E0:43:B4&chip=0&access_token=' + token);
    var scannedDevices = [];


      jsonStream.onmessage = function (e) {
          
          var response = JSON.parse(e.data);
          
          if(!response.scanData && what != '')
          {
              // No Scan Data for previous Ad Data
              console.log(who + ': ' + what + ' rssi:' + where);
              //var processedPacket = ((what) ? advlib.ble.data.process(what) : '');
              //console.log(JSON.stringify(processedPacket, null, " "));
              // Clear out payload
              what = '';
          }
          
          who = response.bdaddrs[0].bdaddr;
          if(response.adData) {
              what = response.adData;
          }
          what = ((response.adData) ? response.adData : what);
          where = ((response.rssi) ? response.rssi : '');
      
          // Check if there was a second Advertsing Packet, i.e. Scan Data
          if(response.scanData)
          {
              if(response.scanData != what) what += response.scanData;
              console.log(who + ': ' + what + ' rssi:' + where);
              //var processedPacket = ((what) ? advlib.ble.data.process(what) : '');
              //console.log(JSON.stringify(processedPacket, null, " "));
              // Clear out payload
              what = '';
          }
    }
  };

  function elementExists(arr, needle){
    return arr.indexOf(needle) > -1
  }

// ------- Connect a device --------
  function connectDevice(deviceString, token){
    request({
      method: 'POST',
            url: 'http://192.168.0.16/gap/nodes/?event=1&mac=mac&chip=1',
    }, function(error, response, body) {

      console.log('Response:', body);
    });
  }



  getToken(CallBack);

}
var who;
var what;
var where;
getData();