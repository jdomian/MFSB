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

//Screen cycling
function changeScreen() {
  window.location.href = 'zoomCamera1.html'
}

//Select
function select() {
      console.log('Ammo select');
      localStorage.setItem('ammoCountSetting', ammoCountSetting);
      $('#ammoScreen .mode-screen').removeClass('configure');
      reload();
      window.location.reload();
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
    console.log('Changing Mode/Selection');
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
  let press = arg[1];
  if (press == 0) {select();}
});

socket.on("modeBtn", (arg) => {
  console.log(arg);
  let press = arg[1];
  if (press == 0) {mode();}
});

$(document).ready(function(){
  $('.number.ammoCount').text(ammoCountSetting);

  if (!localStorage.getItem('ammoCountSetting')) {
    $('#ammoCount').html('<p style="font-size: 0.125em; text-align: center;">Use "Mode" to select ammo count.</p>');
    $('ul.modes > li:first-child').addClass('selected');
  }
});