$(function() {
	var socket = io();
	var chatInput = $('#chat input')

	$('#chat form').submit(function(){
		socket.emit('message', {
			from: user,
			content: chatInput.val()
		});
		chatInput.val('');
		return false;
	});

	socket.on('chat message', function(msg){
		$('#messages').append($('<li>').text(msg));
	});
})

