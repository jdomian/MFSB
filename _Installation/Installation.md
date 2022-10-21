# Installation

These are in installation steps needed to get everything to work and run on a clean linux install (Raspberry Pi OS recommended). You can copy and past this script in the users home directory, then run.

## Scripts

Install all dependencies and software on Raspberry Pi Zero 2 W after first boot.

```bash
sudo ./mfsb-setup.sh
```
This script does the following:
1. Updates OS with latest repository references
2. Upgrrades OS
3. Adds NodeJS to list of repositories for ```apt-get```.
4. Installs NodeJS framework (NodeJS, NPM and NVM)
5. Installs Python3, C++, G++, Git, i2c-tools
6. Installs Gulp.js CLI
7. Pulls MFSB repo
8. Installs all NPM dependencies
