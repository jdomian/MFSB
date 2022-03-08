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