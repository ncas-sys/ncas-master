function Ui(socket, type, name, locale){
	this.socket = socket;
	this.connection_id = makeid(),
	this.auth = 'none';
	this.type=type;
	this.name=name;
	this.locale = locale
	
}



function makeid(){
	var mstime = new Date().getTime()
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text + mstime;
}


module.exports = Ui