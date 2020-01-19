var socket = io('http://localhost:%PORT%');
socket.on('browsercli:runscript', function(data) {
  eval(data);
});
