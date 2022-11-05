#!/bin/bash

# Clone the MFSB repository
git clone https://github.com/jdomian/MFSB.git

# Change directory to MFSB
cd MFSB

# Checkout hyperpixel2r Branch
git checkout hyperpixel2r

# Install NPM dependencies
npm install

cd

git clone https://github.com/pimoroni/hyperpixel2r
cd hyperpixel2r
sudo ./install.sh -y 

cd

git clone https://github.com/pimoroni/hyperpixel2r-python
cd hyperpixel2r-python
sudo ./install.sh -y

sudo reboot
