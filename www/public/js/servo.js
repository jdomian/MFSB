let start = -90;
let selectPressed = false;
let modePressed = false;

//Trigger event
function triggerBtn([arg, state]) {
    console.log('Trigger Pressed: ' + arg, state);
}

//Select event
function select([arg, state]) {
    //console.log('Select Pressed: ' + arg, state);
    selectPressed = true;
    //socket.emit("servo-right", data);
    if (state == 1) {
        clearInterval(rotateIndicator);
    }
} 

//Mode event
function mode([arg, state]) {
    //console.log('Mode Pressed: ' + arg, state);
    modePressed = true;
    //socket.emit("servo-left", data);
    if (state == 1) {
        clearInterval(rotateIndicator);
    }
} 

//Physical button events 
socket.on("triggerBtn", ([arg, pin]) => {
    triggerBtn([arg, pin]);
});
  
socket.on("selectBtn", ([arg, pin]) => {
    select([arg, pin]);
});
  
socket.on("modeBtn", ([arg, pin]) => {
    mode([arg, pin]);
});

socket.on("servoControl", ([pulse, state, direction]) => {
    console.log(pulse, state, direction);

        UIRotate(pulse, state, direction);

    
});

let rotateIndicator;

function UIRotate(pulse, state, direction) {

    clearInterval(rotateIndicator);
    //console.log(pulse);
    const pulseZero = 1500; //1500 is the middle pulse width to center the servo.
    let pulseConversion = (pulseZero - pulse)/100 * 9.0; // Converts pulse to rotation degrees
    let deg = pulseConversion;
    if (state == 0) {
        rotateIndicator = setInterval(function(){
                $('.servo-line').css('transform', 'translate3d(0, -50%, 0) rotate(' + deg + 'deg)');
                $('#servo-degrees').html(deg + '&deg;');
            console.log(deg);
        
        }, 30);
    }
    console.log(modePressed);
    console.log(selectPressed);
    if (selectPressed == false && modePressed == false) {
        $('.servo-line').css('transform', 'translate3d(0, -50%, 0) rotate(0deg)');
        $('#servo-degrees').html('0&deg;');
    }

    

    
    
    $('.chev-arrow').removeClass('active');
    $('.chev-arrow.' + direction).addClass('active');
    setTimeout(function(){
        $('.chev-arrow.' + direction).removeClass('active');
    },100);
}

$(document).ready(function(){
    setTimeout(function(){
        $('#webcamPi').attr('src', relativePath + ':3000/stream.mjpg')
      },1000);
});