var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {}; 

app.get('/', function(req, res){
  res.send('server is running');
});

io.on("connection", function (client) {  
    client.on("join", function(name){
    	
			for(var k in clients) {
				if(clients[k]==name){
					console.log('Este nome de usuário já está em uso');
					return client.emit('update', "Este nome de usuário já está em uso");					
				}
			}			
		console.log("Joined: " + name);
        clients[client.id] = name;
		
        client.emit("update", "Você se conectou ao bate-papo.");
        client.emit("update", "" ,clients);
		client.broadcast.emit("update", name + " Se juntou ao bate-papo",clients);
		
		console.log(clients);
    });

    client.on("send", function(msg){
    	console.log("Message: " + msg);
        client.broadcast.emit("chat", clients[client.id], msg);
    });

    client.on("disconnect", function(){
		var nome=clients[client.id];
		if( nome!=undefined){
			console.log(nome);
			console.log("Disconnect");
			io.emit("update", clients[client.id] + " Deixou o bate-papo.");
			//tirando usuario da lista
			delete clients[client.id];
			client.broadcast.emit("update","",clients);
		}
        
    });
});


http.listen(3000, function(){
  console.log('listening on port 3000');
});
