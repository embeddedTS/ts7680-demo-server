TS-7680 web server exposing GPIO, accelerometer, and ADC API endpoints in a browser interface
============================================================================================


# Install

    npm install ts7680-demo-server

This code is a demo specifically written for the embeddedTS [TS-7680](https://wiki.embeddedTS.com/wiki/TS-7680).   It has not been tested on any other systems and it is not expected that it will work (and possibly not even compile) as-is on any other boards.

# Usage

Once installed, the server can be started with management software such as pm2, or can be invoked manually, e.g.

    node node_modules/ts7680-demo-server/server.js

Note the IP address of the board.  Once the server has started, enter the IP address of the server, followed by a colon and the port number (8080) into a browser on a machine on a network that can see the IP address and port of the board.  For example, if the board's IP address is 192.168.3.237, then the full URL of the board would be:

    http://192.168.3.237:8080/

The browser will load the front end code from the server, and display the LED and ADC state in real time.  In addition, clicking on the "Sample Accelerometer" button will (after a one second delay) display a graph of 1000ms of samples from the accelerometer.


# Copyright

Written by Michael Schmidt.

# License

GPL 3.0
