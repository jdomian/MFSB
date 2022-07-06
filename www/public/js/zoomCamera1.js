//settings
var ammoCountSetting = localStorage.getItem('ammoCountSetting');
var ammoCountCurrent = localStorage.getItem('ammoCountCurrent');

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
  localStorage.setItem('ammoCountCurrent', count);
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

//Select
function select() {
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
}

//Mode
function mode() {

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

//Trigger button events 
socket.on("triggerBtn", ([ammo, pin]) => {
  triggerBtn([ammo, pin]);
  debugTriggerAmmo = ammo;
  debugTiggerPin = pin;
});

socket.on("selectBtn", (arg) => {
  if (arg[1] == 0) { select(); }
});


socket.on("modeBtn", (arg) => {
  mode();
});

$(document).ready(function(){
  $('.number.ammoCount').text(ammoCountSetting);
  setTimeout(function(){
    $('#webcamPi').attr('src', relativePath + ':3000/stream.mjpg')
  },2000);
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
