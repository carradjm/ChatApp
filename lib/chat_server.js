//chat_server.js

function chatServer (server) {
  var io = require('socket.io').listen(server);
  var _ = require('./underscore.js');

  var that = this;
  this.guestNumber = 1;
  this.nicknames = {};
  this.rooms = {};

  io.on('connection', function (socket) {
    var nickname = "guest" + that.guestNumber;
    that.nicknames[socket.id] = nickname;
    that.guestNumber++;
    socket.room = "lobby";
    socket.justJoined = true

    socket.on('join', function(data) {
      joinRoom(this, data);
      socket.emit('joinedRoom', data);

      io.sockets.in(this.room).emit('newConnection', {
        roomUsers: that.rooms[data],
        user: that.nicknames[socket.id]
      });
    });

    function joinRoom(socket, room) {
      var nickname = that.nicknames[socket.id];
      var oldRoom = socket.room;
      if (!socket.justJoined) {
        socket.leave(socket.room, function () {
          io.sockets.in(oldRoom).emit('userLeftRoom', nickname);
        });
      }
      socket.justJoined = false;
      that.rooms[room] = that.rooms[room] || [];
      socket.join(room);
      socket.room = room;
      var nickname = that.nicknames[socket.id];
      that.rooms[room].push(nickname);
    }

    socket.on('message', function (data) {
      io.sockets.in(this.room).emit('message', {text: data, username: that.nicknames[socket.id], room: this.room});
    });

    socket.on('nicknameChangeRequest', function(nickname) {
      var oldNickname = that.nicknames[socket.id];
      if (_.contains(_.values(that.nicknames), nickname)) {
        socket.emit('nicknameChangeResult', nickname + " has already been taken.");
      } else {
        io.sockets.in(this.room).emit('nicknameChangeResult', {
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
      _.values(that.rooms).forEach(function(room) {
        console.log(room)
        var idx = room.indexOf(that.nicknames[socket.id]);
        if (idx !== -1) {
          room = room.splice(idx + 1);
          console.log(room)
        }
      });

      io.sockets.emit('userLeftRoom', that.nicknames[socket.id]);

      delete that.nicknames[socket.id];
    });
  });
}

module.exports = chatServer;
