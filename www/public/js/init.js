const screens = [
  {
    name: 'Ammo Counter',
    file: 'ammoCounter.html'
  },
  {
    name: 'Zoom Camera',
    file: 'zoomCamera1.html'
  },
  {
    name: 'Accelerometer',
    file: 'accelerometer.html'
  },
  {
    name: 'Doom',
    file: 'doom.html'
  },
  {
    name: 'Servo',
    file: 'servo.html'
  },
  {
    name: 'Socket Sample Events',
    file: '_socketEvents-sample.html'
  },
  // {
  //   name: 'AI Tracking',
  //   file: 'trackingCamera.html'
  // }
];

const defaultScreen = 'ammoCounter.html';
const path = window.location.pathname;
let currentScreenIndex = path.split('/');
var currentScreen = currentScreenIndex[currentScreenIndex.length - 1];
let nextScreen;
let nextScreenLocation;

const relativePath = (window.location.protocol + '//' + 
                   window.location.hostname);
          

function setNextScn() {
  for (let i = 0; i < screens.length; i++) {

    if (screens[i].file == currentScreen) {

      if (i == (screens.length - 1)) {
        nextScreen = screens[0].name;
        nextScreenLocation = screens[0].file;
      }
      else {
        nextScreen = screens[i+1].name;
        nextScreenLocation = screens[i+1].file;
      }

      
    }
  }
  var nextDiv = document.createElement("div");
  nextDiv.id = 'next-screen';
  nextDiv.innerHTML = '<a href="' + nextScreenLocation  + '" />' + nextScreen + ' > </a>';
  document.body.appendChild(nextDiv);
}


// if (currentScreen == defaultScreen) {
//     let refresh = localStorage.getItem('refresh');
//     if (refresh == 1) {
//       return;
//     }
// }

if (currentScreen ==! defaultScreen) {
  window.location.href = defaultScreen;
}
else {
  setNextScn();
}

var socket = io(); //load socket.io-client and connect to the host that serves the page
console.log('socket created');

socket.emit('init', true);

//Cycle screen event
socket.on("cycleScreen", (arg) => {
  if (arg == 0) {
    window.location.href = '/' + nextScreenLocation;
  }
});