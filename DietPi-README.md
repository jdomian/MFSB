# Configuration for Pi Zero 2 W - DietPi

## DietPi boots much faster and is easier to setup from the CLI than Raspian Buster. 

### DietPi Setup
1. Flash DietPi image from dietpi.com using balenaEtcher. Use RPi ArmV7 32-Bit for RPi Zero 2 W. NOT 64 BIT!
2. Once image is flashed to the microSD card, eject it from your PC< and re-insert it so you can browse to the files on the SD card. 
3. Open the SD cards files and copy configs (To Add) for dietpi.txt and dietpi-wifi.txt to root of SD, once flashed.
  - This will have wifi setting, local settings etc.
4. Eject the microSD card from your PC and get ready to insert into Raspberry Pi
5. Plug Raspberry Pi into an external monitor, keyboard and if possible mouse(optional). Insert the microSD card into the Rasperbby Pi and power on the Raspberry Pi. This will run the initial setup for DietPi. Be patient... Grab a drink, and come back.
6. At this point the OS is loaded and configured. It may ask you for a username/password. THe default for this OS distro is ```root```/```dietpi```.
7. After initial setup, run ```dietpi-config``` in the . Change the follwoing
  - Hostname
  - Password for root and dietpi
  - SSH to OpenSSH (For VS Code file browsing)
8. After inital setup, use ```dietpi-software``` to load the insterface to install dependencies. Use the "Search Software" and install the following dependencies.
  - Chromium: web browser for desktop or autostart
      -- Set the initial page value http://localhost:8080 
  - Python 3: Runtime system, pip package installer and development headers
  - Node.js: JavaScript runtime environment
  - Build-Essential: GNU C/C++ compiler, development libraries and header
7. Once software is installed, check that node & npm are installed
  ```bash
  node -v
  npm -v
  ```
6. Install node-rpio from jperkins (https://github.com/jperkin/node-rpio).
  ```bash
  sudo npm install rpio
  ```
8. Create a new node webserver. Create a file called ```webserver.js``` in the /root directory, then add the following javascript:
  ```js
    var http = require('http').createServer(handler); //require http server, and create server with function handler().
    var fs = require('fs'); //require filesystem module.
    var roorDir = '/'; //change this to your root directory path which you will place your files in, in the next step.

    http.listen(8080); //listen to port 8080

    function handler (req, res) { //create server
      fs.readFile(__dirname + rootDir + '/index.html', function(err, data) { //read file index.html in rootDir folder.
        if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
          return res.end("404 Not Found");
      }
      res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
      res.write(data); //write data from index.html
        return res.end();
      });
    }
  ```
 9. Create a new folder to store all your HTML/JS/CSS in which will act as your application root directory. In this folder, create a blank file called ```index.html```. Add the following HTML to test.
  ```html
    <!DOCTYPE html>
    <html>
    <body>

    <h1>No Webserver.js Test</h1>
      <p>You MF'in did it!</p>

    </body>
    </html>
  ```
10. Run the new webserver.js file by typing this into command line, then refresh your browser on the Raspberry Pi plugged into the external monitor.
  ```bash
  node webserver.js
  ```


