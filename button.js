var rpio = require('rpio');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var buttonPin = 7;
var ledPin = 11;

rpio.open(buttonPin, rpio.INPUT, rpio.PULL_DOWN);
rpio.open(ledPin, rpio.OUTPUT, rpio.LOW);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

function pollcb(cbpin) {
  var state = rpio.read(cbpin) ? 1 : 0;

  if (state == 1) {
    console.log('button pressed');
    rpio.write(ledPin, rpio.HIGH);
    io.emit('someone pressed the button', msg);
  } else {
    console.log('button released');
    rpio.write(ledPin, rpio.LOW);
    io.emit('someone released the button', msg);
  }
}

rpio.poll(buttonPin, pollcb);


io.on('connection', function(socket){
  //on user connect
  io.emit('chat message', 'a new user has connected');
  console.log('a new user has connected');

  //on message
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    if (msg == 'button on') {
      rpio.write(ledPin, rpio.HIGH);
    }

    if (msg == 'button off') {
      rpio.write(ledPin, rpio.LOW);
    }
  });

  //on disconnect
  socket.on('disconnect', function(){
    io.emit('chat message', 'user disconnected');
  });

});

io.emit('some event', { for: 'everyone' });

http.listen(3000, function(){
  console.log('listening on *:3000');
});
