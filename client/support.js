 $(function(){
 	var person = prompt("Please enter your name", "");
 	if(!person) person="Anonymous helper";
 	var socket = io('/support');



      socket.on('new customer', function(customer){
      		var name = customer.name;
      		var id = customer.id;

      		// todo: if it is the first client, make it active by default
  			var cls = '';
  			if( $('.customer-tabs li').length == 0 ){
  				cls = 'active';
  			}	

      		var tab = '<li role="presentation" class="'+cls+'"><a href="#' + id + '" role="tab" data-toggle="tab">' +
      				name + '</a></li>';

			var pane = $('<div role="tabpanel" class="tab-pane '+cls+'" id="'+ id +'"><ul></ul><input autocomplete="off" /><button>Send</button></div>');

      		pane.find('button').click(function() {
      			var now = new Date();
		      	var timeStamp = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
		        var msg = '[' + timeStamp + ']' + ' ' + person + '>> ' + pane.find('input').val()
		        socket.emit('message', {to: id, content: msg});
		        pane.find('ul').append($('<li>').text(msg));
		        pane.find('input').val('');
		        return false;
      		}) 	

			$('.customer-tabs').append( tab );
			$('.customer-panes').append(pane);
      });

      socket.on('message', function(msg){
      	console.log(msg)
      	//root message to propper tab
        $('#' + msg.from).find('ul').append($('<li>').text(msg.content));
      });
 })     