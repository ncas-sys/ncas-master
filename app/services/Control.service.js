function Control(events, comms, connections, fans, DB){
	Control.DB = DB;
	Control.events = events;
	Control.comms = comms;
	Control.connections = connections
	Control.states = {
		connection: null,
		auditTemp: null,
		domes: null,
		sweeps: null,
		emo: null,
		heaters: null,
		beams: null,
		projectorPower: null,
		projectorShutter: null,
		extractors: null,
		lightingScene: null
	}
	
	Control.events.on('UpdateState', function(obj){
		Control.prototype.updateState(obj)
	})

	Control.events.on('ToMaster', function(obj){
		ToMaster(obj);
	})


	


	Control.events.on('SingleControllerConnected', function(connection_id){
		//tell this one guy about all the statues of the stuff
		for (var key in Control.states) {
			var obj = {
				node: key,
				value: Control.states[key]
			}
			Control.comms.emitToSingeSocket(connection_id, 'UpdateState', obj)
		}
	})
	
	
	Control.events.on('AuditDoorOpened', function(){
		//so we want to do anything?
		if(Control.states.domes==0 && Control.states.emo==0 && Control.states.lightingScene==null || Control.states.lightingScene=='LightingScene1'){
			PerformAction('LightingScene2');
		}
	})
	
	
	Control.events.on('LightingScene1', function(){
		Control.states.lightingScene = 'LightingScene1';
		Control.events.emit('UpdateState', {node: "lightingScene", value: "B/O"});
	})
	Control.events.on('LightingScene2', function(){
		Control.states.lightingScene = 'LightingScene2';
		Control.events.emit('UpdateState', {node: "lightingScene", value: "Walkers"});
	})
	Control.events.on('LightingScene3', function(){
		Control.states.lightingScene = 'LightingScene3';
		Control.events.emit('UpdateState', {node: "lightingScene", value: "House 1/2"});
	})
	Control.events.on('LightingScene4', function(){
		Control.states.lightingScene = 'LightingScene4';
		Control.events.emit('UpdateState', {node: "lightingScene", value: "Conf 1"});
	})
	Control.events.on('LightingScene5', function(){
		Control.states.lightingScene = 'LightingScene5';
		Control.events.emit('UpdateState', {node: "lightingScene", value: "Conf 2"});
	})
	Control.events.on('LightingScene6', function(){
		Control.states.lightingScene = 'LightingScene6';
		Control.events.emit('UpdateState', {node: "lightingScene", value: "Conf 3"});
	})
	
	
	fans.sweepsStatus();
	fans.extractorsStatus();
}

Control.prototype.updateState = function(obj){
	Control.states[obj.node] = obj.value;
	Control.comms.emitToAllControllers('UpdateState', obj, false);
}


ToMaster = function(obj){
	if(obj.event=='code'){
		Control.DB.getCode(obj.load).then(function(codes){
			if(codes.length==1){
				//yay this is a code, so what does it do?
				var code = codes[0];
				if(code.action=="macro"){
					//we're going to be doing some thing
					for (var key in code.events) {
						PerformAction(code.events[key]);
					}
					Control.comms.emitToSingeSocket(obj.conn_id, 'CodeSuccess', null);
				}
				if(code.action=="auth"){
					//update a controller's auth
					Control.connections.setAuth(obj.conn_id, code.level);
					var emit = {
						conn_id: obj.conn_id,
						level: code.level
					}
					Control.comms.emitToAllControllers('UpdateControllerAuth', emit, null);
				}
			}else{
				//there was an error
				Control.comms.emitToSingeSocket(obj.conn_id, 'NoCode', null);
			}
		})
	}else if(obj.event=='command'){
		var controller = Control.connections.getConnection(obj.conn_id);
		var myAuth = controller.auth;
		Control.DB.getCommand(obj.load).then(function(commands){
			if(commands.length!=1){
				Control.comms.emitToSingeSocket(obj.conn_id, 'Error', {message: "No Such Command"});
			}else{
				var command = commands[0];
				if(command.auth=='admin' && myAuth=='user'){
					Control.comms.emitToSingeSocket(obj.conn_id, 'Error', {message: "Unprivileged"});
				}else{
					//we can do this
					if(command.type=='command'){
						PerformAction(obj.load);
					}else if(command.type=='macro'){
						for (var key in command.events) {
							PerformAction(command.events[key]);
						}
					}
				}
			}
		});
		//PerformAction(obj.load);
	
	}else if(obj.event=='LogOut'){
		Control.connections.setAuth(obj.conn_id, 'none');
		var emit = {
			conn_id: obj.conn_id,
			level: 'none'
		}
		Control.comms.emitToAllControllers('UpdateControllerAuth', emit, null);
	}
}

PerformAction = function(action){
	Control.events.emit(action);
	Control.comms.emitToAllNodes(action, null, null);
}




module.exports = function(events, comms, connections, fans, DB){
	return new Control(events, comms, connections, fans, DB)
}