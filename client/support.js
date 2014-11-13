$(function() {
	var socket = io('/support');
	var name = '' + Math.random();
	socket.on('new customer', function(customerData){
		console.log(customerData)
	})
	socket.on('message', function(msg){
		$('#messages').append($('<li>').text(msg));
	});
	socket.emit('i am', name);
	$('form').submit(function(){
		socket.emit('chat message', $('#m').val());
		$('#m').val('');
		return false;
	});
	
})

