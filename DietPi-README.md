# Configuration for Pi Zero 2 W - DietPi

## DietPi boots much faster and is easier to setup from the CLI than Raspian Buster. 

### DietPi Setup
1. Flash DietPi image from dietpi.com using balenaEtcher. Use RPi ArmV7 32-Bit for RPi Zero 2 W. NOT 64 BIT!
2. Copy configs (To Add) for dietpi.txt and dietpi-wifi.txt to root of SD, once flashed.
  - This will have wifi setting, local settings etc.
3. Run DietPi on device for initial setup.
4. Aftger inistial setup, run ```dietpi-config```. Change the follwoing
  - Hostname
  - Password for root and dietpi
  - SSH to OpenSSH (For VS Code file browsing)
6. After inital setup, use ```dietpi-software``` to load the insterface to install dependencies. Use the "Search Software" and install the following dependencies.
  - Chromium: web browser for desktop or autostart
  - Python 3: Runtime system, pip package installer and development headers
  - Node.js: JavaScript runtime environment
  - Build-Essential: GNU C/C++ compiler, development libraries and header
7. Once software is installed, check that node & npm are installed
  ```bash
  node -v
  npm -v
  ```
6. Install node-rpio from jperkins (https://github.com/jperkin/node-rpio).
  ```bash
  sudo npm install rpio
  ```

