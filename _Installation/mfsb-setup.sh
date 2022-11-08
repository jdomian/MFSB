#!/bin/bash

# Colors for console prompts and feedback when running script.
red_prefix="\033[31m"
green_prefix="\033[32m"
yellow_prefix="\033[33m"
blue_prefix="\033[34m"
purple_prefix="\033[35m"

red_bold_prefix="\033[1;31m"
green_bold_prefix="\033[1;32m"
yellow_bold_prefix="\033[1;33m"
blue_bold_prefix="\033[1;34m"
purple_bold_prefix="\033[1;35m"

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
echo -e "$yellow_bold_prefix"Adding settings for "$blue_prefix"Chromium Browser"$all_suffix" "$yellow_bold_prefix"to boot in Kiosk mode on loading of XServer window manager..."$all_suffix"
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
    echo "chromium-browser --disable-infobars --disable-web-security --allow-file-access-from-files --kiosk --autoplay-policy=no-user-gesture-required app=http://localhost:8080" >> $autostart
exit

##### --- For Hyperpixel2r Display--- #####
cd
echo -e "$purple_prefix"Installing Hyperpixel 2.1 Round drivers from Github..."$all_suffix"
git clone https://github.com/pimoroni/hyperpixel2r
cd hyperpixel2r
sudo ./install.sh -y

cd
echo -e "$purple_prefix"...adding touch driver..."$all_suffix"
git clone https://github.com/pimoroni/hyperpixel2r-python
cd hyperpixel2r-python
sudo ./install.sh -y
cd
cd

##### --- Create basic NodeJS web server --- #####
echo -e "$green_bold_prefix"Creating basic NodeJS express web server."$all_suffix"
cd

# Check if NodeJS Web Server folder exists
nodeServerFolder='node-server'
if [ -d "$nodeServerFolder" ]; then
    echo "NodeJS web server folder exists... skipping"
else
    sudo mkdir $nodeServerFolder
fi
cd $nodeServerFolder

# Create NodeJS Express web server
serverJS='server.js'
if [ -f "$serverJS" ]; then
    echo "NodeJS server file exists... skipping"
else
    echo "NodeJS server DOES NOT file exists... creating basic NodeJS Express web server..."
    sudo touch server.js
    serverJS='server.js'
    echo "// This is a basic NodeJS Web Server. " | sudo tee -a $serverJS
    echo "" | sudo tee -a $serverJS
    echo "const express = require('express');" | sudo tee -a $serverJS
    echo "const app = express();" | sudo tee -a $serverJS
    echo "const os = require('os');" | sudo tee -a $serverJS
    echo "const interfaces = os.networkInterfaces();" | sudo tee -a $serverJS
    echo "const serverIP = interfaces;" | sudo tee -a $serverJS
    echo "const port = 8000;" | sudo tee -a $serverJS
    echo "" | sudo tee -a $serverJS
    echo "const server = {" | sudo tee -a $serverJS
    echo "    init() {" | sudo tee -a $serverJS
    echo "        app.listen(port, () => console.log(\`Listening on port \${port}\!\`));" | sudo tee -a $serverJS
    echo "        console.log(interfaces);" | sudo tee -a $serverJS
    echo "    }" | sudo tee -a $serverJS
    echo "}" | sudo tee -a $serverJS
    echo "" | sudo tee -a $serverJS
    echo "server.init();" | sudo tee -a $serverJS
    echo "app.use(express.static(__dirname + '/public'));" | sudo tee -a $serverJS
fi

# Create /public directory and /public/css amd /public/js directories for web files.
cd $nodeServerFolder
webRootDir='public'
if [ -d "$webRootDir" ]; then
    echo "NodeJS web root directory 'public' exists... skipping"
    cd $webRootDir
else
    echo "NodeJS web root directory 'public' DOES NOT exists... creating..."
    sudo mkdir public
    webRootDir='public'
    cd $webRootDir
    sudo mkdir css
    sudo mkdir js
fi

# Create initial HTML file in the /public directory.
indexHTML='index.html'
if [ -d "$indexHTML" ]; then
    echo "index.html exists... skipping"
    cd
    cd
    cd
    echo "NodeJS web server already setup. Edit index.html to test."
else
    echo "index.html DOES NOT exists... creating..."
    echo index.html
    indexHTML = 'index.html'
    echo '<!DOCTYPE html>' | sudo tee -a $indexHTML
    echo '<html lang="en">' | sudo tee -a $indexHTML
    echo '  <head>' | sudo tee -a $indexHTML
    echo '    <meta charset="UTF-8">' | sudo tee -a $indexHTML
    echo '    <meta name="viewport" content="width=device-width, initial-scale=1.0">' | sudo tee -a $indexHTML
    echo '    <meta http-equiv="X-UA-Compatible" content="ie=edge">' | sudo tee -a $indexHTML
    echo '    <title>NodeJS Server - HTML5 Boilerplate</title>' | sudo tee -a $indexHTML
    echo '    <link rel="stylesheet" href="css/style.css">' | sudo tee -a $indexHTML
    echo '  </head>' | sudo tee -a $indexHTML
    echo '  <body>' | sudo tee -a $indexHTML
    echo '    <h1>NodeJS Express Server</h1>' | sudo tee -a $indexHTML
    echo '    <script src="js/index.js"></script>' | sudo tee -a $indexHTML
    echo '  </body>' | sudo tee -a $indexHTML
    echo '</html>' | sudo tee -a $indexHTML
fi

cd
cd $nodeServerFolder

# Install NodeJS NPM dependencies
sudo npm install -g express

# Add display launch command to .bash_profile to open Chromium on boot and start NodeJS Server.
bashProfile='.bash_profile'
if [ -f "$bashProfile" ]; then
    echo "$bashProfile exists."
    echo '[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && startx -- -nocursor' >> $bashProfile
else 
    echo "$bashProfile does not exist."
    echo > .bash_profile
    bashProfile='.bash_profile'
    echo "# Start XServer display on boot and launch /etc/xdg/openbox/autostart script." >> $bashProfile
    echo '[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && startx -- -nocursor' >> $bashProfile
    echo "# Start NodeJS Web Server on boot" >> $bashProfile
    echo 'node /home/pi/node-server/server.js < /dev/null &' >> $bashProfile
fi

PS3='What are you trying to setup here?: '
setup=("MFSB" "MFSB-hyperpixel2r" "Basic NodeJS Express Web Server" "Quit")
select what in "${setup[@]}"; do
    case $what in
        "MFSB")
            echo "Americans eat roughly 100 acres of $hat each day!"
	        # optionally call a function or run some code here
            ;;
        "MFSB-hyperpixel2r")
            echo "$what is a Vietnamese soup that is commonly mispronounced like go, instead of duh."
	        # optionally call a function or run some code here
            ;;
        "Basic NodeJS Express Web Server")
            echo "According to NationalTacoDay.com, Americans are eating 4.5 billion $what each year."
	        # optionally call a function or run some code here
	        break
            ;;
	    "Quit")
	        echo "User requested exit"
	        exit
	        ;;
        *) echo "invalid option $REPLY";;
    esac
done

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

