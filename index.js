const express = require('express');
const app = express();
const fs = require('fs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const { kill } = require('process');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const workerpool = require('workerpool');
const pool = workerpool.pool(__dirname + '/object-tracking-worker.js');
//const io = require('socket.io')(httpServer, {allowEIO3: true}) //require socket.io module and pass the http object (server)
const os = require('os');
const interfaces = os.networkInterfaces();
const serverIP = interfaces.wlan0[0].address;
const port = 8000;
const server = app.listen(port, () => console.log(`Example app listening on port ${port}! In your web browser, navigate to http://${serverIP}:${port}`));
let children = [];


const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    allowEIO3: true
  });

const videoStream = require('./videoStream');


function runService(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./object-tracking-worker.js', { workerData });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    })
  })
}

async function run() {
  let img = videoStream.getLastFrame();
  console.log(img);
  const result = await runService(img);
  console.log(result);
}

//run().catch(err => console.error(err))

videoStream.acceptConnections(app, {
    width: 480,
    height: 480,
    fps: 30,
    encoding: 'JPEG',
    quality: 8 // lower is faster, less quality
}, '/stream.mjpg', true);

  

let socket = io.sockets.on('connection', function (s) {

    s.on('startAccelerometer', (args) => {
        console.log(args);
        console.log('Accelerometer started!');
        msa311_accelerometer();
    });

    s.on('stopAccelerometer', (args) => {
        console.log(args);
        console.log('Accelerometer stopped.');
        killProcesses();
    });

    s.on('sudoReboot', (args) => {
      killProcesses();
      console.log('Rebooting...');
      exec('sudo reboot', console.log('Rebooting...'));
    });

    s.on('sudoShutdown', (args) => {
      killProcesses();
      exec('sudo shutdown -h now', console.log('Shutting down...'));
    });


    s.on('track', (args) => {
      //let img = videoStream.getLastFrame();
      run().catch(err => console.error(err))
      //trackObjectWorker(img);
    });

});




function msa311_accelerometer() {
    killProcesses();
    console.log('socket connected');
    console.log('Launching accelerometer');
    let accelerometer = spawn('python3',['/home/pi/MFSB-mjpg-streamer/msa311_accelerometer.py']);
    children.push(accelerometer);


    accelerometer.stdout.on('data', function(data){
        let chunk = '';
        chunk += data;
        socket.emit('accelerometer', chunk);
    });
}



function killProcesses() {

    children.forEach(function(child) {
      child.kill('SIGINT');
      exec('sudo kill -9 ' + child.pid);
  
      console.log('killed process: ' + child.pid);
      children = new Array();
    });
  }


function trackObjectWorker(data) {
  // pool.exec('fibonacci', [data])
  //   .then(function (result) {
  //     console.log('Result: ' + result); // outputs 55
  //   })
  //   .catch(function (err) {
  //     console.error(err);
  //   })
  //   .then(function () {
  //     pool.terminate(); // terminate all workers when done
  //   });
  pool.exec('trackObject', [data])
    .then(function (result) {
      console.log('Result: '); // outputs 55
      console.log(result); // outputs 55
    })
    .catch(function (err) {
      console.error(err);
    });
    // .then(function () {
    //   pool.terminate(); // terminate all workers when done
    // });

}

app.use(express.static(__dirname+'/public'));