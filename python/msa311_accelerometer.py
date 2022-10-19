# SPDX-FileCopyrightText: 2021 ladyada for Adafruit Industries
# SPDX-License-Identifier: MIT

# Dependencies needed to install first:
# $ pip3 install adafruit-circuitpython-lis3dh
# $ pip3 install adafruit-circuitpython-busdevice
# $ pip3 install adafruit-circuitpython-register
# $ pip3 install adafruit-circuitpython-msa301
#
# Then sym-link the i2c deveices, as hyperpixel2r i2c port is on i2c-11
# $ sudo ln -s /dev/i2c-11 /dev/i2c-0
# $ sudo ln -s /dev/i2c-11 /dev/i2c-1

import time
import board
from adafruit_msa3xx import MSA311
import sys

i2c = board.I2C()  # uses board.SCL and board.SDA
msa = MSA311(i2c)

while True:
    print("%f,%f,%f" % msa.acceleration, end='', flush=True)
    time.sleep(0.1)
    sys.stdout.flush()