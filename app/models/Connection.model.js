function Ui(socket, type, name, locale, ip, id){
	this.socket = socket;
	if(typeof id=='undefined'){
		this.id = makeid()
	}else{
		this.id = id;
	}
	this.auth = 'none';
	this.type=type;
	this.name=name;
	this.locale = locale
	this.ip = ip
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