var http = require('http');
http.createServer(function (req, res) {
    res.write('<html><head></head><body>');
    res.write('<p>Write your HTML content here</p>');
    res.end('</body></html>');
}).listen(1337);