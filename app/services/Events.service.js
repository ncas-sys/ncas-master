function Events(){
	Events.events = {}

}

Events.prototype.on = function(name, callback){

	if(typeof Events.events[name] == 'undefined'){
		Events.events[name] = []
		Events.events[name].push(callback)
	}else{
		Events.events[name].push(callback)
	}

}

Events.prototype.emit = function(name){
	if(typeof Events.events[name] == 'object'){
		//we have some options

		for (var key in Events.events[name]) {
			if(typeof Events.events[name][key] == 'function'){
				Events.events[name][key]()
			}
		}

	}
}

module.exports = function(){
	return new Events()
}