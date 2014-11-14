 $(function(){
 	var person = prompt("Please enter your name", "");
 	if(!person) person="Anonymous helper";
 	var socket = io('/support');
      $('form').submit(function(){
      	var now = new Date();
      	var timeStamp = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        var msg = '[' + timeStamp + ']' + ' ' + person + '>> ' + $('#m').val()
        socket.emit('chat message', msg);
        $('#messages').append($('<li>').text(msg));
        $('#m').val('');
        return false;
      });
      socket.on('chat message', function(msg){
      	console.log(msg)
        $('#messages').append($('<li>').text(msg));
      });
 })     