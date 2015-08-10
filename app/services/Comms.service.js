function Comms(socket, events){
	Comms.socket = socket;
	Comms.events = events
	Comms.hello = 'Hello World'


}

Comms.prototype.fakeCall = function(){
	Comms.events.on('yo', function(){
		console.log('the yo callback has made it: ' + Comms.hello)
	})

	Comms.events.on('yo', function(){
		console.log('another callback was made')
	})

}


module.exports = function(socket, events){
	return new Comms(socket, events)
}