#!/bin/bash

# 1. Open raspi-config, then enable the camera, I2C,  auto login, and disable waiting for network at boot

# Update Raspberry Pi OS
sudo apt-get update -y

# Upgrade all libraries
sudo apt-get upgrade -y

# Add the repository for the latest version of NodeJS
curl -fsSL https://deb.nodesource.com/setup_19.x | sudo -E bash -

# Install Node Version Manager (Just in case)
# Use: 
# $ nvm install 16
# $ nvm use 16
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash 

# Install NodeJS now that it is added to the repository list.
sudo apt install nodejs -y

# Install additional like python3 for NodeJS & NPM build tools.
sudo apt install build-essential -y
sudo apt-get install gcc g++ make -y

# Install GIT
sudo apt-get install git -y

# Install Python3-pip... this one takes a while
sudo apt-get install python3-pip -y

# Install i2c-tools
sudo apt-get install i2c-tools -y

# Update again and install NodeJS dependencies for npm canvas
sudo apt-get update -y

# Install Gulp globally with sudo for development
sudo npm install --global gulp-cli

# Clone the MFSB repository
git clone https://github.com/jdomian/MFSB.git

# Create a symlink from lowercase to uppercase MFSB
ln -s ~/MFSB ~/mfsb

# Change directory to MFSB
cd mfsb

# Initialize NPM with packages using the repositories package.json.
npm init -y
npm install

# Install all node dependencies with NPM incase they were not already installed with npm init
npm install n express workerpool socket.io raspberry-pi-camera-native gulp gulp-cli

# Install gulp dependencies
npm install gulp-csso gulp-sass sass gulp-concat gulp-minify gulp-clean-css gulp-sourcemaps browser-sync del node-fetch

# (Optional)
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
