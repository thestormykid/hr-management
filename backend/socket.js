var emiters = require('./sockets/emitter');
var listeners = require('./sockets/listener');

function onUserConnect(socket, adminSocket) {
	listeners.sendAttendance(socket, adminSocket);

}

function onAdminConnect(socket, userSocket) {
	listeners.sendNotification(socket, userSocket);
}

module.exports = function(io) {

	var userSocket = io.of('/user');
	var adminSocket = io.of('/admin');

	userSocket.on('connection', function(socket) {
		// console.log(socket)
		console.log('user socket connected');

		socket.on('disconnect', function() {
			console.log('user socket disconnected');
		})

		onUserConnect(socket, adminSocket);
	})

	adminSocket.on('connection', function(socket) {

		console.log('admin socket connected')

		socket.on('disconnect', function() {
			console.log('admin socket disconnected');
		})

		onAdminConnect(socket, userSocket);
	})
}
