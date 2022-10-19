#!/bin/bash

# 1. Open raspi-config, then enable the camera, I2C,  auto login, and disable waiting for network at boot

# Update Raspberry Pi OS
sudo apt-get update -y

# Upgrade all libraries
sudo apt-get upgrade -y

# Add the repository for the latest version of NodeJS
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -

# Install NodeJS now that it is added to the repository list.
sudo apt install nodejs -y

# Install additional NodeJS & NPM build tools.
sudo apt install build-essential -y

# Install GIT
sudo apt-get install git -y

# Install Python3
sudo apt install python3 -y

# Install i2c-tools
sudo apt-get install i2c-tools -y

# Clone the MFSB repository
git clone https://github.com/jdomian/MFSB.git

# Change directory to MFSB
cd MFSB

# Install all node dependencies with NPM
npm install n express workerpool socket.io raspberry-pi-camera-native gulp gulp-cli

# Install Gulp globally with sudo for development
sudo npm install --global gulp-cli

# Install gulp dependencies
npm install gulp-csso gulp-sass sass gulp-concat gulp-minify gulp-clean-css gulp-sourcemaps browser-sync del node-fetch@2.6.1