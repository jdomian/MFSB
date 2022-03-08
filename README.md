# MFSB
Mutha F'ing Space Blaster - A Raspberry Pi Zero 2 W based, 3D printed, ammo counting, Tensorflow-based targeting computer that can curve Nerf Rival rounds while tracking targets... blaster attachment.

## Hardware
#### Raspberry Pi Zero 2 W (2021 Model)
#### Raspberry Pi Camera Module V2
#### PiSugar2 1200mAh Battery
#### Waveshare 2.0/1.3 LCD Screen

## Software Components
#### Raspberry Pi RaspbianOS (Buster)
#### NodeJS 16 for armV7
#### fbcp-ili9341 Display Drivers
#### Openbox and XStart to load Chromium
#### Chromium Browser flagged with --kiosk
#### Tensorflow Lite for target tracking

## Startup
Created some "linked" files in the root of the repo. These change the startup behavior of what loads on boot, such as the Chromium
