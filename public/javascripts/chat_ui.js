(function() {
  if (typeof ChatApp === "undefined") {
    window.ChatApp = {}
  };

  var ChatUI = ChatApp.ChatUI = function(socket) {
    this.chat = new ChatApp.Chat(socket);
  };

  ChatUI.prototype.getMessage = function () {
    return $(".messageBox").val();
  };

  ChatUI.prototype.sendMessage = function () {
    var message = this.getMessage()
    this.chat.sendMessage(message);
    $(".messageBox").val("");
  };

  $(document).ready(function () {
    var socket = io();

    socket.on('message', function(data) {
      $(".message-list").append("<li><strong>" + data.username + "</strong>: " + data.text + "</li>");
    });

    socket.on('newConnection', function(data) {
      $(".users-list").html("");
      data.roomUsers.forEach(function(user) {
        $(".users-list").append("<li>" + user + "</li>");
      });
      $(".message-list").append("<li><strong>" + data.user + " has joined the room</strong></li>");
    });

    socket.on('badCommand', function(message) {
      $(".message-list").append("<li><strong>" + message + "</strong></li>");
    })

    socket.on('userLeftRoom', function(nickname) {
      var $li = $(".users-list > li:contains(" + nickname + ")")
      $li.remove();
      $(".message-list").append("<li><strong>" + nickname + " has left the room.</strong></li>");
    });

    socket.on("joinedRoom", function(room) {
      $('.room').html("<h2>" + room + "</h2>");
      $(".message-list").html("");
    })

    socket.on('nicknameChangeResult', function (data) {
      var $li = $(".users-list > li:contains(" + data.oldNickname + ")")
      $li.html(data.newNickname);
      $(".message-list").append("<li><strong>" + data.oldNickname + "</strong> has changed their nickname to <strong>" + data.newNickname + "</strong></li>");
    });

    var chatUI = new ChatUI(socket);

    $(".chat-form").on("submit", function (event) {
      event.preventDefault();
      chatUI.sendMessage();
    });
  });
})();