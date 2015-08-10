function Commands(socket, events){
	Commands.socket = socket;
	Commands.events = events
}

Commands.prototype.amethod = function(){
	Commands.events.emit('yo')
}


module.exports = function(socket, events){
	return new Commands(socket, events)
}