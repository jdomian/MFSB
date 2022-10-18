const http = require('http').createServer(handler); //require http server, and create server with function handler()
const fs = require('fs'); //require filesystem module
const io = require('socket.io')(http,{allowEIO3: true}) //require socket.io module and pass the http object (server)
let socket = io.sockets.on('connection', function (s) { return s; });
//let socket;

const rpio = require('rpio');
const Gpio = require('pigpio').Gpio;
const path = require('path');
const spawn = require("child_process").spawn;
const exec = require("child_process").exec;
let children = [];

let motor;
let pulseWidth = 1500;
let screen;
let state;

var rpioCycleScreenPin = 29;
var rpioSelectPin = 31;
var rpioModePin = 15;
var rpioTriggerPin = 7;

var ammo = 15;

http.listen(8080); //listen to port 8080

//Cycle Pin tied to screen cycling, located on right side of scope
rpio.open(rpioCycleScreenPin, rpio.INPUT, rpio.PULL_UP);
//console.log('Cycle Pin' + rpioCycleScreenPin + ' is currently ready... STATE:' + (rpio.read(rpioCycleScreenPin) ? 'high' : 'low'));

//Select Pin tied to RIGHT blue "SELECT" button
rpio.open(rpioSelectPin, rpio.INPUT, rpio.PULL_UP);
//console.log('Select Pin' + rpioSelectPin + ' is currently ready... STATE:' + (rpio.read(rpioSelectPin) ? 'high' : 'low'));

//Mode Pin tied to LEFT blue "MODE" button
rpio.open(rpioModePin, rpio.INPUT, rpio.PULL_UP);
//console.log('Mode Pin' + rpioModePin + ' is currently ready... STATE:' + (rpio.read(rpioModePin) ? 'high' : 'low'));

//Ammo Pin tied to trigger pull
rpio.open(rpioTriggerPin, rpio.INPUT, rpio.PULL_UP);
//console.log('Trigger pin' + rpioTriggerPin + ' is currently ready... STATE:' + (rpio.read(rpioTriggerPin) ? 'high' : 'low'));

console.log('Child Processes: ');
console.log(children);



function handler (req, res) { //create server
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 0, // 30 days
    /** add other headers as per requirement */
  };


  if (req.url == '/ammoCounter.html') {
    screen = req.url;
    killProcesses();
    io.sockets.on('connection', function (s) {// WebSocket Connection
      //if (socket == undefined) {
      //  socket = s;
      //}
      var reloadData = 0; //static variable for current status
      socket.on('reload', function(data) { //get light switch status from client
        reloadData = data;
        //console.log(reloadData);
        if (reloadData) {
          //console.log(reloadData); //turn LED on or off, for now we will just show it in console.log
          ammo = reloadData;
          //console.log('RELOADED! Ammo:' + ammo);
        }
      });
    });
    console.log('Child Processes: ');
    console.log(children);

  }
  if (req.url == '/zoomCamera1.html') {
    screen = req.url;
    killProcesses();
    spawnCamera();

    

    //io.sockets.on('connection', function (socket) {// WebSocket Connection
      


      var reloadData = 0; //static variable for current status
      
      socket.on('reload', function(data) { //get light switch status from client
        reloadData = data;
        //console.log(reloadData);
        if (reloadData) {
          //console.log(reloadData); //turn LED on or off, for now we will just show it in console.log
          ammo = reloadData;
          //console.log('RELOADED! Ammo:' + ammo);
        }
      });
      
    //});
    console.log('Child Processes: ');
    console.log(children);
  }

  if (req.url == '/accelerometer.html') {
    screen = req.url;
    killProcesses();
    //io.sockets.on('connection', function (socket) {

        

        let accelerometer = spawn('python',["/home/pi/msa301_simpletest.py"]);
        console.log(`Accelerometer child pid: ${accelerometer}`);
        children.push(accelerometer);
      //Send python sccelerometer data to UI in browser
      accelerometer.stdout.on('data', function(data){
        let chunk = '';
        chunk += data
        socket.emit('accelerometer', chunk);
      });
    //});
    console.log('Child Processes: ');
    console.log(children);
  }


  if (req.url == '/servo.html') {
    screen = req.url;
    killProcesses();
    //spawnCamera();

    motor = new Gpio(17, {mode: Gpio.OUTPUT})
    //io.sockets.on('connection', function (socket) {

      console.log('servo starting');
      
      motor.servoWrite(0);
      
      setTimeout(function() {
        motor.servoWrite(500);
        io.sockets.emit("servoControl", [500, '', '']);
      }, 1000);
      
      
      setTimeout(function() {
        motor.servoWrite(2500);
        io.sockets.emit("servoControl", [2500, '', '']);
      }, 2000);
      
      
      setTimeout(function() {
        motor.servoWrite(1500);
      
        // setInterval(() => {
        //   motor.servoWrite(pulseWidth);
      
        //   pulseWidth += increment;
        //   console.log(pulseWidth);
        //   if (pulseWidth >= 2500) {
        //     increment = -100;
        //   } else if (pulseWidth <= 500) {
        //     increment = 100;
        //   }

        //   socket.emit('servo', pulseWidth);
        // }, 100);
        io.sockets.emit("servoControl", [1500, '', '']);
      }, 3000);
      pulseWidth = 1500;

      
      // rpio.poll(rpioSelectPin, servoControl);
      // rpio.poll(rpioModePin, servoControl);
    
      // socket.on('servo-right', function(data) {
      //   console.log('moved servo right ' + data);
      // });
        
    //});
    console.log('Child Processes: ');
    console.log(children);
  }

  
  if (req.url == '/doom.html') {
    killProcesses();
    let doom = spawn('/usr/games/chocolate-doom');
    children.push(doom);
    console.log('Child Processes: ');
    console.log(children);
  }



  var filePath = '.' + req.url;
    if (filePath == './') {
      //console.log('serving index...');
      //console.log('filepath: ' + filePath);
      filePath = 'index.html';
    }
    else {
      //console.log('serving file...');
      //console.log('filepath: ' + filePath);
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
    //console.log('mime: ' + contentType);





  fs.readFile(__dirname + '/public/' + filePath, function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    }


    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Max-Age': 2592000, // 30 days
      'Content-Type': contentType
      /** add other headers as per requirement */
    };
    
    res.writeHead(200, headers); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
  //console.log('Listening...');
}


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

        console.log('Select button pushed on pin P%d', pin);
        console.log(screen);
        console.log(rpio.read(pin));

        if (screen == '/servo.html') {
          servoControl(pin, rpio.read(pin))
        }

        io.sockets.emit("selectBtn", [pin, rpio.read(pin)]);
        
}
rpio.poll(rpioSelectPin, pollSelect);


