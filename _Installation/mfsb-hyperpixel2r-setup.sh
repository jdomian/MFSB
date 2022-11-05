#!/bin/bash

# Check if the camera is enabled. 1 = disabled, 0 = enabled.
# sudo raspi-config nonint get_camera

# Enable the camera
sudo raspi-config nonint do_camera 0 -y

# Check if i2c is enabled. 1 = disabled, 0 = enabled.
# sudo raspi-config nonint get_i2c

# Enable i2c
sudo raspi-config nonint do_i2c 0 -y

# Update Raspberry Pi OS
sudo apt-get update -y

# Upgrade all libraries
sudo apt-get upgrade -y

# Add the repository for the latest version of NodeJS
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -

# Install Node Version Manager (Just in case)
# Use: 
# $ nvm install 16
# $ nvm use 16
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash 

# Install NodeJS now that it is added to the repository list.
sudo apt-get install nodejs -y

# Install additional like python3 for NodeJS & NPM build tools.
sudo apt-get install gcc g++ make -y
sudo apt install build-essential -y

# Install GIT
sudo apt-get install git -y 

# Install Python3-pip... this one takes a while
sudo apt-get install python3-pip -y
sudo apt-get install libfontconfig -y

# Install i2c-tools
sudo apt-get install i2c-tools -y

# Chromium Kiosk-Mode install
sudo apt-get install --no-install-recommends xserver-xorg x11-xserver-utils xinit openbox -y
sudo apt-get install --no-install-recommends chromium-browser -y

# TODO Add an openbox file to move with mv
# TODO Add rc.local to write to

OPENBOX="/etc/xdg/openbox/autostart"

OPENBOX_LINES=(
  "# Disable any form of screen saver / screen blanking / power management"
  "xset s off"
  "xset s noblank"
  "xset -dpms"
  "# Allow quitting the X server with CTRL-ATL-Backspace"
  "setxkbmap -option terminate:ctrl_alt_bksp"
  "# Start Chromium in kiosk mode"
  "sed -i 's/`exited_cleanly`:false/`exited_cleanly`:true/' ~/.config/chromium/'Local State'"
  "sed -i 's/`exited_cleanly`:false/`exited_cleanly`:true/; s/`exit_type`:`[^`]\+`/`exit_type`:`Normal`/' ~/.config/chromium/Default/Preferences"
  "chromium-browser --disable-infobars --disable-web-security --allow-file-access-from-files --kiosk --autoplay-policy=no-user-gesture-required --window-size=480,480 app=http://10.0.0.132:3000/"
)

# Update again and install NodeJS dependencies for npm canvas
sudo apt-get update -y

# Install Gulp globally with sudo for development
sudo npm install --global gulp-cli

# Clone the raspberrypi_node_camera_web_streamer

# Clone the MFSB repository
git clone https://github.com/jdomian/MFSB.git

# Create a symlink from lowercase to uppercase MFSB
ln -s ~/MFSB ~/mfsb
# Change directory to MFSB/www root for MFSB v2 (Rivalburn version)
cd MFSB 

# Checkout hyperpixel2r Branch
git checkout hyperpixel2r
git pull



# Install NPM dependencies
sudo npm install
sudo npm install raspberry-pi-camera-native
sudo npm install skia-canvas


# hyperpixel2r LCD screen driver install
cd

git clone https://github.com/pimoroni/hyperpixel2r
cd hyperpixel2r
sudo ./install.sh -y

cd

git clone https://github.com/pimoroni/hyperpixel2r-python
cd hyperpixel2r-python
sudo ./install.sh

sudo reboot
