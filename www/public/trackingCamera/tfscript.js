var model = undefined;

// Before we can use COCO-SSD class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
cocoSsd.load().then(function (loadedModel) {
  model = loadedModel;
});

const video = document.getElementById('stream');

// Keep a reference of all the child elements we create
// so we can remove them easilly on each render.
var children = [];

video.addEventListener('loadeddata', predictWebcam);


// Prediction loop!
function predictWebcam() {
  // Now let's start classifying the stream.
  model.detect(video).then(function (predictions) {

    //console.log(predictions);

    let styles = '';
    var label = document.getElementById("TFTargetLabel");

    for (let n = 0; n < predictions.length; n += 1) {

      if (predictions[n].score > 0.66) {
        label.innerHTML = predictions[n].class + '</br>' + Math.round(parseFloat(predictions[n].score) * 100) + '% confidence.';;
        label.classList.remove("locating");

        styles = {
          'width': (predictions[n].bbox[2] / 2 ) + 'px',
          'height': (predictions[n].bbox[3] / 2 ) + 'px',
          'top': (predictions[n].bbox[1] / 2) + 'px',
          'left': (predictions[n].bbox[0] / 2) + 'px'
        };
      }
      
    }

    var obj = document.getElementById("TFTarget");
    Object.assign(obj.style, styles); 

    // Remove any highlighting we did previous frame.
    // for (let i = 0; i < children.length; i++) {
    //   liveView.removeChild(children[i]);
    // }
    // children.splice(0);
    
    // // Now lets loop through predictions and draw them to the live view if
    // // they have a high confidence score.
    // for (let n = 0; n < predictions.length; n++) {
    //   // If we are over 66% sure we are sure we classified it right, draw it!
    //   if (predictions[n].score > 0.66) {
    //     const p = document.createElement('p');
    //     p.innerText = predictions[n].class  + ' - with ' 
    //         + Math.round(parseFloat(predictions[n].score) * 100) 
    //         + '% confidence.';
    //     // Draw in top left of bounding box outline.
    //     p.style = 'left: ' + predictions[n].bbox[0] + 'px;' +
    //         'top: ' + predictions[n].bbox[1] + 'px;' + 
    //         'width: ' + (predictions[n].bbox[2] - 10) + 'px;';

    //     // Draw the actual bounding box.
    //     const highlighter = document.createElement('div');
    //     highlighter.setAttribute('class', 'highlighter');
    //     highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
    //         + predictions[n].bbox[1] + 'px; width: ' 
    //         + predictions[n].bbox[2] + 'px; height: '
    //         + predictions[n].bbox[3] + 'px;';

    //     liveView.appendChild(highlighter);
    //     liveView.appendChild(p);
        
    //     // Store drawn objects in memory so we can delete them next time around.
    //     children.push(highlighter);
    //     children.push(p);
    //   }
    // }


    
    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predictWebcam);
  });
}