var Attendance = require('../../model/attendance');
var Employee = require('../../model/employee');
var ObjectId = require('mongodb').ObjectID;


module.exports = {

	markAttendance: function(req, res) {
		var markedAttendance = req.body.attendanceDetails;
		var user = req.user;

		Attendance.findOne({startingDate: markedAttendance.startingDate, employeeDetails: ObjectId(user._id)}, function(err, checkAttendance) {
			if (err) {
				console.log(err);
				throw err;
			}

			if (!checkAttendance) {

				Attendance.create(markedAttendance, function(err, attendanceMarked) {
					if (err) {
						console.log(err);
						throw err;
					}

					res.json('attendance marked');
				})

			} else {
				res.json('attendance present');
			}
		})
	},

	deleteAttendance: function(req, res) {
		var id = req.params.id;

		Attendance.deleteOne({_id: id}, function(err, attendanceDeleted) {
			if (err) {
				console.log(err);
				throw err;
			}

			console.log(attendanceDeleted)

			res.json('successfully Deleted');
		})
	},

	getSelectedEmployee: function(req, res) {
		var filter = JSON.parse(req.query.filter);
		var designationObject = {};
		var shiftObject = {};

		if (filter.designationId) {
			designationObject = {
				'employee.designationId': ObjectId(filter.designationId)
			}
		}

		if (filter.shiftId) {
			shiftObject = {
				'employee.shiftId': ObjectId(filter.shiftId)
			}
		}

		Attendance.aggregate([
			{
				$lookup: {
					from: 'employees',
					localField: 'employeeDetails',
					foreignField: '_id',
					as: 'employee'
				}
			},
			{
				$unwind: '$employee'
			},
			{
				$match: designationObject
			},
			{
				$match: shiftObject
			},
			{
				$sort: { startingDate: 1 }
			}
		], function(err, selectedEmployeesList) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json(selectedEmployeesList);
		})
	},

	getUserAttendance: function(req, res) {
		var user = req.query.uId;

		if(user == "undefined") {
			user = req.user;
			return getUserAttendanceHelper(user, req, res)

		} else {
			user = JSON.parse(user);

			Employee.findOne({_id: user.employeeDetails}, function(err, user) {
				if (err) {
					console.log(err);
					throw err;
				}

				return getUserAttendanceHelper(user, req, res);
			})
		}
	}
}

function getUserAttendanceHelper(user, req, res) {
		Attendance.aggregate([
			{ $match: { employeeDetails: ObjectId(user._id) }},
			// { $select: { amount: 0 } },
			{ $sort: { startingDate: -1 } },
		], function(err, attendanceList) {
			if (err) {
				console.log(err);
				throw err;
			}

			Employee.findOne({_id: ObjectId(user._id)}).populate('designationId').populate('shiftId').exec(function(err, employee) {
				if (err) {
					console.log(err);
					throw err;
				}

				return res.json({ 'attendanceList': attendanceList, 'user': employee});
			})
		})
}
