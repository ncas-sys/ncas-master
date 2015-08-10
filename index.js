"use strict";

var io = require('socket.io').listen(3000);
var events = require('./app/services/Events.service')()


var commands = require('./app/services/Commands.service')(io, events)
var comms = require('./app/services/Comms.service')(io, events)



setTimeout(function(){
	comms.fakeCall()
}, 1000)

setTimeout(function(){
	commands.amethod()
}, 2000)