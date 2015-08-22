function External(esocket, connections, events){
	External.socket = esocket;
	External.connections = connections;
	External.events = events;
	
	connect()
}

connect = function(){
	External.socket.on('Welcome', function(){
		//register my stuff here
		var obj = {
			ref: 'ncas'
		}
		External.connections.wipeAllExistingExternalConnections(true).then(function(){
			External.socket.emit('Register', obj)
		})
	})
	
	External.socket.on('disconnect', function(){
		External.connections.wipeAllExistingExternalConnections(true)
	})
	External.socket.on('AddExternalConnection', function(obj){
		External.connections.newConnection('external',obj);
	})
	External.socket.on('DeleteExternalConnection', function(connection_id){
		External.connections.deleteConnection(connection_id);
	})

	External.socket.on('ToMaster', function(obj){
		External.events.emit('ToMaster', obj);
	})
	
	


	
	
}


External.prototype.EmitToSocket = function(connection_id, name, obj){
	var emit = {
		connection_id: connection_id,
		name: name,
		obj: obj
	}
	External.socket.emit('EmitToConnection', emit)
}



module.exports = function(esocket, connections, events){
	return new External(esocket, connections, events);
}