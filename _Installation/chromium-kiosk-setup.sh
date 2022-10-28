#!/bin/bash

# Remove packages not needed if on desktop
sudo apt purge wolfram-engine scratch scratch2 nuscratch sonic-pi idle3 -y
sudo apt purge smartsim java-common minecraft-pi libreoffice* -y

# Clean up packages
sudo apt clean
sudo apt autoremove -y

# Update again
sudo apt update -y
sudo apt upgrade -y

# Login to rasp-cconfig to enable auto-login
sudo raspi-config

# Install xdotools so we can simulate keyboard actions within the CLI
sudo apt install xdotool unclutter sed -y

# Install X Server/X.org, matchbox and chromium
sudo apt-get install --no-install-recommends xserver-xorg xinit x11-xserver-utils unclutter chromium-browser matchbox-window-manager xautomation -y

# Move kiosk setting to root for user
sudo mv /home/pi/MFSB/_Installation/kiosk.sh ~/kiosk.sh

# Setup Xserve dependencies and configuration to host Chromium on the screen.
sudo chmod u+x ~/kiosk.sh

# (Optional)
# Run rpi-update for latest kernal
sudo apt-get install rpi-update -y
sudo rpi-update -y