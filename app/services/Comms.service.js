function Comms(io, events, connections, external, DB){
	Comms.events = events;
	Comms.connections = connections
	Comms.external = external

<<<<<<< HEAD
	io.on('connection', function(newsocket){
		var ip = newsocket.handshake.address;
		newsocket.on('Register', function(obj){
			//register a new connection
			obj.ip = ip;
			var connection = Comms.connections.newConnection(newsocket,obj);
			
			if(obj.type=='controller'){
				newsocket.on('ToMaster', function(data){
					data.conn_id = connection.id;
					Comms.events.emit('ToMaster', data);
				})
			}else if(obj.type=='node'){
				newsocket.emit('WelcomeNode');
				newsocket.on('UpdateState', function(obj){
					Comms.events.emit('UpdateState', obj)
				})
=======
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
>>>>>>> 2b367309f31c64725d9ba8a5b9951f07e622cace
			}
			newsocket.on('disconnect', function(){
				newsocket.disconnect()
				if(typeof connection !='null' && connection!=null){
					Comms.connections.deleteConnection(connection.id);
					connection = null;
				}
			})
			
			
		})
	})


	
	Comms.events.on('ToMaster', function(obj){
		//this is where all incoming request from all controllers after regstering come in
		if(obj.event=='GiveMeEverything'){
			GiveControllerEverything(obj.conn_id);	
		}
	})
	
	//this comes from the connections servce, and tells us when to welcome a controller
	Comms.events.on('WelcomeController', function(obj){
		Comms.prototype.emitToSingeSocket(obj.id, 'WelcomeController', obj.id);
		Comms.prototype.emitToAllControllers('NewConnection', obj, obj.id);
	})
	
	Comms.events.on('ConnectionGone', function(id){
		Comms.prototype.emitToAllControllers('ConnectionGone', id, null);
	})
	
}






GiveControllerEverything = function(connection_id){
	//first tell them what connections are currently active
	var cons = Comms.connections.getConnections()
	for (var key in cons) {
		var obj = {
			name: cons[key].name,
			type: cons[key].type,
			auth: cons[key].auth,
			locale: cons[key].locale,
			id: cons[key].id,
			ip: cons[key].ip
		}
<<<<<<< HEAD
		Comms.prototype.emitToSingeSocket(connection_id, 'NewConnection', obj)
	}
	//next, tell them all the statues of stuff
	Comms.events.emit('SingleControllerConnected', connection_id);
=======
		Comms.prototype.emitToSingeSocket(connection, 'NewConnection', obj)
	}
	//next, tell them all the statues of stuff
	Comms.events.emit('SingleControllerConnected', connection);
>>>>>>> 2b367309f31c64725d9ba8a5b9951f07e622cace
	
}






//emit to all controllers, except one - perhaps the one that just registered?
Comms.prototype.emitToAllControllers = function(name, obj, exception){
	var cons = Comms.connections.getConnections()
	for (var key in cons) {
		if(cons[key].type=='controller' && exception!=key){
<<<<<<< HEAD
			Comms.prototype.emitToSingeSocket(cons[key].id, name, obj)
=======
			Comms.prototype.emitToSingeSocket(cons[key], name, obj)
>>>>>>> 2b367309f31c64725d9ba8a5b9951f07e622cace
		}
	}
}

//emit to all controllers, except one - perhaps the one that just registered?
Comms.prototype.emitToAllNodes = function(name, obj, exception){
	var cons = Comms.connections.getConnections()
	for (var key in cons) {
		if(cons[key].type=='node' && exception!=key){
			Comms.prototype.emitToSingeSocket(cons[key].id, name, obj)
		}
	}
}
//emit some info to a specific client
<<<<<<< HEAD
Comms.prototype.emitToSingeSocket = function(connection_id, name, obj){
	var cons = Comms.connections.getConnections()
	if(typeof cons[connection_id]!== 'undefined' && cons[connection_id].locale!='external'){
		cons[connection_id].socket.emit(name, obj)
=======
Comms.prototype.emitToSingeSocket = function(connection, name, obj){
	if(connection.locale=='internal'){
		connection.socket.emit(name, obj)
>>>>>>> 2b367309f31c64725d9ba8a5b9951f07e622cace
	}else{
		//this is an external socket, still send though
		Comms.external.EmitToSocket(connection_id, name, obj)
	}
}


<<<<<<< HEAD
=======
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
>>>>>>> 2b367309f31c64725d9ba8a5b9951f07e622cace







module.exports = function(io, events, connections, external, DB){
	return new Comms(io, events, connections, external, DB)
}