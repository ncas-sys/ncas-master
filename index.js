"use strict";

var DB = require('./app/services/DB.service')();

var esocket = require('socket.io-client')('http://178.62.100.233:45654', {
    'reconnection': true,
    'reconnectionDelay': 5000,
    'reconnectionDelayMax' : 5000,
    'reconnectionAttempts': 100000
});
var io = require('socket.io').listen(5656);
var Gpio = require('onoff').Gpio;

var events = require('./app/services/Events.service')()
var connections = require('./app/services/Connections.service')(events);
var fans = require('./app/services/Fans.service')(Gpio, events)
var lighting = require('./app/services/LightingControl.service')(Gpio, events)


var external = require('./app/services/External.service')(esocket, connections, events)

var comms = require('./app/services/Comms.service')(io, events, connections, external, DB)

var door = require('./app/services/DoorContact.service')(Gpio, events);

var control = require('./app/services/Control.service')(events, comms, connections, fans, DB)

var log = require('./app/services/Log.service')(events)
