var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http,{allowEIO3: true}) //require socket.io module and pass the http object (server)
var rpio = require('rpio');
const path = require('path');

var rpioCycleScreenPin = 3;
var rpioSelectPin = 5;
var rpioModePin = 15;
var rpioTriggerPin = 7;

var ammo = 10;

http.listen(8080); //listen to port 8080


//Cycle Pin tied to screen cycling, located on right side of scope
rpio.open(rpioCycleScreenPin, rpio.INPUT, rpio.PULL_UP);
console.log('Cycle Pin' + rpioCycleScreenPin + ' is currently ready... STATE:' + (rpio.read(rpioCycleScreenPin) ? 'high' : 'low'));

//Select Pin tied to RIGHT blue "SELECT" button
rpio.open(rpioSelectPin, rpio.INPUT, rpio.PULL_UP);
console.log('Select Pin' + rpioSelectPin + ' is currently ready... STATE:' + (rpio.read(rpioSelectPin) ? 'high' : 'low'));

//Mode Pin tied to LEFT blue "MODE" button
rpio.open(rpioModePin, rpio.INPUT, rpio.PULL_UP);
console.log('Mode Pin' + rpioModePin + ' is currently ready... STATE:' + (rpio.read(rpioModePin) ? 'high' : 'low'));

//Ammo Pin tied to trigger pull
rpio.open(rpioTriggerPin, rpio.INPUT, rpio.PULL_UP);
console.log('Trigger pin' + rpioTriggerPin + ' is currently ready... STATE:' + (rpio.read(rpioTriggerPin) ? 'high' : 'low'));


function handler (req, res) { //create server
  console.log('Server created.');


  var filePath = '.' + req.url;
    if (filePath == './') {
      console.log('serving index...');
      console.log('filepath: ' + filePath);
      filePath = 'index.html';
    }
    else {
      console.log('serving file...');
      console.log('filepath: ' + filePath);
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream'
    console.log('mime: ' + contentType);

  fs.readFile(__dirname + '/public/' + filePath, function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': contentType}); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
  console.log('Listening...');
}

io.sockets.on('connection', function (socket) {// WebSocket Connection
  var reloadData = 0; //static variable for current status
  socket.on('reload', function(data) { //get light switch status from client
    reloadData = data;
    console.log(reloadData);
    if (reloadData) {
      console.log(reloadData); //turn LED on or off, for now we will just show it in console.log
      ammo = reloadData;
      console.log('RELOADED! Ammo:' + ammo);
    }
  });
});



function pollTrigger(pin)
{
  
        // Wait for a small period of time to avoid rapid changes which can't all be caught with the 1ms polling frequency.  If the pin is no longer down after the wait then ignore it.
        rpio.msleep(20);

        //Do nothing if pin returns value "0". This is to use when only poll for pin button in a "down" state.
        //if (rpio.read(pin))
        //        return;

        if (rpio.read(pin) == 0) {
          --ammo;
        }
        
        console.log('Ammo left ' + ammo);
        io.sockets.emit("triggerBtn", [ammo, rpio.read(pin)]);
        
}
rpio.poll(rpioTriggerPin, pollTrigger);

function pollSelect(pin)
{
        // Wait for a small period of time to avoid rapid changes which can't all be caught with the 1ms polling frequency.  If the pin is no longer down after the wait then ignore it.
        rpio.msleep(20);
        if (rpio.read(pin))
                return;
        console.log('Select button pushed on pin P%d', pin);
        io.sockets.emit("selectBtn", true);
        
}
rpio.poll(rpioSelectPin, pollSelect);

function pollMode(pin)
{
        // Wait for a small period of time to avoid rapid changes which can't all be caught with the 1ms polling frequency.  If the pin is no longer down after the wait then ignore it.
        rpio.msleep(20);
        if (rpio.read(pin))
                return;
        console.log('Mode button pushed on pin P%d', pin);
        io.sockets.emit("modeBtn", true);
        
}
rpio.poll(rpioModePin, pollMode);


function pollCycleScreen(pin)
{
        //console.log(rpio.read(pin));

        // Wait for a small period of time to avoid rapid changes which can't all be caught with the 1ms polling frequency.  If the pin is no longer down after the wait then ignore it.
        rpio.msleep(20);
        // if (rpio.read(pin))
        //         return;
        console.log('Cycle screen button pushed on pin P%d', pin);
        io.sockets.emit("cycleScreen", rpio.read(pin));
        
}
rpio.poll(rpioCycleScreenPin, pollCycleScreen);