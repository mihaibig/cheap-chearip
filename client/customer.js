 $(function(){
 	var person = prompt("Please enter your name", "");
 	if(!person) person="Anonymous client";
 	var socket = io('/customer');

 	socket.emit('i am', person);

      $('form').submit(function(){
      	var now = new Date();
      	var timeStamp = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
      	var msg = '[' + timeStamp + ']' + ' ' + person + '>> ' + $('#m').val()
        socket.emit('message', msg);
        $('#messages').append($('<li>').text(msg));
        $('#m').val('');
        return false;
      });
      socket.on('message', function(msg){
      	console.log(msg)
        $('#messages').append($('<li>').text(msg));
      });
 })     