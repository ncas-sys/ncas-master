function Control(events, comms, connections, fans){
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
	Control.events.on('SingleControllerConnected', function(connection){
		//tell this one guy about all the statues of the stuff
		for (var key in Control.states) {
			var obj = {
				node: key,
				value: Control.states[key]
			}
			Control.comms.emitToSingeSocket(connection, 'UpdateState', obj)
		}
		
	})
	
	fans.sweepsStatus();
	fans.extractorsStatus();
}

Control.prototype.updateState = function(obj){
	Control.states[obj.node] = obj.value;
	Control.comms.emitToAllControllers('UpdateState', obj, false);
}








module.exports = function(events, comms, connections, fans){
	return new Control(events, comms, connections, fans)
}