var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  socket.broadcast.emit('user connected');
  console.log('a user connected');
  socket.on('joined', function(name) {
    console.log(name + ' joined');
    var joined = 'SERVER: ' + name + ' has joined the chat!';
    socket.broadcast.emit('chat message', joined);
  });
  socket.on('disconnect', function() {
    io.emit('disconnected', 'A user has left the chat');
    console.log('user disconnected');
  });
  socket.on('gone', function(username) {
    console.log(username + ' disconnected');
  });
  socket.on('chat message', function(msg, cb) {
    console.log('message:', msg);
    setTimeout(function() {
      socket.broadcast.emit('chat message', msg);
      cb('recieved');
    }, 2000);
  });
  socket.on('typing', function(username) {
    socket.broadcast.emit('typing', username + ' is typing...');
  });
});

http.listen(3000, function() {
  console.log('listening on port 3000');
});
