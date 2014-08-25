(function() {
  if (typeof ChatApp === "undefined") {
    window.ChatApp = {};
  };

  var Chat = ChatApp.Chat = function(socket) {
    this.socket = socket;
  };

  Chat.prototype.sendMessage = function(message) {
    var re = new RegExp("^/");

    if (re.test(message)) {
      this.processCommand(message);
    } else {
      this.socket.emit('message', message);
    }
  };

  Chat.prototype.processCommand = function(command) {
    if (command.slice(1, 5) === 'nick') {
      this.socket.emit('nicknameChangeRequest', command.slice(6));
    } else {
      this.socket.emit('commandError', "Invalid command")
    }
  }
})();