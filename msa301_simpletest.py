# SPDX-FileCopyrightText: 2021 ladyada for Adafruit Industries
# SPDX-License-Identifier: MIT

import time
import board
import adafruit_msa301
import sys

i2c = board.I2C()  # uses board.SCL and board.SDA
msa = adafruit_msa301.MSA301(i2c)

while True:
    print("\r%f, %f, %f" % msa.acceleration, end='', flush=True)
    time.sleep(0.1)
    sys.stdout.flush()