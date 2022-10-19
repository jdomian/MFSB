const video = document.getElementById('stream');
let objectDetector;


const loop = classifier => {
  classifier.classify().then(results => {
    console.log(results);
    loop(classifier); // Call again to create a loop
  });
};

const looper = detector => {
  objectDetector.detect(video, (err, results) => {
    console.log(results);
    looper(detector); // Call again to create a loop
  });
};

function startDetecting() {
  console.log('model ready')
  detect();
}

function detect() {
  objectDetector.detect(video, (err, results) => {
    console.log(results); // Will output bounding boxes of detected objects
  });
}

function AIDetect() {
  video.addEventListener('loadeddata', (event) => {
    //ml5.imageClassifier("MobileNet", video).then(classifier => loop(classifier));
    objectDetector = ml5.objectDetector('MobileNet', {}, looper);
    //objectDetector = ml5.objectDetector('MobileNet', {}, startDetecting);
  });
}




// Initialize the Image Classifier method with MobileNet passing the video as the
// second argument and the getClassification function as the third
