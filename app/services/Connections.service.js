var connectionM = require('../models/Connection.model');
var q = require('q');

function Connections(events){
	c = this;
	c.connections = {}
	c.events = events
}


Connections.prototype.newConnection = function(socket, obj){
	var newCon = new connectionM(socket, obj.type, obj.name, obj.locale, obj.ip, obj.id);
	c.connections[newCon.id] = newCon;
	var obj = {
		name: newCon.name,
		type: newCon.type,
		auth: newCon.auth,
		locale: newCon.locale,
		id: newCon.id,
		ip: newCon.ip
	}
	c.events.emit('WelcomeController', obj)
	return newCon;
}

Connections.prototype.deleteConnection = function(con_id){
	c.events.emit('ConnectionGone', con_id)
	delete c.connections[con_id]
}

Connections.prototype.getConnections = function(){
	return c.connections;
}

Connections.prototype.setAuth = function(conn_id, auth){
	c.connections[conn_id].auth = auth;
}

Connections.prototype.getConnection = function(conn_id){
	return c.connections[conn_id];
}

Connections.prototype.wipeAllExistingExternalConnections = function(tellPeople){
	var def = q.defer();
	for (var key in c.connections) {
		if(c.connections[key].locale=='external'){
			if(tellPeople){
				Connections.prototype.deleteConnection(key)
			}else{
				delete c.connections[key];	
			}
		}
	}
	def.resolve(true);
	return def.promise;
}




Connections.prototype.DeleteExternalConnection = function(con_id){
	c.events.emit('ConnectionGone', con_id)
	delete c.connections[con_id]
}



module.exports = function(events){
	return new Connections(events);
}