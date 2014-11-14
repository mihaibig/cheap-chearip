var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname + '/client'))

var resourceManager = require('./server/resources.js')({
	canAllocate: function(resData) {return resData.usedBy <= 3;},
	numberOfRetries: 100,
	timeBetweenRetries: 1000
});

var customers = {}

io.of('/customers').on('connection', function(customerSocket) {
	customerSocket.on('i am', function(name) {		
		resourceManager.aquire(function(err, resData) {
			var supportSocket = resData.res;
			var supportName = resData.name
			if(!err) {	
				supportSocket.emit('new customer', {name: name, id: customerSocket.id});
				customers[customerSocket.id] = customerSocket
				console.log('Customer ' + name + " connected and assigned... " + customerSocket.id);
				customerSocket.on('message', function(msg) {
					console.log(msg);
					supportSocket.emit('message', msg);
				});

				customerSocket.on('disconnect', function () {
					delete customers[customerSocket.id];
					supportSocket.emit('customer left', name);	
					resourceManager.release(supportName);
				});
			}						
		});
	});
});

io.of('/support').on('connection', function(supportSocket) {
	supportSocket.on('i am', function(name){
		resourceManager.add(name, supportSocket);
		console.log('Support ' + name + " connected and registered...");
		supportSocket.on('message', function(msg) {
			console.log(msg)
			if(customers[msg.id]) {
				customers[msg.id].emit('message', {from: name, content: msg.content});							
			}
		});		
		supportSocket.on('disconnect', function () {
			resourceManager.remove(name);
		});		
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
