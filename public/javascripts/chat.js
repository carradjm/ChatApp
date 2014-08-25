(function() {
  if (typeof ChatApp === "undefined") {
    window.ChatApp = {};
  };

  var Chat = ChatApp.Chat = function(socket) {
    this.socket = socket;
  };

  Chat.prototype.sendMessage = function(message) {
    var re = new RegExp("^/nick ");

    if (re.test(message)) {
      this.socket.emit("nicknameChangeRequest", message.slice(5));
    } else {
      this.socket.emit('message', message);
    }

  };

})();