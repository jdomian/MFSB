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

# Install NPM dependencies
npm install
npm install raspberry-pi-camera-native
npm install skia-canvas

cd

git clone https://github.com/pimoroni/hyperpixel2r
cd hyperpixel2r
sudo ./install.sh -y 

cd

git clone https://github.com/pimoroni/hyperpixel2r-python
cd hyperpixel2r-python
sudo ./install.sh -y

sudo reboot
