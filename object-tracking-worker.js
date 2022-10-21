const fs = require('fs');
// const objectTracker = require('@cloud-annotations/object-tracking');
// const { Image, createCanvas } = require('canvas')
// const trackingCanvas = createCanvas(480, 480);
// const ctx = trackingCanvas.getContext('2d');
const cocoSsd = require('@tensorflow-models/coco-ssd');
const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');



parentPort.postMessage(trackObject(workerData));


// a deliberately inefficient implementation of the fibonacci sequence
function trackObject(frame) {


    const xmin = 200;
    const ymin = 200;
    const width = 200;
    const height = 200;


    //img.src = 'worker-image-test.jpg';

    //await ctx.drawImage(frame, 0, 0, 480, 480);

    



    // const imgStream = fs.readFile(frame);
    const img = fs.writeFileSync('stream.jpg', frame);
    const imageBuffer = fs.readFileSync('stream.jpg');
    const image = tf.node.decodeImage(imageBuffer, 3, 'int32', true);

    

    const tracker = objectTracker.init(buffer, [
        xmin,
        ymin,
        width,
        height
    ]);

    //parentPort.postMessage(trackObject(workerData));

    console.log(tracker);
    // let content = tracker.next;
    // try {
      

    //   setInterval(async () => {
    //     let box = await tracker.next(trackingCanvas);
    //     fs.writeFileSync('test.txt', box);
    //     //socket.emit('objectTracker', box);
    // },0);
    //   // file written successfully
    // } catch (err) {
    //   console.error(err);
    // }
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