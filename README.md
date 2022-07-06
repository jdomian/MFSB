# MFSB
Mutha F'ing Smart Blaster - A Raspberry Pi Zero 2 W based, 3D printed, ammo counting, Tensorflow-based targeting computer that can curve Nerf Rival rounds while tracking targets... blaster attachment.

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

##rc.local Setup
```bash
# Print the IP address
_IP=$(hostname -I) || true
if [ "$_IP" ]; then
  printf "My IP address is %s\n" "$_IP"
fi

# 1 - Start 1.3in LCD driver and clone output to micro display
sudo /home/pi/fbcp-ili9341/build/fbcp-ili9341 &

# 2 - Start NodeJS webserver for chromium. This also starts GPIO Pin Service for buttons
su pi -c 'node /home/pi/MFSB/www/webserver.js < /dev/null &'

# 3 - Start UI via Chromium Kisok Mode. This was moved to /home/pi/.bash_profile -- COMMAND: [[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && startx -- -nocursor &

# 4 - Starts basic MJPEG Raspberry Pi Web Cam Streamer as <img src="http://<server_address>/stream.mjpg" />
#su pi -c 'sudo node /home/pi/node_modules/raspberrypi-node-camera-web-streamer/index.js < /dev/null &'

# IN DEVELOPMENT--- 5 - Starts HTML5 <video> h.264 encoded video stream to use with Tensorflow AI
#su pi -c 'python3 /home/pi/fmp4streamer/fmp4streamer.py < /dev/null &'
#su pi -c 'python3 MFSB/www/public/trackingCamera/server.py < /dev/null &'

# remote debugging in chrome on desktop over at port 9223
#su pi -c 'ssh -L 0.0.0.0:9223:localhost:9222 localhost -N < /dev/null &'
```
