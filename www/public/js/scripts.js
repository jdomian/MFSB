//settings
var ammoCountSetting = localStorage.getItem('ammoCountSetting');

var hold = 0;
var triggerHold = 0;
var triggerHoldReload = false;
var maxRounds = ammoCountSetting;
var currentRounds = maxRounds;
var ammoCount = $('.ammoCount');
var btnReload = document.getElementById("btnReload");
var currentView = 0;

var debugTriggerAmmo = maxRounds;
var debugTiggerPin = 0;

// window.onload = function funLoad() { 
//   document.getElementById('stream').play();
// } 

// -- ACTIONS -- //

//Trigger to count down ammo
function fire(count) {
  console.log(count); //Log when button is pushed
  ammoCount.text(count);
  let deg = 360 / maxRounds;
  let precentDeg = 180 - ((maxRounds - count) * deg);

  if (count / maxRounds >= 0.5) {
      $('#ammoScreen .bar.right').css('transform', 'rotate(' + precentDeg + 'deg)');
  }
  else if (count < 0) {
    $('.ammoScreen').addClass('reload');
  }
  else {
      $('#ammoScreen .bar.right').css('transform', 'rotate(180deg)').addClass('transparent');
      $('#ammoScreen .bar.left').css('transform', 'rotate(' + precentDeg + 'deg)');
  }

}

//Reload on ammo count screen
function reload() {
    var data = ammoCountSetting;
    socket.emit("reload", data); //send button status to server (as 1 or 0)
    ammoCount.text(maxRounds);
    $('.ammoScreen').removeClass('reloading reload');
    $('#ammoScreen .bar.right').css('transform', 'rotate(180deg)').removeClass('transparent');
    $('#ammoScreen .bar.left').css('transform', 'inherit');
}

//Screen cycling
function changeScreen() {
  
  console.log('Cycling screen');
  clearTimeout(hold);
  $('.carousel').carousel('next');
}

//Select
function select() {
  switch (currentView) {
    case 0:
      console.log('Ammo select');
      localStorage.setItem('ammoCountSetting', ammoCountSetting);
      $('#ammoScreen .mode-screen').removeClass('configure');
      reload();
      window.location.reload();
      break;
    case 1:
      console.log('Aim select');
      let $cam = $('#webcamPi');
      let $zLvl = $('.zoomLevel');
      if ($cam.hasClass('x1')) {
        $cam.removeClass('x1').addClass('x2');
        $zLvl.text('2x');
      }
      if ($cam.hasClass('x2')) {
        $cam.removeClass('x2').addClass('x3');
        $zLvl.text('3x');
      }
      else if ($cam.hasClass('x3')) {
        $cam.removeClass('x3').addClass('x5');
        $zLvl.text('5x');
      }
      else if ($cam.hasClass('x5')) {
        $cam.removeClass('x5').addClass('x10');
        $zLvl.text('10x');
      }
      else if ($cam.hasClass('x10')) {
        $cam.removeClass('x10').addClass('x1');
        $zLvl.text('');
      }
      
      break;
    case 2:
    default:
      console.log('slide');
  }
}

//Select
function mode() {
  switch (currentView) {
    case 0:

      var $modeScreen = $('#ammoScreen .mode-screen');
      var $modes = $('#ammoScreen .mode-screen .modes');


      
      $modes.children('li').each(function(i,e){
          if(e.innerText == ammoCountSetting)
          {
              $(e).addClass("selected");
          }
      });
      

      if ($modeScreen.hasClass('configure')) {
        var $selectedMode = $modes.children('li.selected').removeClass("selected");
        var $divs = $selectedMode.parent().children();
        $divs.eq((($divs.index($selectedMode) + 1) % $divs.length)).addClass("selected");
        ammoCountSetting = $modes.children('li.selected').text();
      }

      $modeScreen.addClass('configure');
      

    
      break;
    case 0:
      console.log('Mangoes and papayas are $2.79 a pound.');
      break;
    case 2:
    default:
      console.log('slide');
  }
} 




// -- EVENTS -- //

function triggerBtn([ammo, pin]) {
  currentRounds = ammo;
  if (pin == 0) {
    triggerHold = setTimeout(function(){
      triggerHoldReload = true;
      $('.ammoScreen').addClass('reloading');
    },5000);
    fire(currentRounds);
  }
  else if (pin == 1 && triggerHoldReload) {
    reload();
    triggerHoldReload = false;
    clearTimeout(triggerHold);
  }
  else {
    console.log(triggerHold);
    console.log('Changin Mode/Selection');
    triggerHoldReload == false;
    clearTimeout(triggerHold);
  }
}


var socket = io(); //load socket.io-client and connect to the host that serves the page