function pollMode(pin)
{
        // Wait for a small period of time to avoid rapid changes which can't all be caught with the 1ms polling frequency.  If the pin is no longer down after the wait then ignore it.
        rpio.msleep(20);

        console.log('Mode button pushed on pin P%d', pin);

        if (screen == '/servo.html') {
          servoControl(pin, rpio.read(pin))
        }
        io.sockets.emit("modeBtn", [pin, rpio.read(pin)]);
        
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

let servoRotate;

function servoControl(pin, state)
{
  
        // Wait for a small period of time to avoid rapid changes which can't all be caught with the 1ms polling frequency.  If the pin is no longer down after the wait then ignore it.
       
        let direction;
        let pulseIncrement;
        

          if (pin == rpioModePin) {
            pulseIncrement = 100;
            direction = 'left';

          }
          else if (pin == rpioSelectPin) {
            pulseIncrement = -100;
            direction = 'right';
            
          }

        rotateServo(pulseIncrement, state, direction);

        
        //io.sockets.emit("servoControl", [ammo, rpio.read(pin)]);
        
}


// const servoRotate = setInterval(rotateServo(), 500);
let leftPressed = false;
let rightPressed = false;
function rotateServo(pulseIncrement, state, direction) {

  clearInterval(servoRotate);
  const servoRotationSpeed = 30;



  if (state == 0) {
    if (direction == 'right') {
      rightPressed = true;
    }
    if (direction == 'left') {
      leftPressed = true;
    }

    if (rightPressed == true && leftPressed == true) {
      pulseWidth = 1500;
      motor.servoWrite(pulseWidth);
      io.sockets.emit("servoControl", [pulseWidth, state, direction]);
    }
    else {
      servoRotate = setInterval(function(){

        

          pulseWidth += pulseIncrement;

          if (pulseWidth > 2500) {
            pulseWidth = 2500;
          }
          else if (pulseWidth < 500) {
            pulseWidth = 500;
          }
          
          motor.servoWrite(pulseWidth);
    
        io.sockets.emit("servoControl", [pulseWidth, state, direction]);
    
      }, servoRotationSpeed);
    }
    
  }
  else {
    if (direction == 'right') {
      rightPressed = false;
    }
    if (direction == 'left') {
      leftPressed = false;
    }

  }
  
}

function spawnCamera() {
  console.log('launching camera...');
  let camera = spawn('node',["/home/pi/node_modules/raspberrypi-node-camera-web-streamer/index.js"]);
  children.push(camera);
}


function killProcesses() {

  children.forEach(function(child) {
    console.log(child);
    child.kill('SIGINT');
    exec('sudo kill -9 ' + child.pid);

    console.log('killed process: ' + child.pid);
    children = new Array();
  });
}

