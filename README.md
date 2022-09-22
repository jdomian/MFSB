# MFSB - Hyperpixel2r
MFSB with touchscreen Hyperpixel 2.0 Round display, auto night-vision and accerometer.

## Hardware
1. Raspberry Pi Zero 2 W (2021)
2. Raspberry Pi Camera Board - Night Vision & Adjustable-Focus Lens (5MP)


## Tech Stack
1. Raspian OS (Buster)
2. NodeJS
3. NPM
4. Chromium Browser (Headless, kiosk)

## Helper Commands
Run these after SSH into the MFSB to reboot Chromium and other service needed to run the devices.
```markdown
#Shutdown Raspberry Pi, right now!
sudo shutdown -h now

# List all processes running, like NodeJS server, then find the process number.
ps aux | grep node
# Kill the process you just found by its ID
kill -9 491

# See how long all startup processes take on OS load. Disable some later to speed up boot times
systemd-analyze blame

# Run NodeJS webserver to MFSB located at /home/pi/MFSB.webserver.js
sudo node /home/pi/MFSG/webserver.js

# Start the Camera module for MFSB
sudo node node_modules/raspberrypi-node-camera-web-streamer/index.js

# Refresh the browser for MFSB, this simulates pressing "F5" to refresh the browser
DISPLAY=:0 xdotool key F5

```

## Debugging
1. Start MFSB Pi with standard USB Micro, or from switch on side of PiSugar2 installed in hull
2. SSH into MFSB with username pi@<IP.AD.DR.ESS>:8080
3. Wait for boot into interface for ammo counter
4. Use a browser to go to IP address of your device in your LAN, with port 8080 for Chromium interface

## Hardware
  * Raspberry Pi Zero 2 W (2021 Model)
  * Adafruit MSA311 Triple Axis Accelerometer [adafruit.com]: https://www.adafruit.com/product/5309
  * Raspberry Pi NoIR Camera Board v2 [adafruit.com]: https://www.adafruit.com/product/3100
  * PiSugar2 1200mAh Battery [pisugar.com]: https://www.pisugar.com/
  * Waveshare 2.0/1.3 LCD Screen [Amazon]: https://www.waveshare.com/wiki/2inch_LCD_Module?Amazon
  * MicroServo
  * Custom 3D Printed Parts

## Software Components
  * Raspberry Pi RaspbianOS (Buster)
  * NodeJS 16 for armv71 [nodejs.org]: https://nodejs.org/dist/v16.13.1/node-v16.13.1-linux-armv7l.tar.xz
  * fbcp-ili9341 Display Drivers [github]: https://github.com/juj/fbcp-ili9341
  * Openbox and XStart to load Chromium
  * Chromium Browser flagged with --kiosk
  * Tensorflow Lite for target tracking

## Startup "Linked" Files
Created some "linked" files in the root of the repo. These change the startup behavior of what loads on boot, such as the Chromium auto boot in kiosk mode, the display driver and nodejs server.
  * `boot-config` --> linked to the root pi `/book/config.txt` with setting for HDMI display overrides, overclocking and Waveshare LED Display resolution settings and orientation.
  * `kiosk-autostart` --> linked to `/etc/xdg/openbox/autostart` which contains the Chromium browser settings to auto start Chromium in fullscreen, kiosk mode and with autoplay for mp4s enabled.
  * `pi-startup` --> linked to `/etc/rc.local` which contains scripts needed to start the drivers built from fbcp-ili9341, start the nodejs server, start socket.io for GPIOs, start the webserver to serve pages and to startup the camera module, all of this on initial boot.
  
  
## autostart Setup
The following is what startx uses to load chromium with arguments to avoid CORS and allow local files access.
```bash
#
# These things are run when an Openbox X Session is started.
# You may place a similar script in $HOME/.config/openbox/autostart
# to run user-specific things.
#

# If you want to use GNOME config tools...
#
#if test -x /usr/lib/arm-linux-gnueabihf/gnome-settings-daemon >/dev/null; then
#  /usr/lib/arm-linux-gnueabihf/gnome-settings-daemon &
#elif which gnome-settings-daemon >/dev/null 2>&1; then
#  gnome-settings-daemon &
#fi

# If you want to use XFCE config tools...
#
#xfce-mcs-manager &

# ---MFSB---
# Here and below are additions made for MFSB Hyperpixel2r. (Sept 2022)
#
# Disable any form of screen saver / screen blanking / power management
xset s off
xset s noblank
xset -dpms
 
# Allow quitting the X server with CTRL-ATL-Backspace
setxkbmap -option terminate:ctrl_alt_bksp
 
# Start Chromium in kiosk mode
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/'Local State'
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences

# Set the URL for the browser to automatically load as the default.
#chromium-browser 'http://10.0.10.10:3000'
 
# Runs with flags for performance nad disabling security within local environment.
#chromium-browser --disable-infobars --disable-notifications --kiosk 'http://10.0.10.10:3000'

# Experimental
# Fullscreen kiosk with no bars
chromium-browser --disable-infobars --disable-web-security --allow-file-access-from-files --kiosk --autoplay-policy=no-user-gesture-required --window-size=480,480 'http://10.0.0.132:3000/'
```


##rc.local Setup
```bash
#!/bin/sh -e
#
# rc.local
#
# This script is executed at the end of each multiuser runlevel.
# Make sure that the script will "exit 0" on success or any other
# value on error.
#
# In order to enable or disable this script just change the execution
# bits.
#
# By default this script does nothing.

# Print the IP address
_IP=$(hostname -I) || true
if [ "$_IP" ]; then
  printf "My IP address is %s\n" "$_IP"
fi

sudo node /home/pi/MFSB/server.js > /home/pi/MFSB/log.txt 2>&1 &

exit 0
```

## NodeJS Express Simple Server

### Installation
```npm install ws pi-camera```

```javascript
//node server.js

const express = require('express')
const app = express();
const fs = require('fs')
const port = 3000;

//Do Stuff Here

app.use(express.static(__dirname+'/public'));
app.listen(port, () => console.log(`Example app listening on port ${port}! In your web browser, navigate to http://<IP_ADDRESS_OF_THIS_SERVER>:3000`));
```
