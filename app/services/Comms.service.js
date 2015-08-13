function Comms(socket, events, connections){
	Comms.socket = socket;
	Comms.events = events;
	Comms.connections = connections

	socket.on('connect', function(socket){
		var ip = socket.handshake.address;
		var connection = null;
		socket.on('Register', function(obj){
			//create a new connection
			connection = connections.newConnection(socket, obj, ip);
			Comms.prototype.emitToAllControllers('NewConnection', obj, connection.connection_id);
			socket.emit('Welcome')
			setUpListeners(socket, obj, connection)
		})
		socket.on('disconnect', function(){
			socket.disconnect()
			if(typeof connection !='null' && connection!=null){
				delete Comms.connections.deleteConnection(connection.connection_id);
				Comms.prototype.emitToAllControllers('ConnectionGone', connection.connection_id, null);
			}
		})
	})
}


GiveControllerEverything = function(connection){
	//first tell them what connections are currently active
	var cons = Comms.connections.getConnections()
	for (var key in cons) {
		var obj = {
			name: cons[key].name,
			type: cons[key].type,
			auth: cons[key].auth,
			locale: cons[key].locale,
			id: cons[key].connection_id,
			ip: cons[key].ip
		}
		Comms.prototype.emitToSingeSocket(connection, 'NewConnection', obj)
	}
	//next, tell them all the statues of stuff
	Comms.events.emit('SingleControllerConnected', connection);
	
}


//emit to all controllers, except one - perhaps the one that just registered?
Comms.prototype.emitToAllControllers = function(name, obj, exception){
	var cons = Comms.connections.getConnections()
	for (var key in cons) {
		if(cons[key].type=='controller' && exception!=key){
			Comms.prototype.emitToSingeSocket(cons[key], name, obj)
		}
	}
}

//emit some info to a specific client
Comms.prototype.emitToSingeSocket = function(connection, name, obj){
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


setUpListeners = function(socket, obj, connection){
	if(obj.type=='node'){
		socket.on('UpdateState', function(obj){
			//this is from a node, something has changed :/	
			Comms.events.emit('UpdateState', obj)
		})
	}else if(obj.type=='controller'){
		socket.on('GiveMeEverything', function(){
			GiveControllerEverything(connection)
		})
		socket.on('AuthAttempt', function(obj){
			//an attempt to auth is being made, let's check it out
			Comms.connections.AuthAttempt(obj, connection.connection_id)
		})
		socket.on('command', function(obj){
			//a command has come from the controller, go the command module
			
		})
	}
}


module.exports = function(socket, events, connections){
	return new Comms(socket, events, connections)
}