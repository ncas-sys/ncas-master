"use strict";

var io = new require('socket.io').listen(5656);
var Gpio = require('onoff').Gpio;

var events = require('./app/services/Events.service')()
var connections = require('./app/services/Connections.service')();
var fans = require('./app/services/Fans.service')(Gpio, events)



var comms = require('./app/services/Comms.service')(io, events, connections)


var control = require('./app/services/Control.service')(events, comms, connections, fans)

var log = require('./app/services/Log.service')(events)
