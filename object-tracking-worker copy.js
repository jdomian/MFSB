const fs = require('fs');
const workerpool = require('workerpool');
const objectTracker = require('@cloud-annotations/object-tracking');
const { Image, createCanvas } = require('canvas')
const trackingCanvas = createCanvas(480, 480);
const ctx = trackingCanvas.getContext('2d');




// a deliberately inefficient implementation of the fibonacci sequence
function trackObject(frame) {

    const xmin = 200;
    const ymin = 200;
    const width = 200;
    const height = 200;

    fs.writeFileSync('worker-image-test.jpg', frame);
    // let image = fs.readFileSync('worker-image-test.jpg');
    let img = new Image();
    img.src = 'worker-image-test.jpg';

    ctx.drawImage(img, 0, 0, 480, 480);

    //await ctx.drawImage(frame, 0, 0, 480, 480);

    



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
    let content = tracker.next;
    try {
      

      setInterval(async () => {
        let box = await tracker.next(trackingCanvas);
        fs.writeFileSync('test.txt', box);
        //socket.emit('objectTracker', box);
    },0);
      // file written successfully
    } catch (err) {
      console.error(err);
    }
}

// create a worker and register public functions
workerpool.worker({
  trackObject: trackObject
});

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