const fs = require('fs');
const workerpool = require('workerpool');
const objectTracker = require('@cloud-annotations/object-tracking');
const { Image, createCanvas } = require('canvas');
const trackingCanvas = createCanvas(480, 480);



// a deliberately inefficient implementation of the fibonacci sequence
function fibonacci(frame) {

    const xmin = 200;
    const ymin = 200;
    const width = 200;
    const height = 200;
    

    convertImageToCanvas(frame);

    fs.writeFileSync('test.jpg', frame);

    //

    console.log(frame);

    // const imgStream = fs.readFile(frame);
    // const buffer = fs.writeFileSync('stream.jpg', frame);
    // const image = fs.readFileSync('stream.jpg');

    

    const tracker = objectTracker.init(trackingCanvas, [
        xmin,
        ymin,
        width,
        height
    ]);

    console.log(tracker);
}

// create a worker and register public functions
workerpool.worker({
  fibonacci: fibonacci
});

async function convertImageToCanvas(image) {
    const ctx = trackingCanvas.getContext('2d');
    const img = new Image();
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