//chat_server.js

function chatServer (server) {
  var io = require('socket.io').listen(server);
  var _ = require('./underscore.js');

  var that = this;
  this.guestNumber = 1;
  this.nicknames = {};

  io.on('connection', function (socket) {
    var nickname = "guest" + that.guestNumber;
    that.nicknames[socket.id] = nickname;
    that.guestNumber++;

    io.sockets.emit('newConnection', _.values(that.nicknames));

    socket.on('message', function (data) {
      io.sockets.emit('message', {text: data, username: that.nicknames[socket.id]});
    });

    socket.on('nicknameChangeRequest', function(nickname) {
      var oldNickname = that.nicknames[socket.id];
      if (_.contains(_.values(that.nicknames), nickname)) {
        socket.emit('nicknameChangeResult', nickname + " has already been taken.");
      } else {
        io.sockets.emit('nicknameChangeResult', {
          oldNickname: oldNickname,
          newNickname: nickname
        });
        that.nicknames[socket.id] = nickname;
      }
    });

    socket.on('commandError', function(message) {
      socket.emit('badCommand', message);
    });

    socket.on('disconnect', function() {
      console.log(socket.id + " disconnecting...");
      //io.sockets.emit('userLeft', that.nicknames[socket.id]);
      //notifyLeft(socket);
      delete that.nicknames[socket.id];
    });

    function notifyLeft (socket) {
      io.sockets.emit('userLeft', that.nicknames[socket.id]);
    }
  });
}

module.exports = chatServer;
