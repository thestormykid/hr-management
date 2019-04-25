var attendance = require('../routes/views/attendance');

module.exports = {

	sendAttendance: function(socket, adminSocket) {

		socket.on('mark-attendance', function(data) {
			console.log(data);

			attendance.markAttendance(socket, adminSocket, data)
		})
	}
}
