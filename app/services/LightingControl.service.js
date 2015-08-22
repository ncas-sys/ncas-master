var q = require('q');
function Lighting(Gpio, events){
	Lighting.Gpio = Gpio
	Lighting.events = events
	
	Lighting.controller = new Gpio(23, 'low');
	
	
	Lighting.events.on('LightingScene1', function(){
		Lighting.prototype.Scene1();
	})
	Lighting.events.on('LightingScene2', function(){
		Lighting.prototype.Scene2();
	})
	Lighting.events.on('LightingScene3', function(){
		Lighting.prototype.Scene3();
	})
	Lighting.events.on('LightingScene4', function(){
		Lighting.prototype.Scene4();
	})
	
	setTimeout(function(){
		Lighting.prototype.Scene1();
		Lighting.events.emit('SetInitialLightingPosition');
		Lighting.events.emit('UpdateState', {node: "lightingScene", value: "B/O"});
	}, 5000);
	
	
	
}
Lighting.prototype.Scene1 = function(){
	Lighting.prototype.pressButton();
}
Lighting.prototype.Scene2 = function(){
	Lighting.prototype.pressButton().then(function(){
		return Lighting.prototype.pressButton();
	});
}
Lighting.prototype.Scene3 = function(){
	Lighting.prototype.pressButton().then(function(){
		return Lighting.prototype.pressButton();
	}).then(function(){
		return Lighting.prototype.pressButton();
	});
}
Lighting.prototype.Scene4 = function(){
	Lighting.prototype.pressButton().then(function(){
		return Lighting.prototype.pressButton();
	}).then(function(){
		return Lighting.prototype.pressButton();
	}).then(function(){
		return Lighting.prototype.pressButton();
	});
}


Lighting.prototype.pressButton = function() {
	var def = q.defer();
	Lighting.controller.write(1, function(){
		setTimeout(function(){
			Lighting.controller.write(0, function(){
				setTimeout(function(){
					def.resolve(true)
				}, 150);	
			});
		}, 10);
	})
	return def.promise;
};



module.exports = function(Gpio, events){
	return new Lighting(Gpio, events)
}