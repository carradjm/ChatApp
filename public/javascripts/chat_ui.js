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
      data.forEach(function(user) {
        $(".users-list").append("<li>" + user + "</li>");
      });
    });

    socket.on('badCommand', function(message) {
      console.log("commandError fired");
      $(".message-list").append("<li><strong>" + message + "</strong></li>");
    })

    socket.on('nicknameChangeResult', function (data) {
      var $li = $(".users-list > li:contains(" + data.oldNickname + ")")
      $li.html(data.newNickname);
      $(".message-list").append("<li>" + data.oldNickname + " has changed their nickname to " + data.newNickname + "</li>");
    });

    socket.on('userLeft', function(nickname) {
      console.log('hiiiiiii');
      $(".message-list").append("<li>" + username + " disconnected</li>");
    });

    var chatUI =  new ChatUI(socket);

    $(".chat-form").on("submit", function (event) {
      event.preventDefault();
      chatUI.sendMessage();
    });
  });
})();