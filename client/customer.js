$(function() {
	var socket = io('/customers');
	$('#chat').hide();
	var chatInput = $('#chat input')
	var nickname;
	
	$('#login form').submit(function(){
		nickname = $('#login input').val();
		$('#chat').show();
		$('#login').hide();
		socket.emit('i am', nickname);
		return false;
	});

	$('#chat form').submit(function(){
		var line = chatInput.val()
		socket.emit('message', {from: nickname, content: line});
		$('#messages').append($('<li>').text(nickname + ': ' + line));
		chatInput.val('');
		return false;
	});

	socket.on('message', function(msg){
		console.log(msg)
		$('#messages').append($('<li>').text(msg.from + ': ' + msg.content));
	});
})

