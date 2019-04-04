var Attendance = require('../../model/attendance');
var ObjectId = require('mongodb').ObjectID;


module.exports = {

	markAttendance: function(req, res) {
		var markedAttendance = req.body.attendanceDetails;

		Attendance.create(markedAttendance, function(err, attendanceMarked) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json('attendance marked');
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
			}
		], function(err, selectedEmployeesList) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json(selectedEmployeesList);
		})
	}
}
