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

var App = () => function() {
    console.log('app start');
    alert('hi');
}

//let worker = new Worker('myWorker.js', { type: 'module'});
const socket = {
    local: io()
    //server: io('ws://10.0.10.100:3000')
}
// const socketLocal = io();
// const socket = io('ws://10.0.10.100:3000');
const stream = document.getElementById('stream');
const trackingCanvas = document.getElementById('tracking-canvas');
const base64Canvas = document.getElementById('base64-canvas');
let tensorFlow;
//let socket = io();

let mfsb = {
    cameraZoomLevel: 1,
    init() {
        
    },
    zoomIn() {
        let zoom = this.cameraZoomLevel * 2;
        this.cameraZoomLevel = zoom;
        camera.css('transform', 'scale(' + zoom + ', ' + zoom + ')');
    },
    zoomOut() {
        let zoom = this.cameraZoomLevel / 2;
        if (zoom < 1) {
            zoom = 1;
        }
        this.cameraZoomLevel = zoom;
        camera.css('transform', 'scale(' + zoom + ', ' + zoom + ')');
    },
    crossHairType(type) {
        let crosshairTypeSaved = localStorage.getItem('crosshair-type');

        if (crosshairTypeSaved === null || type === undefined) {
            localStorage.setItem('crosshair-type', 'standard');
        }
        else {
            localStorage.setItem('crosshair-type', type);
        }
        crosshairTypeSaved = localStorage.getItem('crosshair-type');

        
        $('.crosshair').hide();
        $('#crosshair > #' + crosshairTypeSaved).show();
    },
    ml5AIDetect() {
        //const video = document.getElementById('stream');
        // const canvas = document.getElementById('detection-overlay');
        // let ctx = canvas.getContext('2d');
        let detector;
        let objectDetector = ml5.objectDetector('MobileNet', {}, detectObjects);
        
        // const loop = classifier => {
        //     classifier.classify().then(results => {
        //         console.log(results);
        //         loop(classifier); // Call again to create a loop
        //     });
        // };
        
        // const looper = detector => {
        //     objectDetector.detect(video, (err, results) => {
        //         console.log(results);
        //         draw();
        //         looper(detector); // Call again to create a loop
        //     });
        // };
        
        // function startDetecting() {
        //     console.log('model ready');
        //     detect();
        // }
        
        // function detect() {
        //     objectDetector.detect(video, (err, results) => {
        //         console.log(results); // Will output bounding boxes of detected objects
        //     });
        // }
        

        function drawCSS(objects) {

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
          

        function detectObjects() {
            let debug = $('#debug-ai');
            detector = setInterval(() => {
                objectDetector.detect(stream, (err, results) => {
                    let objects = results;
                    console.log(results);
                    if (results !== undefined) {
                        debug.text(results[0].label, results[0].height, results[0].width);
                    }
                    
                    //drawCSS(objects);
                });
            },2000)
        }

    },
    accelerometerStart() {
        //let socket = io();
        let previousDataY = 0;
        socket.local.emit('startAccelerometer', true);
        //socket.emit('startAccelerometer', true);
        $('#debug-accel').text('Starting Accelerometer...');
        socket.local.on('accelerometer', (arg) => {
            let data = arg.split(',');
            let dataY = Math.round(data[0]*2)/2;
            let dataX = Math.round(data[1]*2)/2;
            let dataZ = data[2];

            let dataYPosition = (dataY * -10);
            let dataXPosition = dataX * -9;


            //console.log(dataY / dataX);
            //console.log((dataZ * 10) - (dataY * 10));
            //$('#debug-accel').text('Y: ' + dataY + ', X: ' + dataX + ', Z:' + dataZ);
            $('#accel-Y-line').css('transform', 'translate(0,' + dataYPosition + 'vh)');
            $('#accel-X-line').css('transform', 'translate(' + dataXPosition + 'vw, 0vh)');
            $('#accel-X-line').css('transform', 'rotate(' + dataXPosition + 'deg)');

            if ( (dataYPosition > 0 && ((dataZ * 10) - (dataY * 10)) < 100) || (dataYPosition < 0 && ((dataZ * 10) - (dataY * 10)) > 100)) {
                console.log('Fired!');
                $('#debug-accel').text('Fired!');
            }

            previousDataY = dataYPosition;

        });
    },
    accelerometerStop() {
        console.log('Stopping accelerometer reading');
        $('#debug-accel').text('Accelerometer Stopped.');
        socket.local.emit('stopAccelerometer', true);
    },
    accelerometerPin() {
        let accel = $('.accel-line').detach();
        $('#pinned > #accelerometer').html(accel);
    },
    // tensorFlowStart() {
    //     //Standard WebSocket streaming
    //     const socket = new WebSocket('ws://10.0.10.100:1337');
    //     const stream = document.getElementById('image-streamer');
    //     const FPS = 1;
        
        

    //     const getFrame = () => {
    //         //const canvas = document.createElement('canvas');
    //         const canvas = document.getElementById('tfcanvas');
    //         const ctx = canvas.getContext("2d");
    //         ctx.drawImage(stream, 0, 0);
    //         const data = canvas.toDataURL('data:image/jpeg;charset=utf-8;base64,', 0.1);
    //         console.log(data);
    //         return data;
    //     }
        
    //     socket.onopen = () => {
    //         tensorFlow = setInterval(() => {
    //             socket.binaryType = "arraybuffer";
    //             socket.send(getFrame());
    //         }, 1000 / FPS);
    //     }

    //     socket.onmessage = function (message) {
    //         let tfdata = JSON.parse(message.data);
    //         console.log(tfdata[0].class);
    //         $('#debug-ai').text(tfdata[0].class);
    //     };

    //     socket.onerror = function (error) {
    //         console.log('WebSocket error: ' + error);
    //     };

    // },
    tensorFlowStart() {
        //Socket.io Streaming
        let self = this;
        const FPS = 1;

       $('#debug-ai').text('AI Started...');
        

        const getFrame = () => {
           return self.convertToBase64();
        }
        
        
        tensorFlow = setInterval(() => {
            //socket.binaryType = "arraybuffer";
            socket.server.emit('stream', getFrame());
        }, 1000 / FPS);
        

        // socket.onmessage = function (message) {
        //     let tfdata = JSON.parse(message.data);
        //     console.log(tfdata[0].class);
        //     $('#debug-ai').text(tfdata[0].class);
        // };

        socket.server.on('AIIdentified', (data) => {
            console.log(data);
            let left = data[0].bbox[0];
            let top = data[0].bbox[1];
            let width = data[0].bbox[2];
            let height = data[0].bbox[3];
            let objClass = data[0].class;
            let score = data[0].score;

            $('#debug-ai').text(objClass + ' --- ' + Math.round(100 * score) + '%');
            $('#TFTarget').css({
                'top': top,
                'left': left,
                'height': height,
                'width': width
            });
        });

        // socket.onerror = function (error) {
        //     console.log('WebSocket error: ' + error);
        // };

    },
    tensorFlowStop() {
        clearInterval(tensorFlow);
        $('#debug-ai').text('AI Stopped');
        console.log('test');
    },
    trackAndRenderLocal() {
        const self = this;
        
        const xmin = 200;
        const ymin = 200;
        const width = 200;
        const height = 200;

        const frame = document.getElementById('stream');

        self.renderBox([xmin, ymin, width, height]);

        const tracker = objectTracker.init(frame, [
            xmin,
            ymin,
            width,
            height
        ]);

        setInterval(async () => {

            let frame2 = document.getElementById('stream');
            let box2 = await tracker.next(frame2);
            console.log(box2);
            mfsb.renderBox(box2);
        },100);

        // console.log(tracker);

        //     async tracker => {
        //       requestAnimationFrame(async () => {
        //         const box = await tracker.next(frame);
        //         renderBox(box);
        //         trackAndRender(tracker);
        //       });
        //     },
        //     console.log('Found...')

    },
    trackAndRenderLocalAjax() {
        const self = this;
        
        const xmin = 200;
        const ymin = 200;
        const width = 200;
        const height = 200;

        const frame = document.getElementById('stream');

        self.renderBox([xmin, ymin, width, height]);

        const tracker = objectTracker.init(frame, [
            xmin,
            ymin,
            width,
            height
        ]);

        setInterval(async () => {

            let frame2 = document.getElementById('stream');
            let box2 = await tracker.next(frame2);
            console.log(box2);
            mfsb.renderBox(box2);
        },100);

        // console.log(tracker);

        //     async tracker => {
        //       requestAnimationFrame(async () => {
        //         const box = await tracker.next(frame);
        //         renderBox(box);
        //         trackAndRender(tracker);
        //       });
        //     },
        //     console.log('Found...')

    },
    trackAndRenderLocalWorker() {
        // const self = this;
        // base64Canvas.width = stream.width;
        // base64Canvas.height = stream.height;

        // const ctx = base64Canvas.getContext('2d');

        // ctx.drawImage(stream, 0, 0);


        //socket.local.emit('track', base64Canvas);
        

        const xmin = 200;
        const ymin = 200;
        const width = 200;
        const height = 200;

        const frame = document.getElementById('stream');
        //mfsb.convertImageToCanvas();

        

        const tracker = objectTracker.init(frame, [
            xmin,
            ymin,
            width,
            height
        ]);
        
        socket.local.emit('track', tracker);

        // setInterval(async () => {

        //     let frame2 = document.getElementById('stream');
        //     let box2 = await tracker.next(frame2);
        //     console.log(box2);
        //     mfsb.renderBox(box2);
        // },100);

        //socket.local.emit('track', base64Canvas);

        // console.log(tracker);

        // let stream = document.getElementById('stream');
        // let img = mfsb.convertToBase64();
        // // setInterval(() => {
        //     //worker.postMessage(img);
        // // },100)
        // worker.postMessage(img);
        // worker.addEventListener('message', function(e) {
        //     console.log(e);

        //   }, false);
    },
    trackAndRender() {
        const self = this;
        const FPS = 2;

        //center
        const xmin = 180;
        const ymin = 180;
        const width = 120;
        const height = 120;

        self.renderBox([xmin, ymin, width, height]);

        setInterval(async () => {
            let img = await self.convertToBase64();

            let today = new Date();
            let now = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            console.log('[' + now + ']' + 'Image converted... sending.' );
            await socket.server.emit('track', img);
        }, 0);

        //socket.emit('track', self.convertToBase64());

        socket.server.on('objectTracker', (tracker) => {
            this.renderBox(tracker);
        });
    },
    lockTarget() {
        let self = this;
        const xmin = 180;
        const ymin = 180;
        const width = 120;
        const height = 120;

        socket.server.emit('lock-target', [xmin, ymin, width, height]);
        socket.server.emit('lock-target-profile', self.convertToBase64());

        self.renderBox([xmin, ymin, width, height]);
    },
    renderBox(box) {
        trackingCanvas.width = 480;
        trackingCanvas.height = 480;
        let ctx = trackingCanvas.getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(box[0], box[1], box[2], box[3]);

    },
    convertImageToCanvas() {
        base64Canvas.width = stream.width;
        base64Canvas.height = stream.height;

        const ctx = base64Canvas.getContext('2d');

        ctx.drawImage(stream, 0, 0);

        return ctx;
    },
    convertToBase64() {
        
        base64Canvas.width = stream.width;
        base64Canvas.height = stream.height;

        const ctx = base64Canvas.getContext('2d');

        ctx.drawImage(stream, 0, 0);

        const data = base64Canvas.toDataURL('data:image/jpg;charset=utf-8;base64,', 0.1);

        return data;
    },
    sudoReboot() {

        socket.local.emit('sudoReboot', true);
    },
    sudoShutdown() {
        socket.local.emit('sudoShutdown', true);
    },

}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JpcHRzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCBjYW1lcmE7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkgeyBcblxuICAgIG1mc2IuaW5pdCgpO1xuICAgIG1mc2IuY3Jvc3NIYWlyVHlwZSgpO1xuICAgIGNvbnNvbGUubG9nKCdpbml0IGxvYWRlZCcpO1xuICAgIGNhbWVyYSA9ICQoJyNjYW1lcmEtd3JhcHBlcicpO1xuXG4gICAgLy8gJCgnI2FwcCcpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgIC8vJCh0aGlzKS5hZGRDbGFzcygnbWVudScpO1xuICAgIC8vICAgICAvLyQoJy5hcmMnKS50b2dnbGVDbGFzcygnaW4nKTtcbiAgICAvLyB9KTtcblxuXG4gICAgJCgnW2RhdGEtbmF2LXRvXScpLm9uKCd0b3VjaGVuZCcsIChlKSA9PiB7XG4gICAgICAgIGxldCBkZXN0aW5hdGlvbiA9IGUudGFyZ2V0LmRhdGFzZXQubmF2VG87XG5cbiAgICAgICAgY29uc29sZS5sb2coZGVzdGluYXRpb24pO1xuICAgICAgICAkKCcjbWFpbi1pbmZvLXRleHQnKS50ZXh0KGRlc3RpbmF0aW9uKTtcblxuICAgICAgICAkKCdbZGF0YS1uYXZdJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAkKCcuYXJjJykucmVtb3ZlQ2xhc3MoJ2luJyk7XG4gICAgICAgICQoJ1tkYXRhLW5hdj0nICsgZGVzdGluYXRpb24gKyAnXScpLmFkZENsYXNzKCdhY3RpdmUnKS5jaGlsZHJlbignLmFyYycpLmFkZENsYXNzKCdpbicpO1xuICAgICAgICAkKCcuYXJjJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBcbiAgICB9KTtcblxuICAgIC8vIHZhciB2aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdmlkZW9FbGVtZW50XCIpO1xuXG4gICAgLy8gaWYgKG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKSB7XG4gICAgLy8gbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoeyB2aWRlbzogdHJ1ZSB9KVxuICAgIC8vICAgICAudGhlbihmdW5jdGlvbiAoc3RyZWFtKSB7XG4gICAgLy8gICAgIHZpZGVvLnNyY09iamVjdCA9IHN0cmVhbTtcbiAgICAvLyAgICAgfSlcbiAgICAvLyAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIwcikge1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhcIlNvbWV0aGluZyB3ZW50IHdyb25nIVwiKTtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gfVxuXG4gICAgLy8gJCgnLmFyYycpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAvLyB9KTtcblxuXG59KTtcblxudmFyIEFwcCA9ICgpID0+IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCdhcHAgc3RhcnQnKTtcbiAgICBhbGVydCgnaGknKTtcbn1cblxuLy9sZXQgd29ya2VyID0gbmV3IFdvcmtlcignbXlXb3JrZXIuanMnLCB7IHR5cGU6ICdtb2R1bGUnfSk7XG5jb25zdCBzb2NrZXQgPSB7XG4gICAgbG9jYWw6IGlvKClcbiAgICAvL3NlcnZlcjogaW8oJ3dzOi8vMTAuMC4xMC4xMDA6MzAwMCcpXG59XG4vLyBjb25zdCBzb2NrZXRMb2NhbCA9IGlvKCk7XG4vLyBjb25zdCBzb2NrZXQgPSBpbygnd3M6Ly8xMC4wLjEwLjEwMDozMDAwJyk7XG5jb25zdCBzdHJlYW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RyZWFtJyk7XG5jb25zdCB0cmFja2luZ0NhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmFja2luZy1jYW52YXMnKTtcbmNvbnN0IGJhc2U2NENhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYXNlNjQtY2FudmFzJyk7XG5sZXQgdGVuc29yRmxvdztcbi8vbGV0IHNvY2tldCA9IGlvKCk7XG5cbmxldCBtZnNiID0ge1xuICAgIGNhbWVyYVpvb21MZXZlbDogMSxcbiAgICBpbml0KCkge1xuICAgICAgICBcbiAgICB9LFxuICAgIHpvb21JbigpIHtcbiAgICAgICAgbGV0IHpvb20gPSB0aGlzLmNhbWVyYVpvb21MZXZlbCAqIDI7XG4gICAgICAgIHRoaXMuY2FtZXJhWm9vbUxldmVsID0gem9vbTtcbiAgICAgICAgY2FtZXJhLmNzcygndHJhbnNmb3JtJywgJ3NjYWxlKCcgKyB6b29tICsgJywgJyArIHpvb20gKyAnKScpO1xuICAgIH0sXG4gICAgem9vbU91dCgpIHtcbiAgICAgICAgbGV0IHpvb20gPSB0aGlzLmNhbWVyYVpvb21MZXZlbCAvIDI7XG4gICAgICAgIGlmICh6b29tIDwgMSkge1xuICAgICAgICAgICAgem9vbSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYW1lcmFab29tTGV2ZWwgPSB6b29tO1xuICAgICAgICBjYW1lcmEuY3NzKCd0cmFuc2Zvcm0nLCAnc2NhbGUoJyArIHpvb20gKyAnLCAnICsgem9vbSArICcpJyk7XG4gICAgfSxcbiAgICBjcm9zc0hhaXJUeXBlKHR5cGUpIHtcbiAgICAgICAgbGV0IGNyb3NzaGFpclR5cGVTYXZlZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjcm9zc2hhaXItdHlwZScpO1xuXG4gICAgICAgIGlmIChjcm9zc2hhaXJUeXBlU2F2ZWQgPT09IG51bGwgfHwgdHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY3Jvc3NoYWlyLXR5cGUnLCAnc3RhbmRhcmQnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjcm9zc2hhaXItdHlwZScsIHR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIGNyb3NzaGFpclR5cGVTYXZlZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjcm9zc2hhaXItdHlwZScpO1xuXG4gICAgICAgIFxuICAgICAgICAkKCcuY3Jvc3NoYWlyJykuaGlkZSgpO1xuICAgICAgICAkKCcjY3Jvc3NoYWlyID4gIycgKyBjcm9zc2hhaXJUeXBlU2F2ZWQpLnNob3coKTtcbiAgICB9LFxuICAgIG1sNUFJRGV0ZWN0KCkge1xuICAgICAgICAvL2NvbnN0IHZpZGVvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0cmVhbScpO1xuICAgICAgICAvLyBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGV0ZWN0aW9uLW92ZXJsYXknKTtcbiAgICAgICAgLy8gbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBsZXQgZGV0ZWN0b3I7XG4gICAgICAgIGxldCBvYmplY3REZXRlY3RvciA9IG1sNS5vYmplY3REZXRlY3RvcignTW9iaWxlTmV0Jywge30sIGRldGVjdE9iamVjdHMpO1xuICAgICAgICBcbiAgICAgICAgLy8gY29uc3QgbG9vcCA9IGNsYXNzaWZpZXIgPT4ge1xuICAgICAgICAvLyAgICAgY2xhc3NpZmllci5jbGFzc2lmeSgpLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0cyk7XG4gICAgICAgIC8vICAgICAgICAgbG9vcChjbGFzc2lmaWVyKTsgLy8gQ2FsbCBhZ2FpbiB0byBjcmVhdGUgYSBsb29wXG4gICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy8gfTtcbiAgICAgICAgXG4gICAgICAgIC8vIGNvbnN0IGxvb3BlciA9IGRldGVjdG9yID0+IHtcbiAgICAgICAgLy8gICAgIG9iamVjdERldGVjdG9yLmRldGVjdCh2aWRlbywgKGVyciwgcmVzdWx0cykgPT4ge1xuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdHMpO1xuICAgICAgICAvLyAgICAgICAgIGRyYXcoKTtcbiAgICAgICAgLy8gICAgICAgICBsb29wZXIoZGV0ZWN0b3IpOyAvLyBDYWxsIGFnYWluIHRvIGNyZWF0ZSBhIGxvb3BcbiAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAvLyB9O1xuICAgICAgICBcbiAgICAgICAgLy8gZnVuY3Rpb24gc3RhcnREZXRlY3RpbmcoKSB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnbW9kZWwgcmVhZHknKTtcbiAgICAgICAgLy8gICAgIGRldGVjdCgpO1xuICAgICAgICAvLyB9XG4gICAgICAgIFxuICAgICAgICAvLyBmdW5jdGlvbiBkZXRlY3QoKSB7XG4gICAgICAgIC8vICAgICBvYmplY3REZXRlY3Rvci5kZXRlY3QodmlkZW8sIChlcnIsIHJlc3VsdHMpID0+IHtcbiAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHRzKTsgLy8gV2lsbCBvdXRwdXQgYm91bmRpbmcgYm94ZXMgb2YgZGV0ZWN0ZWQgb2JqZWN0c1xuICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgIC8vIH1cbiAgICAgICAgXG5cbiAgICAgICAgZnVuY3Rpb24gZHJhd0NTUyhvYmplY3RzKSB7XG5cbiAgICAgICAgICAgIGxldCBzdHlsZXMgPSAnJztcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiVEZUYXJnZXRMYWJlbFwiKTtcbiAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2JqZWN0cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgIFxuICAgICAgICAgICAgICBsYWJlbC5pbm5lclRleHQgPSBvYmplY3RzW2ldLmxhYmVsO1xuICAgICAgICAgICAgICBsYWJlbC5jbGFzc0xpc3QucmVtb3ZlKFwibG9jYXRpbmdcIik7XG4gICAgICAgICAgXG4gICAgICAgICAgICAgIHN0eWxlcyA9IHtcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiBvYmplY3RzW2ldLndpZHRoICsgJ3B4JyxcbiAgICAgICAgICAgICAgICAnaGVpZ2h0Jzogb2JqZWN0c1tpXS5oZWlnaHQgKyAncHgnLFxuICAgICAgICAgICAgICAgICd0b3AnOiBvYmplY3RzW2ldLnkgKyAxNiArICdweCcsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBvYmplY3RzW2ldLnggKyA0ICsgJ3B4J1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIG9iaiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiVEZUYXJnZXRcIik7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKG9iai5zdHlsZSwgc3R5bGVzKTsgXG4gICAgICAgICAgfVxuICAgICAgICAgIFxuXG4gICAgICAgIGZ1bmN0aW9uIGRldGVjdE9iamVjdHMoKSB7XG4gICAgICAgICAgICBsZXQgZGVidWcgPSAkKCcjZGVidWctYWknKTtcbiAgICAgICAgICAgIGRldGVjdG9yID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgIG9iamVjdERldGVjdG9yLmRldGVjdChzdHJlYW0sIChlcnIsIHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9iamVjdHMgPSByZXN1bHRzO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHRzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVidWcudGV4dChyZXN1bHRzWzBdLmxhYmVsLCByZXN1bHRzWzBdLmhlaWdodCwgcmVzdWx0c1swXS53aWR0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vZHJhd0NTUyhvYmplY3RzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sMjAwMClcbiAgICAgICAgfVxuXG4gICAgfSxcbiAgICBhY2NlbGVyb21ldGVyU3RhcnQoKSB7XG4gICAgICAgIC8vbGV0IHNvY2tldCA9IGlvKCk7XG4gICAgICAgIGxldCBwcmV2aW91c0RhdGFZID0gMDtcbiAgICAgICAgc29ja2V0LmxvY2FsLmVtaXQoJ3N0YXJ0QWNjZWxlcm9tZXRlcicsIHRydWUpO1xuICAgICAgICAvL3NvY2tldC5lbWl0KCdzdGFydEFjY2VsZXJvbWV0ZXInLCB0cnVlKTtcbiAgICAgICAgJCgnI2RlYnVnLWFjY2VsJykudGV4dCgnU3RhcnRpbmcgQWNjZWxlcm9tZXRlci4uLicpO1xuICAgICAgICBzb2NrZXQubG9jYWwub24oJ2FjY2VsZXJvbWV0ZXInLCAoYXJnKSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IGFyZy5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgbGV0IGRhdGFZID0gTWF0aC5yb3VuZChkYXRhWzBdKjIpLzI7XG4gICAgICAgICAgICBsZXQgZGF0YVggPSBNYXRoLnJvdW5kKGRhdGFbMV0qMikvMjtcbiAgICAgICAgICAgIGxldCBkYXRhWiA9IGRhdGFbMl07XG5cbiAgICAgICAgICAgIGxldCBkYXRhWVBvc2l0aW9uID0gKGRhdGFZICogLTEwKTtcbiAgICAgICAgICAgIGxldCBkYXRhWFBvc2l0aW9uID0gZGF0YVggKiAtOTtcblxuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGFZIC8gZGF0YVgpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygoZGF0YVogKiAxMCkgLSAoZGF0YVkgKiAxMCkpO1xuICAgICAgICAgICAgLy8kKCcjZGVidWctYWNjZWwnKS50ZXh0KCdZOiAnICsgZGF0YVkgKyAnLCBYOiAnICsgZGF0YVggKyAnLCBaOicgKyBkYXRhWik7XG4gICAgICAgICAgICAkKCcjYWNjZWwtWS1saW5lJykuY3NzKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJyArIGRhdGFZUG9zaXRpb24gKyAndmgpJyk7XG4gICAgICAgICAgICAkKCcjYWNjZWwtWC1saW5lJykuY3NzKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBkYXRhWFBvc2l0aW9uICsgJ3Z3LCAwdmgpJyk7XG4gICAgICAgICAgICAkKCcjYWNjZWwtWC1saW5lJykuY3NzKCd0cmFuc2Zvcm0nLCAncm90YXRlKCcgKyBkYXRhWFBvc2l0aW9uICsgJ2RlZyknKTtcblxuICAgICAgICAgICAgaWYgKCAoZGF0YVlQb3NpdGlvbiA+IDAgJiYgKChkYXRhWiAqIDEwKSAtIChkYXRhWSAqIDEwKSkgPCAxMDApIHx8IChkYXRhWVBvc2l0aW9uIDwgMCAmJiAoKGRhdGFaICogMTApIC0gKGRhdGFZICogMTApKSA+IDEwMCkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRmlyZWQhJyk7XG4gICAgICAgICAgICAgICAgJCgnI2RlYnVnLWFjY2VsJykudGV4dCgnRmlyZWQhJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHByZXZpb3VzRGF0YVkgPSBkYXRhWVBvc2l0aW9uO1xuXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgYWNjZWxlcm9tZXRlclN0b3AoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTdG9wcGluZyBhY2NlbGVyb21ldGVyIHJlYWRpbmcnKTtcbiAgICAgICAgJCgnI2RlYnVnLWFjY2VsJykudGV4dCgnQWNjZWxlcm9tZXRlciBTdG9wcGVkLicpO1xuICAgICAgICBzb2NrZXQubG9jYWwuZW1pdCgnc3RvcEFjY2VsZXJvbWV0ZXInLCB0cnVlKTtcbiAgICB9LFxuICAgIGFjY2VsZXJvbWV0ZXJQaW4oKSB7XG4gICAgICAgIGxldCBhY2NlbCA9ICQoJy5hY2NlbC1saW5lJykuZGV0YWNoKCk7XG4gICAgICAgICQoJyNwaW5uZWQgPiAjYWNjZWxlcm9tZXRlcicpLmh0bWwoYWNjZWwpO1xuICAgIH0sXG4gICAgLy8gdGVuc29yRmxvd1N0YXJ0KCkge1xuICAgIC8vICAgICAvL1N0YW5kYXJkIFdlYlNvY2tldCBzdHJlYW1pbmdcbiAgICAvLyAgICAgY29uc3Qgc29ja2V0ID0gbmV3IFdlYlNvY2tldCgnd3M6Ly8xMC4wLjEwLjEwMDoxMzM3Jyk7XG4gICAgLy8gICAgIGNvbnN0IHN0cmVhbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWFnZS1zdHJlYW1lcicpO1xuICAgIC8vICAgICBjb25zdCBGUFMgPSAxO1xuICAgICAgICBcbiAgICAgICAgXG5cbiAgICAvLyAgICAgY29uc3QgZ2V0RnJhbWUgPSAoKSA9PiB7XG4gICAgLy8gICAgICAgICAvL2NvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIC8vICAgICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RmY2FudmFzJyk7XG4gICAgLy8gICAgICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIC8vICAgICAgICAgY3R4LmRyYXdJbWFnZShzdHJlYW0sIDAsIDApO1xuICAgIC8vICAgICAgICAgY29uc3QgZGF0YSA9IGNhbnZhcy50b0RhdGFVUkwoJ2RhdGE6aW1hZ2UvanBlZztjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnLCAwLjEpO1xuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgLy8gICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAvLyAgICAgfVxuICAgICAgICBcbiAgICAvLyAgICAgc29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAvLyAgICAgICAgIHRlbnNvckZsb3cgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgc29ja2V0LmJpbmFyeVR5cGUgPSBcImFycmF5YnVmZmVyXCI7XG4gICAgLy8gICAgICAgICAgICAgc29ja2V0LnNlbmQoZ2V0RnJhbWUoKSk7XG4gICAgLy8gICAgICAgICB9LCAxMDAwIC8gRlBTKTtcbiAgICAvLyAgICAgfVxuXG4gICAgLy8gICAgIHNvY2tldC5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIC8vICAgICAgICAgbGV0IHRmZGF0YSA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKHRmZGF0YVswXS5jbGFzcyk7XG4gICAgLy8gICAgICAgICAkKCcjZGVidWctYWknKS50ZXh0KHRmZGF0YVswXS5jbGFzcyk7XG4gICAgLy8gICAgIH07XG5cbiAgICAvLyAgICAgc29ja2V0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCdXZWJTb2NrZXQgZXJyb3I6ICcgKyBlcnJvcik7XG4gICAgLy8gICAgIH07XG5cbiAgICAvLyB9LFxuICAgIHRlbnNvckZsb3dTdGFydCgpIHtcbiAgICAgICAgLy9Tb2NrZXQuaW8gU3RyZWFtaW5nXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgRlBTID0gMTtcblxuICAgICAgICQoJyNkZWJ1Zy1haScpLnRleHQoJ0FJIFN0YXJ0ZWQuLi4nKTtcbiAgICAgICAgXG5cbiAgICAgICAgY29uc3QgZ2V0RnJhbWUgPSAoKSA9PiB7XG4gICAgICAgICAgIHJldHVybiBzZWxmLmNvbnZlcnRUb0Jhc2U2NCgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgdGVuc29yRmxvdyA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIC8vc29ja2V0LmJpbmFyeVR5cGUgPSBcImFycmF5YnVmZmVyXCI7XG4gICAgICAgICAgICBzb2NrZXQuc2VydmVyLmVtaXQoJ3N0cmVhbScsIGdldEZyYW1lKCkpO1xuICAgICAgICB9LCAxMDAwIC8gRlBTKTtcbiAgICAgICAgXG5cbiAgICAgICAgLy8gc29ja2V0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgIC8vICAgICBsZXQgdGZkYXRhID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2codGZkYXRhWzBdLmNsYXNzKTtcbiAgICAgICAgLy8gICAgICQoJyNkZWJ1Zy1haScpLnRleHQodGZkYXRhWzBdLmNsYXNzKTtcbiAgICAgICAgLy8gfTtcblxuICAgICAgICBzb2NrZXQuc2VydmVyLm9uKCdBSUlkZW50aWZpZWQnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICBsZXQgbGVmdCA9IGRhdGFbMF0uYmJveFswXTtcbiAgICAgICAgICAgIGxldCB0b3AgPSBkYXRhWzBdLmJib3hbMV07XG4gICAgICAgICAgICBsZXQgd2lkdGggPSBkYXRhWzBdLmJib3hbMl07XG4gICAgICAgICAgICBsZXQgaGVpZ2h0ID0gZGF0YVswXS5iYm94WzNdO1xuICAgICAgICAgICAgbGV0IG9iakNsYXNzID0gZGF0YVswXS5jbGFzcztcbiAgICAgICAgICAgIGxldCBzY29yZSA9IGRhdGFbMF0uc2NvcmU7XG5cbiAgICAgICAgICAgICQoJyNkZWJ1Zy1haScpLnRleHQob2JqQ2xhc3MgKyAnIC0tLSAnICsgTWF0aC5yb3VuZCgxMDAgKiBzY29yZSkgKyAnJScpO1xuICAgICAgICAgICAgJCgnI1RGVGFyZ2V0JykuY3NzKHtcbiAgICAgICAgICAgICAgICAndG9wJzogdG9wLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogbGVmdCxcbiAgICAgICAgICAgICAgICAnaGVpZ2h0JzogaGVpZ2h0LFxuICAgICAgICAgICAgICAgICd3aWR0aCc6IHdpZHRoXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc29ja2V0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdXZWJTb2NrZXQgZXJyb3I6ICcgKyBlcnJvcik7XG4gICAgICAgIC8vIH07XG5cbiAgICB9LFxuICAgIHRlbnNvckZsb3dTdG9wKCkge1xuICAgICAgICBjbGVhckludGVydmFsKHRlbnNvckZsb3cpO1xuICAgICAgICAkKCcjZGVidWctYWknKS50ZXh0KCdBSSBTdG9wcGVkJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0ZXN0Jyk7XG4gICAgfSxcbiAgICB0cmFja0FuZFJlbmRlckxvY2FsKCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHhtaW4gPSAyMDA7XG4gICAgICAgIGNvbnN0IHltaW4gPSAyMDA7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gMjAwO1xuICAgICAgICBjb25zdCBoZWlnaHQgPSAyMDA7XG5cbiAgICAgICAgY29uc3QgZnJhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RyZWFtJyk7XG5cbiAgICAgICAgc2VsZi5yZW5kZXJCb3goW3htaW4sIHltaW4sIHdpZHRoLCBoZWlnaHRdKTtcblxuICAgICAgICBjb25zdCB0cmFja2VyID0gb2JqZWN0VHJhY2tlci5pbml0KGZyYW1lLCBbXG4gICAgICAgICAgICB4bWluLFxuICAgICAgICAgICAgeW1pbixcbiAgICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0XG4gICAgICAgIF0pO1xuXG4gICAgICAgIHNldEludGVydmFsKGFzeW5jICgpID0+IHtcblxuICAgICAgICAgICAgbGV0IGZyYW1lMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdHJlYW0nKTtcbiAgICAgICAgICAgIGxldCBib3gyID0gYXdhaXQgdHJhY2tlci5uZXh0KGZyYW1lMik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhib3gyKTtcbiAgICAgICAgICAgIG1mc2IucmVuZGVyQm94KGJveDIpO1xuICAgICAgICB9LDEwMCk7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2codHJhY2tlcik7XG5cbiAgICAgICAgLy8gICAgIGFzeW5jIHRyYWNrZXIgPT4ge1xuICAgICAgICAvLyAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyAgICAgICAgIGNvbnN0IGJveCA9IGF3YWl0IHRyYWNrZXIubmV4dChmcmFtZSk7XG4gICAgICAgIC8vICAgICAgICAgcmVuZGVyQm94KGJveCk7XG4gICAgICAgIC8vICAgICAgICAgdHJhY2tBbmRSZW5kZXIodHJhY2tlcik7XG4gICAgICAgIC8vICAgICAgIH0pO1xuICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdGb3VuZC4uLicpXG5cbiAgICB9LFxuICAgIHRyYWNrQW5kUmVuZGVyTG9jYWxBamF4KCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHhtaW4gPSAyMDA7XG4gICAgICAgIGNvbnN0IHltaW4gPSAyMDA7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gMjAwO1xuICAgICAgICBjb25zdCBoZWlnaHQgPSAyMDA7XG5cbiAgICAgICAgY29uc3QgZnJhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RyZWFtJyk7XG5cbiAgICAgICAgc2VsZi5yZW5kZXJCb3goW3htaW4sIHltaW4sIHdpZHRoLCBoZWlnaHRdKTtcblxuICAgICAgICBjb25zdCB0cmFja2VyID0gb2JqZWN0VHJhY2tlci5pbml0KGZyYW1lLCBbXG4gICAgICAgICAgICB4bWluLFxuICAgICAgICAgICAgeW1pbixcbiAgICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0XG4gICAgICAgIF0pO1xuXG4gICAgICAgIHNldEludGVydmFsKGFzeW5jICgpID0+IHtcblxuICAgICAgICAgICAgbGV0IGZyYW1lMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdHJlYW0nKTtcbiAgICAgICAgICAgIGxldCBib3gyID0gYXdhaXQgdHJhY2tlci5uZXh0KGZyYW1lMik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhib3gyKTtcbiAgICAgICAgICAgIG1mc2IucmVuZGVyQm94KGJveDIpO1xuICAgICAgICB9LDEwMCk7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2codHJhY2tlcik7XG5cbiAgICAgICAgLy8gICAgIGFzeW5jIHRyYWNrZXIgPT4ge1xuICAgICAgICAvLyAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyAgICAgICAgIGNvbnN0IGJveCA9IGF3YWl0IHRyYWNrZXIubmV4dChmcmFtZSk7XG4gICAgICAgIC8vICAgICAgICAgcmVuZGVyQm94KGJveCk7XG4gICAgICAgIC8vICAgICAgICAgdHJhY2tBbmRSZW5kZXIodHJhY2tlcik7XG4gICAgICAgIC8vICAgICAgIH0pO1xuICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdGb3VuZC4uLicpXG5cbiAgICB9LFxuICAgIHRyYWNrQW5kUmVuZGVyTG9jYWxXb3JrZXIoKSB7XG4gICAgICAgIC8vIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyBiYXNlNjRDYW52YXMud2lkdGggPSBzdHJlYW0ud2lkdGg7XG4gICAgICAgIC8vIGJhc2U2NENhbnZhcy5oZWlnaHQgPSBzdHJlYW0uaGVpZ2h0O1xuXG4gICAgICAgIC8vIGNvbnN0IGN0eCA9IGJhc2U2NENhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgIC8vIGN0eC5kcmF3SW1hZ2Uoc3RyZWFtLCAwLCAwKTtcblxuXG4gICAgICAgIC8vc29ja2V0LmxvY2FsLmVtaXQoJ3RyYWNrJywgYmFzZTY0Q2FudmFzKTtcbiAgICAgICAgXG5cbiAgICAgICAgY29uc3QgeG1pbiA9IDIwMDtcbiAgICAgICAgY29uc3QgeW1pbiA9IDIwMDtcbiAgICAgICAgY29uc3Qgd2lkdGggPSAyMDA7XG4gICAgICAgIGNvbnN0IGhlaWdodCA9IDIwMDtcblxuICAgICAgICBjb25zdCBmcmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdHJlYW0nKTtcbiAgICAgICAgLy9tZnNiLmNvbnZlcnRJbWFnZVRvQ2FudmFzKCk7XG5cbiAgICAgICAgXG5cbiAgICAgICAgY29uc3QgdHJhY2tlciA9IG9iamVjdFRyYWNrZXIuaW5pdChmcmFtZSwgW1xuICAgICAgICAgICAgeG1pbixcbiAgICAgICAgICAgIHltaW4sXG4gICAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICAgIGhlaWdodFxuICAgICAgICBdKTtcbiAgICAgICAgXG4gICAgICAgIHNvY2tldC5sb2NhbC5lbWl0KCd0cmFjaycsIHRyYWNrZXIpO1xuXG4gICAgICAgIC8vIHNldEludGVydmFsKGFzeW5jICgpID0+IHtcblxuICAgICAgICAvLyAgICAgbGV0IGZyYW1lMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdHJlYW0nKTtcbiAgICAgICAgLy8gICAgIGxldCBib3gyID0gYXdhaXQgdHJhY2tlci5uZXh0KGZyYW1lMik7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhib3gyKTtcbiAgICAgICAgLy8gICAgIG1mc2IucmVuZGVyQm94KGJveDIpO1xuICAgICAgICAvLyB9LDEwMCk7XG5cbiAgICAgICAgLy9zb2NrZXQubG9jYWwuZW1pdCgndHJhY2snLCBiYXNlNjRDYW52YXMpO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRyYWNrZXIpO1xuXG4gICAgICAgIC8vIGxldCBzdHJlYW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RyZWFtJyk7XG4gICAgICAgIC8vIGxldCBpbWcgPSBtZnNiLmNvbnZlcnRUb0Jhc2U2NCgpO1xuICAgICAgICAvLyAvLyBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIC8vICAgICAvL3dvcmtlci5wb3N0TWVzc2FnZShpbWcpO1xuICAgICAgICAvLyAvLyB9LDEwMClcbiAgICAgICAgLy8gd29ya2VyLnBvc3RNZXNzYWdlKGltZyk7XG4gICAgICAgIC8vIHdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coZSk7XG5cbiAgICAgICAgLy8gICB9LCBmYWxzZSk7XG4gICAgfSxcbiAgICB0cmFja0FuZFJlbmRlcigpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IEZQUyA9IDI7XG5cbiAgICAgICAgLy9jZW50ZXJcbiAgICAgICAgY29uc3QgeG1pbiA9IDE4MDtcbiAgICAgICAgY29uc3QgeW1pbiA9IDE4MDtcbiAgICAgICAgY29uc3Qgd2lkdGggPSAxMjA7XG4gICAgICAgIGNvbnN0IGhlaWdodCA9IDEyMDtcblxuICAgICAgICBzZWxmLnJlbmRlckJveChbeG1pbiwgeW1pbiwgd2lkdGgsIGhlaWdodF0pO1xuXG4gICAgICAgIHNldEludGVydmFsKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGxldCBpbWcgPSBhd2FpdCBzZWxmLmNvbnZlcnRUb0Jhc2U2NCgpO1xuXG4gICAgICAgICAgICBsZXQgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgbGV0IG5vdyA9IHRvZGF5LmdldEhvdXJzKCkgKyBcIjpcIiArIHRvZGF5LmdldE1pbnV0ZXMoKSArIFwiOlwiICsgdG9kYXkuZ2V0U2Vjb25kcygpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1snICsgbm93ICsgJ10nICsgJ0ltYWdlIGNvbnZlcnRlZC4uLiBzZW5kaW5nLicgKTtcbiAgICAgICAgICAgIGF3YWl0IHNvY2tldC5zZXJ2ZXIuZW1pdCgndHJhY2snLCBpbWcpO1xuICAgICAgICB9LCAwKTtcblxuICAgICAgICAvL3NvY2tldC5lbWl0KCd0cmFjaycsIHNlbGYuY29udmVydFRvQmFzZTY0KCkpO1xuXG4gICAgICAgIHNvY2tldC5zZXJ2ZXIub24oJ29iamVjdFRyYWNrZXInLCAodHJhY2tlcikgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJCb3godHJhY2tlcik7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgbG9ja1RhcmdldCgpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCB4bWluID0gMTgwO1xuICAgICAgICBjb25zdCB5bWluID0gMTgwO1xuICAgICAgICBjb25zdCB3aWR0aCA9IDEyMDtcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gMTIwO1xuXG4gICAgICAgIHNvY2tldC5zZXJ2ZXIuZW1pdCgnbG9jay10YXJnZXQnLCBbeG1pbiwgeW1pbiwgd2lkdGgsIGhlaWdodF0pO1xuICAgICAgICBzb2NrZXQuc2VydmVyLmVtaXQoJ2xvY2stdGFyZ2V0LXByb2ZpbGUnLCBzZWxmLmNvbnZlcnRUb0Jhc2U2NCgpKTtcblxuICAgICAgICBzZWxmLnJlbmRlckJveChbeG1pbiwgeW1pbiwgd2lkdGgsIGhlaWdodF0pO1xuICAgIH0sXG4gICAgcmVuZGVyQm94KGJveCkge1xuICAgICAgICB0cmFja2luZ0NhbnZhcy53aWR0aCA9IDQ4MDtcbiAgICAgICAgdHJhY2tpbmdDYW52YXMuaGVpZ2h0ID0gNDgwO1xuICAgICAgICBsZXQgY3R4ID0gdHJhY2tpbmdDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjdHguY2FudmFzLndpZHRoLCBjdHguY2FudmFzLmhlaWdodCk7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcInllbGxvd1wiO1xuICAgICAgICBjdHguc3Ryb2tlUmVjdChib3hbMF0sIGJveFsxXSwgYm94WzJdLCBib3hbM10pO1xuXG4gICAgfSxcbiAgICBjb252ZXJ0SW1hZ2VUb0NhbnZhcygpIHtcbiAgICAgICAgYmFzZTY0Q2FudmFzLndpZHRoID0gc3RyZWFtLndpZHRoO1xuICAgICAgICBiYXNlNjRDYW52YXMuaGVpZ2h0ID0gc3RyZWFtLmhlaWdodDtcblxuICAgICAgICBjb25zdCBjdHggPSBiYXNlNjRDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICBjdHguZHJhd0ltYWdlKHN0cmVhbSwgMCwgMCk7XG5cbiAgICAgICAgcmV0dXJuIGN0eDtcbiAgICB9LFxuICAgIGNvbnZlcnRUb0Jhc2U2NCgpIHtcbiAgICAgICAgXG4gICAgICAgIGJhc2U2NENhbnZhcy53aWR0aCA9IHN0cmVhbS53aWR0aDtcbiAgICAgICAgYmFzZTY0Q2FudmFzLmhlaWdodCA9IHN0cmVhbS5oZWlnaHQ7XG5cbiAgICAgICAgY29uc3QgY3R4ID0gYmFzZTY0Q2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgY3R4LmRyYXdJbWFnZShzdHJlYW0sIDAsIDApO1xuXG4gICAgICAgIGNvbnN0IGRhdGEgPSBiYXNlNjRDYW52YXMudG9EYXRhVVJMKCdkYXRhOmltYWdlL2pwZztjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnLCAwLjEpO1xuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH0sXG4gICAgc3Vkb1JlYm9vdCgpIHtcblxuICAgICAgICBzb2NrZXQubG9jYWwuZW1pdCgnc3Vkb1JlYm9vdCcsIHRydWUpO1xuICAgIH0sXG4gICAgc3Vkb1NodXRkb3duKCkge1xuICAgICAgICBzb2NrZXQubG9jYWwuZW1pdCgnc3Vkb1NodXRkb3duJywgdHJ1ZSk7XG4gICAgfSxcblxufSJdLCJmaWxlIjoic2NyaXB0cy5qcyJ9
