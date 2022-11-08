#!/bin/bash

# Colors for console prompts and feedback when running script.
red_prefix="\033[31m"
green_prefix="\033[32m"
yellow_prefix="\033[33m"
blue_prefix="\033[34m"

red_bold_prefix="\033[1;31m"
green_bold_prefix="\033[1;32m"
yellow_bold_prefix="\033[1;33m"
blue_bold_prefix="\033[1;34m"
all_suffix="\033[00m"

# Check if the camera is enabled. 1 = disabled, 0 = enabled.
# sudo raspi-config nonint get_camera

# Enable the camera
echo -e "$green_prefix"Enabling camera module..."$all_suffix"
sudo raspi-config nonint do_camera 0 -y

# Check if i2c is enabled. 1 = disabled, 0 = enabled.
# sudo raspi-config nonint get_i2c

# Enable i2c
echo -e "$green_prefix"Enabling i2c..."$all_suffix"
sudo raspi-config nonint do_i2c 0 -y

# Update Raspberry Pi OS
echo -e "$green_prefix"Updating Raspberry Pi OS..."$all_suffix"
sudo apt-get update -y

# Upgrade all libraries
echo -e "$green_prefix"Upgrading Raspberry Pi OS dependencies..."$all_suffix"
sudo apt-get upgrade -y

# Install additional like python3 for NodeJS & NPM build tools.
echo -e "$green_prefix"Installing g++..."$all_suffix"
sudo apt-get install g++ -y

echo -e "$green_prefix"Installing gcc..."$all_suffix"
sudo apt-get install gcc -y

echo -e "$green_prefix"Installing c++ make..."$all_suffix"
sudo apt-get install make -y

echo -e "$green_prefix"Installing build-essential..."$all_suffix"
sudo apt install build-essential -y

# Install GIT
echo -e "$green_prefix"Installing GIT..."$all_suffix"
sudo apt-get install git -y 

# Install Python3-pip... this one takes a while
echo -e "$green_prefix"Installing Python 3..."$all_suffix"
sudo apt-get install python3 -y
sudo apt-get install python3-pip -y
sudo apt-get install libfontconfig -y

# Install i2c-tools
echo -e "$green_prefix"Installing i2c-tools..."$all_suffix"
sudo apt-get install i2c-tools -y

# Update again
echo -e "$green_prefix"Running update again..."$all_suffix"
sudo apt-get update -y

# Add the repository for the latest version of NodeJS
echo -e "$green_prefix"Downloading NodeJS Setup..."$all_suffix"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash

# Install NodeJS now that it is added to the repository list.
echo -e "$green_prefix"Installing NodeJS..."$all_suffix"
sudo apt-get install nodejs -y

# Install Node Version Manager (Just in case)
# Use: 
# $ nvm install 16
# $ nvm use 16
echo -e "$green_prefix"Installing NVM - Node Version Manager..."$all_suffix"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash

echo -e "$green_prefix"Configuring NVM..."$all_suffix"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

echo -e "$green_prefix"Updating NPM to latest major version..."$all_suffix"
sudo npm install -g npm@latest

# Install Gulp globally with sudo for development
echo -e "$green_prefix"Installing GulpJS CLI globally..."$all_suffix"
sudo npm install --global gulp-cli

##### --- KIOSK MODE --- #####
echo -e "$yellow_bold_prefix"Starting Chromium Kiosk Mode Install"$all_suffix"
echo -e "$yellow_prefix"Installing X.Org/XServer, XServer Utilities, XInit and OpenBox"$all_suffix"
sudo apt-get install --no-install-recommends xserver-xorg x11-xserver-utils xinit openbox -y

# Chromium-Browser install.
echo -e "$yellow_prefix"Installing"$all_suffix" "$blue_prefix"Chromium Browser..."$all_suffix"
sudo apt-get install --no-install-recommends chromium-browser -y

# Append OpenBox settings to /etc/xdg/openbox/autostart file to launch Chromium Browser on boot at full screen. Done with sudo -i as sudo.
sudo -i
autostart='/etc/xdg/openbox/autostart'
echo "" >> $autostart
echo "" >> $autostart
echo "# Disable any form of screen saver / screen blanking / power management" >> $autostart
echo "xset s off" >> $autostart
echo "xset s noblank" >> $autostart
echo "xset -dpms" >> $autostart
echo "" >> $autostart
echo "# Allow quitting the X server with CTRL-ATL-Backspace" >> $autostart
echo "setxkbmap -option terminate:ctrl_alt_bksp" >> $autostart
echo "" >> $autostart
echo "# Start Chromium in kiosk mode" >> $autostart
echo "sed -i 's/\"exited_cleanly\":false/\"exited_cleanly\":true/' ~/.config/chromium/'Local State'" >> $autostart
echo "sed -i 's/\"exited_cleanly\":false/\"exited_cleanly\":true/; s/\"exit_type\":\"[^\"]\+\"/\"exit_type\":\"Normal\"/' ~/.config/chromium/Default/Preferences" >> $autostart
echo "chromium-browser --disable-infobars --kiosk 'http://localhost:8000'" >> $autostart
exit

# Add display launch command to .bash_profile to open Chromium on boot.
bashProfile='.bash_profile'
if [ -f "$bashProfile" ]; then
    echo "$bashProfile exists."
    echo '[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && startx -- -nocursor' >> $bashProfile
else 
    echo "$bashProfile does not exist."
    echo > .bash_profile
    bashProfile='.bash_profile'
    echo '[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && startx -- -nocursor' >> $bashProfile
fi

# Clone the MFSB repository
git clone https://github.com/jdomian/MFSB.git

# Create a symlink from lowercase to uppercase MFSB
ln -s ~/MFSB ~/mfsb

# Change directory to MFSB/www root for MFSB v2 (Rivalburn version)
cd MFSB

# Initialize NPM with packages using the repositories package.json.
sudo npm install
sudo npm install raspberry-pi-camera-native
sudo npm install skia-canvas


# (Optional)

# Clone the raspberrypi_node_camera_web_streamer

# Install all node dependencies with NPM incase they were not already installed with npm init
#npm install n express workerpool socket.io raspberry-pi-camera-native gulp gulp-cli

# Install gulp dependencies
#npm install gulp-csso gulp-sass sass gulp-concat gulp-minify gulp-clean-css gulp-sourcemaps browser-sync del node-fetch

# Install other dependencies for canvas
#sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

