#!/bin/bash
# -- FOR HYPERPIXEL2R

cd

git clone https://github.com/pimoroni/hyperpixel2r
cd hyperpixel2r
sudo ./install.sh

cd

git clone https://github.com/pimoroni/hyperpixel2r-python
cd hyperpixel2r-python
sudo ./install.sh

sudo reboot