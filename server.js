var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile(__dirname + '/client/customer.html');
});

app.use(express.static(__dirname + '/client'));

var supportSocket = null

var customerSockets = {}

io.of('/support').on('connection', function(socket){
	if(!supportSocket){
		supportSocket = socket;
		socket.on('message', function(msg){
			if(customerSockets[msg.to])
				customerSockets[msg.to].emit('message', msg.content);
		});
		socket.on('disconnect', function () {
			supportSocket = null;
		});
	}
	else {
		socket.disconnect();
	}
});

io.of('/customer').on('connection', function(socket){
	if(supportSocket){
		socket.on('i am', function(name){
			supportSocket.emit('new customer', {id: socket.id, name: name});
			customerSockets[socket.id] = socket;
			socket.on('message', function(msg){
				supportSocket.emit('message', {from: socket.id, content: msg});
			});
			socket.on('disconnect', function () {
				delete customerSockets[socket.id];
			});
		});
	} else {
		socket.disconnect();
	}
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
