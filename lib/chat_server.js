//chat_server.js

function chatServer (server) {

  var io = require('socket.io').listen(server);

  io.sockets.on('connection', function (socket) {
    socket.on('message', function (data) {
      io.sockets.emit('message', {text: data});
    })
  })
}

module.exports = chatServer;
