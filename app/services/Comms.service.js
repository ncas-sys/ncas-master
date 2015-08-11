var connection = require('../models/Connection.model');
function Comms(socket, events){
	Comms.socket = socket;
	Comms.events = events;
	Comms.connections = {};

	Comms.socket.on('connection', function(socket){
		var connection = null;
		socket.on('Register', function(obj){
			//create a new connection
			connection = newConnection(socket, obj);
			socket.emit('Welcome')
		})
		socket.on('ImAControllerGiveMeEverything', function(){
			GiveControllerEverything(connection)
		})

		socket.on('disconnect', function(){
			delete Comms.connections[connection.connection_id];
			emitToAllControllers('ConnectionGone', connection.connection_id, null);
		})
	})
}

newConnection = function(socket, obj, locale){
	var newCon = new connection(socket, obj.type, obj.name, obj.locale);
	Comms.connections[newCon.connection_id] = newCon;
	//alert all sockets about the new user
	var obj = {
		name: newCon.name,
		type: newCon.type,
		auth: newCon.auth,
		locale: newCon.locale,
		id: newCon.connection_id
	}
	emitToAllControllers('NewConnection', obj, newCon.connection_id);
	return newCon;
}


GiveControllerEverything = function(connection){
	//first tell them what connections are currently active
	for (var key in Comms.connections) {
		var obj = {
			name: Comms.connections[key].name,
			type: Comms.connections[key].type,
			auth: Comms.connections[key].auth,
			locale: Comms.connections[key].locale,
			id: Comms.connections[key].connection_id
		}
		emitToSingeSocket(connection, 'NewConnection', obj)
	}
}


//emit to all controllers, except one - perhaps the one that just registered?
emitToAllControllers = function(name, obj, exception){
	for (var key in Comms.connections) {
		if(Comms.connections[key].type=='controller' && exception!=key){
			emitToSingeSocket(Comms.connections[key], name, obj)
		}
	}
}

//emit some info to a specific client
emitToSingeSocket = function(connection, name, obj){
	if(connection.locale=='internal'){
		connection.socket.emit(name, obj)
	}else{
		var newObj = {
			connection: connection, 
			obj: obj
		}
		connection.socket.emit(name, newObj)
	}
}








module.exports = function(socket, events){
	return new Comms(socket, events)
}