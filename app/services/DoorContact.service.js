function DoorContact(Gpio, events){
	DoorContact.Gpio = Gpio
	DoorContact.events = events
	DoorContact.lastUpdate = 0;
	
	DoorContact.position = null;
	
	DoorContact.latch = new Gpio(24, 'in', 'both');
	
	
	DoorContact.latch.watch(function (err, value) {
		var test = new Date().getTime();
		DoorContact.lastUpdate = test
		setTimeout(function(){
			if(test==DoorContact.lastUpdate && value!=DoorContact.lastUpdate){
				DoorContact.position = value;
				if(DoorContact.position==0){
					DoorContact.events.emit('AuditDoorOpened');
				}
				
			}
		}, 1000);
	})
	
	DoorContact.latch.read(function(err, value){
		DoorContact.position = value;
	})
	
	
}

module.exports = function(Gpio, events){
	return new DoorContact(Gpio, events)
}