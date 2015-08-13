function Fans(Gpio, events){
	Fans.Gpio = Gpio
	Fans.events = events
	
	Fans.sweeps = new Gpio(17, 'high')
	Fans.sweepsSwitch = new Gpio(23, 'in', 'both');
	Fans.sweepLastUpdate = null;
	
	
	Fans.extractors = new Gpio(22, 'high')
	Fans.extractorsSwitch = new Gpio(24, 'in', 'both')
	Fans.extractorsLastUpdate = null;
	
	
	Fans.sweepsStatus = 0;
	Fans.extractorsStatus = 0;
	
	Fans.sweepsSwitch.watch(function (err, value) {
		var test = new Date().getTime();
		Fans.sweepLastUpdate = test
		setTimeout(function(){
			if(test==Fans.sweepLastUpdate){
				
				console.log('sweeps swicthed', value);
				if(Fans.sweepsStatus==0){
					Fans.prototype.sweepsOn();
				}else{
					Fans.prototype.sweepsOff();
				}
			}
		}, 500);
	})
	
	
	Fans.extractorsSwitch.watch(function (err, value) {
		var test = new Date().getTime();
		Fans.extractorsLastUpdate = test
		setTimeout(function(){
			if(test==Fans.extractorsLastUpdate){
				console.log('extractors swicthed', value);
				if(Fans.extractorsStatus==0){
					Fans.prototype.extractorsOn();
				}else{
					Fans.prototype.extractorsOff();
				}
			}
		}, 500);
	})
	
	
	
}
Fans.prototype.sweepsOn = function(){
	Fans.sweeps.write(0, function(){
		Fans.sweepsStatus = 1;
		Fans.events.emit('UpdateState', {
			node: 'sweeps',
			value: 1
		})
	})
}
Fans.prototype.sweepsOff = function(){
	Fans.sweepsStatus = 0;
	Fans.sweeps.write(1, function(){
		Fans.events.emit('UpdateState', {
			node: 'sweeps',
			value: 0
		})
	})	
}

Fans.prototype.extractorsOn = function(){
	Fans.extractors.write(0, function(){
		Fans.extractorsStatus = 1;
		Fans.events.emit('UpdateState', {
			node: 'extractors',
			value: 1
		})
	})
}
Fans.prototype.extractorsOff = function(){
	Fans.extractorsStatus = 0;
	Fans.extractors.write(1, function(){
		Fans.events.emit('UpdateState', {
			node: 'extractors',
			value: 0
		})
	})	
}





Fans.prototype.sweepsStatus = function(){
	Fans.sweeps.read(function(err, value){
		if(value==1){
			value = 0;
		}else{
			value = 1;
		}
		Fans.events.emit('UpdateState', {
			node: 'sweeps',
			value: value
		})
	})
	
}

Fans.prototype.extractorsStatus = function(){
	Fans.extractors.read(function(err, value){
		if(value==1){
			value = 0;
		}else{
			value = 1;
		}
		Fans.events.emit('UpdateState', {
			node: 'extractors',
			value: value
		})
	})
	
}


module.exports = function(Gpio, events){
	return new Fans(Gpio, events)
}