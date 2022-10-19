#!/bin/bash

# Clone the MFSB repository
git clone https://github.com/jdomian/MFSB.git

# Change directory to MFSB
cd MFSB

# Checkout hyperpixel2r Branch
git checkout hyperpixel2r

# Install all node dependencies with NPM
sudo npm install express workerpool socket.io raspberry-pi-camera-native @cloud-annotations/object-tracking canvas