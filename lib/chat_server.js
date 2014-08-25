//chat_server.js

function chatServer (server) {
  this.guestNumber = 1;

  this.nicknames = {};

  var io = require('socket.io').listen(server);

  var _ = require('./underscore.js');

  var that = this;

  io.sockets.on('connection', function (socket) {
    var nickname = "guest" + that.guestNumber;
    that.nicknames[socket.id] = nickname;
    that.guestNumber++;
    console.log(that.nicknames);

    socket.on('message', function (data) {
      io.sockets.emit('message', {text: data});
    });

    socket.on('nicknameChangeRequest', function(nickname) {
      console.log(nickname)
      if (_.contains(_.values(that.nicknames), nickname)) {
        socket.emit('nicknameChangeResult', {
          success: false,
          message: 'Name already taken.'
        });
      } else {
        socket.emit('nicknameChangeResult', {
          success: true,
          message: 'Name change complete.'
        });
        that.nicknames[socket.id] = nickname;
      }
      console.log(that.nicknames);
    });
  });

}

module.exports = chatServer;
