# MFSB
Mutha F'ing Smart Blaster - A Raspberry Pi Zero 2 W based, 3D printed, ammo counting, Tensorflow-based targeting computer that can curve Nerf Rival rounds while tracking targets... blaster attachment.

## Helper Commands
Run these after SSH into the MFSB to reboot Chromium and other service needed to run the devices.

## Debugging
1. Start MFSB Pi with standard USB Micro, or from switch on side of PiSugar2 installed in hull
2. Wait for boot into interface for ammo counter
3. Use a browser to go to IP address of your device in your LAN, with port 8080 for Chromium interface

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


