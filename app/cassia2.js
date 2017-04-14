function getData() {
  var token;
  var request = require('request');
  var username = 'vivalnk';
  var password = 'b8beb99eedf66dfb';
  var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
  var scannedDevices = [];

  const CallBack = function(error, response, body) {
    body = JSON.parse(body);

    console.log(body.access_token);

    return body.access_token;

    //Insert a call here   
  };

  //getToken(CallBack); // renew token

  request({
      method: 'POST',
      url: 'http://api.cassianetworks.com/oauth2/token',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth
      },
      body: "{  \"grant_type\": \"client_credentials\"}"
    }, CallBack);

  console.log(token);
}

getData();