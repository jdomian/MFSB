//Trigger event
function triggerBtn([arg, pin]) {
    console.log('Trigger Pressed: ' + arg, pin);
}

//Select event
function select(arg) {
    console.log('Select Pressed: ' + arg);
} 

//Mode event
function mode(arg) {
    console.log('Mode Pressed: ' + arg);
} 

//Physical button events 
socket.on("triggerBtn", ([arg, pin]) => {
    triggerBtn([arg, pin]);
});
  
socket.on("selectBtn", (arg) => {
    select(arg);
});
  
socket.on("modeBtn", (arg) => {
    mode(arg);
});