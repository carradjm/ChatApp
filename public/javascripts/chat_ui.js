(function() {
  if (typeof ChatApp === "undefined") {
    window.ChatApp = {}
  };

  var ChatUI = ChatApp.ChatUI = function(socket) {
    this.chat = new ChatApp.Chat(socket);
  };

  ChatUI.prototype.getMessage = function () {
    return $(".messageBox").val();
  }

  ChatUI.prototype.sendMessage = function () {
    var message = this.getMessage()
    this.chat.sendMessage(message);
  }

  $(document).ready(function () {
    var socket = io();
    socket.on('message', function(data) {
      console.log(data)
      $(".message-list").append("<li>" + data.text + "</li>");
    });

    var chatUI =  new ChatUI(socket);

    $(".chat-form").on("submit", function (event) {
      event.preventDefault();
      chatUI.sendMessage();
    });
  });
})();