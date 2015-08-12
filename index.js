"use strict";

var io = new require('socket.io').listen(5656);

var events = require('./app/services/Events.service')()
var connections = require('./app/services/Connections.service')();

var comms = require('./app/services/Comms.service')(io, events, connections)


var control = require('./app/services/Control.service')(events, comms, connections)

var log = require('./app/services/Log.service')(events)
