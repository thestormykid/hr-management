var attendance = require('../routes/views/attendance');
var notification = require('../routes/views/notification');

module.exports = {

	sendAttendance: function(userSocket, adminSocket) {

		userSocket.on('mark-attendance', function(data) {

			attendance.markAttendance(userSocket, adminSocket, data)
		})
	},

	sendNotification: function(adminSocket, userSocket) {

		adminSocket.on('send-notification', function(notif, token) {

			notification.sendNotification(adminSocket, userSocket, notif, token)
		})
	}
}
