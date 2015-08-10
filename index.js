"use strict";

var io = require('socket.io').listen(5656);

var events = require('./app/services/Events.service')()
var commands = require('./app/services/Commands.service')(io, events)
var comms = require('./app/services/Comms.service')(io, events)