//Trigger button events 
socket.on("triggerBtn", ([ammo, pin]) => {
  triggerBtn([ammo, pin]);
  debugTriggerAmmo = ammo;
  debugTiggerPin = pin;
});

socket.on("selectBtn", (arg) => {
  select();
});


socket.on("modeBtn", (arg) => {
  mode();
});

socket.on("cycleScreen", (arg) => {
  if (arg == 0) {
    changeScreen();
  }
  //Save for later: change screen on holding of button for 3 sec
  // if (arg == 0) {
  //   hold = setTimeout("changeScreen()",3000);
  // }
  // else {
  //   console.log(hold);
  //   console.log('Changing Mode/Selection');
  //   clearTimeout(hold);
  // }
});

$(document).ready(function(){
  $('.number.ammoCount').text(ammoCountSetting);
});

//Debugging
$('#debugFire').click(function(){
  triggerBtn([debugTriggerAmmo, debugTiggerPin]);
});
$('#debugCycle').click(function(){
  $('.carousel').carousel('next');
});
$('#debugSelect').click(function(){
  select();
});
$('#debugMode').click(function(){
  mode();
});

$('.carousel').on('slid.bs.carousel', function (e) {
  currentView = e.to;
});



// var img = new Image();
// img.crossOrigin = "anonymous";   // COMMENT OUT TO SEE IT FAIL
// img.onload = uploadTex;
// //img.src = "https://i.imgur.com/ZKMnXce.png"; 
// img.src = 'http://10.0.0.222:3000/stream.mjpg';

// function uploadTex() {
//   var gl = document.createElement("canvas").getContext("webgl");
//   var tex = gl.createTexture();
//   gl.bindTexture(gl.TEXTURE_2D, tex);
//   try {
//     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
//     document.body.appendChild(gl);
//     log("DONE: ", gl.getError());
//   } catch (e) {
//     log("FAILED to use image because of security:", e);
//   }
// }

// function log() {
//   var div = document.createElement("div");
//   div.innerHTML = Array.prototype.join.call(arguments, " ");
//   document.body.appendChild(div);
// }





//ml5 image only.

// const image = document.getElementById('webcamPi'); // The image we want to classify

// // Initialize the Image Classifier method with MobileNet
// ml5.imageClassifier('MobileNet')
//   .then(classifier => classifier.classify(image))
//   .then(results => {
//     console.log(results);
//     console.log(results[0].label);
//     console.log(results[0].confidence.toFixed(4));
//   });



  /* ===
ml5 Example
Real time Object Detection using objectDetector
=== */

let objectDetector;
let status;
let objects = [];
let canvas, ctx;
const width = 320;
const height = 240;

function make() {
  img = new Image();
  img.crossOrigin = 'anonymous'; 
  img.src = 'http://10.0.0.222:3000/stream.mjpg';
  img.width = width;
  img.height = height;

  objectDetector = ml5.objectDetector('MobileNet', startDetecting)

  canvas = createCanvas(width, height);
  ctx = canvas.getContext('2d');
}

// when the dom is loaded, call make();
window.addEventListener('DOMContentLoaded', function () {
  make();

setInterval(function(){
  //make();
},10000);

 
  
});

function startDetecting() {
  console.log('model ready')
  detect();
}

function detect() {
  objectDetector.detect(img, function (err, results) {
    if (err) {
      console.log(err);
      return
    }
    objects = results;

    if (objects) {
      console.log(objects);
      //draw();
      drawCSS();
    }
  });
}

function draw() {
  // Clear part of the canvas
  ctx.fillStyle = "#000000"
  ctx.fillRect(0, 0, width, height);

  ctx.drawImage(img, 0, 0);
  for (let i = 0; i < objects.length; i += 1) {

    ctx.font = "16px Arial";
    ctx.fillStyle = "green";
    ctx.fillText(objects[i].label, objects[i].x + 4, objects[i].y + 16);

    ctx.beginPath();
    ctx.rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
    ctx.strokeStyle = "green";
    ctx.stroke();
    ctx.closePath();
  }
}

function drawCSS() {

  let styles = '';
  var label = document.getElementById("TFTargetLabel");

  for (let i = 0; i < objects.length; i += 1) {

    label.innerText = objects[i].label;
    label.classList.remove("locating");

    styles = {
      'width': objects[i].width + 'px',
      'height': objects[i].height + 'px',
      'top': objects[i].y + 16 + 'px',
      'left': objects[i].x + 4 + 'px'
    };
  }

  var obj = document.getElementById("TFTarget");
  Object.assign(obj.style, styles); 
  

}


function createCanvas(w, h) {
  const canvasArea = document.getElementById("TFCanvaseArea");
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvasArea.appendChild(canvas);
  return canvas;
}