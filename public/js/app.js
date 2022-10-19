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