var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile(__dirname + '/client/customer.html');
});

app.use(express.static(__dirname + '/client'));

var supportSocket

var customerSockets = {}

io.of('/support').on('connection', function(socket){
	if(!supportSocket){
		supportSocket = socket;
		socket.on('message', function(msg){
			if(customerSockets[msg.to])
				customerSockets[msg.to].emit('message', msg);
		});
	}
	else{
		return
	}
});

io.of('/customer').on('connection', function(socket){
	socket.on('i am', function(name){
    	if(supportSocket){
			supportSocket.emit('new customer', {id: socket.id, name: name});
			customerSockets[socket.id] = socket;
			socket.on('message', function(msg){
				supportSocket.emit('message', {from: name, content: msg});
			});
		}
  	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
