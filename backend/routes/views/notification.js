var Notification 	= require('../../model/notification');
var Employee 		= require('../../model/employee');
var ObjectId 			= require('mongodb').ObjectID;
var jwtDecode 			= require('jwt-decode');
var path = require('path');



module.exports = {

	sendNotification: function(adminSocket, userSocket, notif, token) {
		Employee.aggregate([{

			$project: {_id: 1}

		}], function(err, empIdsList) {
			if (err) {
				console.log(err);
				return adminSocket.emit('get-notif-ack', {status: 500, message: 'internal server error'});

			}

			notif.sendedEmployees = [];
			notif.openedEmployees = [];

			empIdsList.forEach(function(empId) {
				notif.sendedEmployees.push(empId._id);
			})

			Notification.create(notif, function(err, notificationAdded) {
				if (err) {
				 	console.log(err);
				 	return	adminSocket.emit('get-notif-ack', {status: 500, message: 'internal server error'});

				}

				userSocket.emit('notification-added', {status: 200, message:'check notification box added by the admin'});
				return adminSocket.emit('get-notif-ack', {status: 200, message: 'notification sended successfully'})
			})
		})
	},

	getAllNotification: function(req, res) {
		var user = req.user;
		console.log(user._id);
		Notification.aggregate([
		{
			$project: {
				message: 1,
				opened: {
					// $or: ['sendedEmployees', user._id]
					$filter: {
						input: '$sendedEmployees',
						as: 'emp',
						cond: {$eq: ['$$emp', ObjectId(user._id)]}
					}
					// $cond: [{$or:['sendedEmployees', "asdjlkashdkjashdskj"]}, true, false ]
				}
			 }
		}], function(err, allNotification) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.status(200).json({ data: allNotification});
		})

		// Notification.find({  }, function(err, allNotification) {
		// 	if (err) {
		// 		console.log(err);
		// 		return res.status(500).json('internal server error');
		// 	}


		// })
	},
	pixelCode: function(req, res) {

		var token = req.query.token;
		var notifId = ObjectId(req.query.id);
		var user = jwtDecode(token).sub;

		console.log(user);

		Notification.update({_id: notifId}, {

				$push: {openedEmployees: ObjectId(user)}

			,
				$pull: {sendedEmployees: ObjectId(user)}

		}, function(err, result) {
			if (err) {
				return res.json(err);
			}

			return	res.sendFile(path.join(__dirname + '../../../public/pixel.png'));
			// return res.json(result);
		})


		// Notification.update([{

		// 	$match: { _id: notifId}

		// }, {

		// 	$pull: { sendedEmployees: ObjectId(user._id) }

		// },{
		// 	$push: {openedEmployees: ObjectId(user._id)}

		// }],function(err, checkNotificationOpened) {
		// 	if (err) {
		// 		console.log(err);
		// 		return res.status(500).json(err)
		// 	}


		// 	return res.status(200).json(checkNotificationOpened);
		// })

	}
}
