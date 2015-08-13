var connectionM = require('../models/Connection.model');
function Connections(){
	c = this;
	c.connections = {}

}

Connections.prototype.newConnection = function(socket, obj, ip){
	var newCon = new connectionM(socket, obj.type, obj.name, obj.locale, ip);
	c.connections[newCon.connection_id] = newCon;
	//alert all sockets about the new user
	var obj = {
		name: newCon.name,
		type: newCon.type,
		auth: newCon.auth,
		locale: newCon.locale,
		id: newCon.connection_id,
		ip: newCon.ip
	}
	return newCon;
}
Connections.prototype.deleteConnection = function(con_id){
	delete c.connections[con_id]
}

Connections.prototype.getConnections = function(){
	return c.connections;
}
Connections.prototype.AuthAttempt = function(password, conenction){
	console.log(c.connections[conenction].name, 'is attempting to auth with', password)
}



module.exports = function(){
	return new Connections();
}