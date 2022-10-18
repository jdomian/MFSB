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

# Install Python3 & pip
sudo apt install python3 -y

# Install i2c-tools
sudo apt-get install i2c-tools

# Clone the MFSB repository
git clone https://github.com/jdomian/MFSB.git

# Change directory to MFSB
cd MFSB

# Checkout hyperpixel2r Branch
git checkout hyperpixel2r