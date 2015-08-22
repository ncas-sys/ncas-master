function Fans(Gpio, events){
	Fans.Gpio = Gpio
	Fans.events = events
	
	Fans.sweeps = new Gpio(4, 'high')
	Fans.sweepsSwitch = new Gpio(27, 'in', 'both');
	Fans.sweepLastUpdate = null;
	Fans.sweepSwitchLast = null;
	
	
	Fans.extractors = new Gpio(17, 'high')
	Fans.extractorsSwitch = new Gpio(22, 'in', 'both')
	Fans.extractorsLastUpdate = null;
	Fans.extractorsSwitchLast = null;
	
	
	Fans.sweepsStatus = 0;
	Fans.extractorsStatus = 0;
	
	Fans.sweepsSwitch.watch(function (err, value) {
		var test = new Date().getTime();
		Fans.sweepLastUpdate = test
		setTimeout(function(){
			if(test==Fans.sweepLastUpdate && value!=Fans.sweepsSwitchLast){
				Fans.sweepsSwitchLast = value;
				//console.log('sweeps swicthed', value);
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
			if(test==Fans.extractorsLastUpdate &&  value!=Fans.extractorsSwitchLast){
				//console.log('extractors swicthed', value);
				Fans.extractorsSwitchLast = value;
				if(Fans.extractorsStatus==0){
					Fans.prototype.extractorsOn();
				}else{
					Fans.prototype.extractorsOff();
				}
			}
		}, 500);
	})
	
	Fans.sweeps.read(function(err, value){
		Fans.sweepSwitchLast = value;
	})
	Fans.extractors.read(function(err, value){
		Fans.extractorsSwitchLast = value;
	})
	
	
	Fans.events.on('SweepsOn', function(){
		Fans.prototype.sweepsOn()
	})
	Fans.events.on('SweepsOff', function(){
		Fans.prototype.sweepsOff()
	})
	Fans.events.on('ExtractorsOn', function(){
		Fans.prototype.extractorsOn()
	})
	Fans.events.on('ExtractorsOff', function(){
		Fans.prototype.extractorsOff()
	})
	
	
	
	//switches
	
	Fans.events.on('SweepsSwitch', function(){
		if(Fans.sweepsStatus==1){
			Fans.prototype.sweepsOff();
		}else{
			Fans.prototype.sweepsOn();
		}
	})
	
	Fans.events.on('ExtractorsSwitch', function(){
		if(Fans.extractorsStatus==1){
			Fans.prototype.extractorsOff();
		}else{
			Fans.prototype.extractorsOn();
		}
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