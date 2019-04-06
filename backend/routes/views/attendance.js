var Attendance = require('../../model/attendance');
var Employee = require('../../model/employee');
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
		var user = req.user;

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
}
