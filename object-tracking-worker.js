const express = require('express');
const app = express();
const fs = require('fs');
const objectTracker = require('@cloud-annotations/object-tracking');
// const { Image, createCanvas } = require('canvas')
// const trackingCanvas = createCanvas(480, 480);
// const ctx = trackingCanvas.getContext('2d');
// const tf = require('@tensorflow/tfjs-node');
// const mobilenet = require('@tensorflow-models/mobilenet');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { Image, Canvas } = require('skia-canvas');
const videoStream = require('./videoStream');
const canvas = new Canvas(480, 480);
const img = new Image();









//parentPort.postMessage({ tracking: trackObject(workerData)});
function test(workerData) {


  const streamImage = workerData.getLastFrame();
  let image = fs.writeFileSync('stream.jpg', workerData);
  let box = trackObjectAsync();
  

  return box;

}

function getImage(imgBinary) {
  



  async() => {

    //streamImage = await videoStream.getLastFrame();
    //binary = await new Uint8Array(streamImage);

    //console.log(streamImage);
    //console.log(binary);

    await fs.writeFileSync('stream.jpg', binary);
  
    
    

  }



  

  

  

  

}




function trackObject(workerData) {
  
  let imgUint8Array = workerData;

  console.log(workerData);

  //const streamImage = workerData.getLastFrame();

  //console.log(streamImage);
  
  
  const ctx = canvas.getContext('2d');

  console.log(canvas);

  
  const binary = new Uint8Array(imgUint8Array);
  console.log(binary);
  fs.writeFileSync('stream.jpg', imgUint8Array);


  
  img.src = 'stream.jpg';
  ctx.drawImage(img, 0, 0, 480, 480);

  const xmin = 200;
  const ymin = 200;
  const width = 200;
  const height = 200;
  
  
  const tracker = objectTracker.init(canvas, [
    xmin,
    ymin,
    width,
    heigh
  ]);

//   return canvas;

  return tracker;

}

//parentPort.postMessage({ welcome: testCounter(workerData) });

//parentPort.postMessage({ tracker: trackObject(workerData) });

function trackObjectAsync() {

  const canvas = new Canvas(480, 480);
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'stream.jpg';
    ctx.drawImage(img, 0, 0, 480, 480);

    const xmin = 200;
    const ymin = 200;
    const width = 200;
    const height = 200;

    

    const tracker = objectTracker.init(canvas, [
      xmin,
      ymin,
      width,
      height
  ]);


        let box = tracker.next(canvas);
        return box;
        //socket.emit('objectTracker', box);


}


async function convertImageToCanvas(image) {
  console.log(image);
    const ctx = await trackingCanvas.getContext('2d');
    const img = await new Image();
    img.src = image;
    await ctx.drawImage(img, 0, 0, 480, 480);
}

function decodeBase64(data) {
  let socketType = 'track';
  let d = data.split('data:image/png;base64,');
  let img = data.utf8Data;
  const buffer = Buffer.from(d[1], 'base64');
  let imgFile = socketType + '-image.gif';
  let image = fs.writeFileSync(imgFile, buffer);
  //const imageBuffer = fs.readFileSync(socketType + '-image.gif');
  
  //return imageBuffer;
}

function convertToCanvas() {
    
  const ctx = trackingCanvas.getContext('2d');
  const img = new Image();
  img.src = 'track-image.gif';
  ctx.drawImage(img, 0, 0, width, height);
 // img.src = 'test.jpg';
}

getImage();