$(function() {
	var socket = io('/support');
	
	$('#chat').hide();
	var nickname;
	
	$('#login form').submit(function(){
		nickname = $('#login input').val();
		$('#chat').show();
		$('#login').hide();
		socket.emit('i am', nickname);
		return false;
	});

	socket.on('new customer', function(customer) {
		console.log(customer);
		var win = $($('script[type="text/template"]').text()).prop('id', customer.name)
		win.find('button').click(function(){
			var line = win.find('input').val()
			socket.emit('message', {from: nickname, content: line, id: customer.id});
			win.find('ul').append($('<li>').text(nickname + ': ' + line));
			win.find('input').val('');
			return false;
		});
		$('#chat').append(win)
	})

	socket.on('message', function(msg){
		$('#' + msg.from).find('ul').append($('<li>').text(msg.from + ': ' + msg.content));
	});

	socket.on('customer left', function(name){
		$('#' + name).remove();
	});
	
})

