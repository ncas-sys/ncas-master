var connection = require('../models/Connection.model');
function Comms(socket, events){
	Comms.socket = socket;
	Comms.events = events;
	Comms.connections = [];

	Comms.socket.on('connection', function(socket){
		socket.on('register', function(){
			//create a new connection
			newConnection(socket)
		})
	})
}

newConnection = function(socket){
	var newCon = new connection(socket);
	Comms.connections.push(newCon);
	console.log(Comms.connections)
}

Comms.prototype.fakeCall = function(){
	Comms.events.on('yo', function(){
		console.log('the yo callback has made it: ' + Comms.hello)
	})

	Comms.events.on('yo', function(){
		console.log('another callback was made')
	})

}


module.exports = function(socket, events){
	return new Comms(socket, events)
}