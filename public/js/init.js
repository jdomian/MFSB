let camera;
document.addEventListener("DOMContentLoaded", function(event) { 

    mfsb.init();
    mfsb.crossHairType();
    console.log('init loaded');
    camera = $('#camera-wrapper');

    // $('#app').click(function(){
    //     //$(this).addClass('menu');
    //     //$('.arc').toggleClass('in');
    // });


    $('[data-nav-to]').on('touchend', (e) => {
        let destination = e.target.dataset.navTo;

        console.log(destination);
        $('#main-info-text').text(destination);

        $('[data-nav]').removeClass('active');
        $('.arc').removeClass('in');
        $('[data-nav=' + destination + ']').addClass('active').children('.arc').addClass('in');
        $('.arc').removeClass('active');
        
    });

    // var video = document.querySelector("#videoElement");

    // if (navigator.mediaDevices.getUserMedia) {
    // navigator.mediaDevices.getUserMedia({ video: true })
    //     .then(function (stream) {
    //     video.srcObject = stream;
    //     })
    //     .catch(function (err0r) {
    //     console.log("Something went wrong!");
    //     });
    // }

    // $('.arc').click(function(e){
    //     console.log(e);
    // });


});
