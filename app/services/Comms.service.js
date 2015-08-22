function Comms(io, events, connections, external, DB){
	Comms.events = events;
	Comms.connections = connections
	Comms.external = external

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

	Comms.events.on('SetInitialLightingPosition', function(){
		Comms.prototype.emitToAllControllers('UpdateState', {"node":"lightingScene", "value": "B/0"})
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
		Comms.prototype.emitToSingeSocket(connection_id, 'NewConnection', obj)
	}
	//next, tell them all the statues of stuff
	Comms.events.emit('SingleControllerConnected', connection_id);
	
}






//emit to all controllers, except one - perhaps the one that just registered?
Comms.prototype.emitToAllControllers = function(name, obj, exception){
	var cons = Comms.connections.getConnections()
	for (var key in cons) {
		if(cons[key].type=='controller' && exception!=key){
			Comms.prototype.emitToSingeSocket(cons[key].id, name, obj)
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
Comms.prototype.emitToSingeSocket = function(connection_id, name, obj){
	var cons = Comms.connections.getConnections()
	if(typeof cons[connection_id]!== 'undefined' && cons[connection_id].locale!='external'){
		cons[connection_id].socket.emit(name, obj)
	}else{
		//this is an external socket, still send though
		Comms.external.EmitToSocket(connection_id, name, obj)
	}
}








module.exports = function(io, events, connections, external, DB){
	return new Comms(io, events, connections, external, DB)
}