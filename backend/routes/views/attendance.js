var Attendance = require('../../model/attendance');
var Employee = require('../../model/employee');
var ObjectId = require('mongodb').ObjectID;
var async  = require('async');
var util = require('util');


module.exports = {

	getHeaders: function(req, res) {

		Attendance.distinct('factor.componentName', function(err, distinctHeaders) {
			if (err) {
				console.log(err);
				return	res.status(500).json(err);

			}

			res.json(distinctHeaders);
		})
	},

	markAttendance: function(req, res) {
		var markedAttendance = req.body.attendanceDetails;
		var user = req.user;

		Attendance.findOne({startingDate: markedAttendance.startingDate, employeeDetails: ObjectId(user._id)}, function(err, checkAttendance) {
			if (err) {
				console.log(err);
				return	res.status(500).json(err);

			}

			if (!checkAttendance) {

				Attendance.create(markedAttendance, function(err, attendanceMarked) {
					if (err) {
						console.log(err);
						return	res.status(500).json(err);

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
				return	res.status(500).json(err);

			}

			res.json('successfully Deleted');
		})
	},

	getSelectedEmployee: function(req, res) {
		var filter = JSON.parse(req.query.filter);
		var pno = Number(req.query.pno)-1;
		var itemsPerPage = Number(req.query.itemsPerPage);
		var designationObject = {};
		var shiftObject = {};
		var skip = {};
		var limit = {};
		var query = [];


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

		if (filter.startingDate) {
			cond = {
				$match: {startingDate: {$gte: new Date(filter.startingDate)}}
			}

			query.push(cond);
		}

		if(filter.endingDate) {
			cond = {
				$match: {startingDate: {$lte: new Date(filter.endingDate)}}

			}

			query.push(cond);
		}

		query.push({
				$lookup: {
					from: 'employees',
					localField: 'employeeDetails',
					foreignField: '_id',
					as: 'employee'
				}
			}, {
				$unwind: '$employee'
			}, {
				$match: designationObject
			}, {
				$match: shiftObject
			}, {
				$sort: { startingDate: 1 }
			}, {
				$skip: pno*itemsPerPage
			}, {
				$limit: itemsPerPage
			});


		Attendance.aggregate(query, function(err, selectedEmployeesList) {
			if (err) {
				console.log(err);
				return	res.status(500).json(err);

			}

			res.json(selectedEmployeesList);
		})
	},

	getUserAttendance: function(req, res) {
		var user = req.query.uId;
		var pno = Number(req.query.pno)-1;
		var itemsPerPage = Number(req.query.itemsPerPage);
		var filter = JSON.parse(req.query.filter);

		var query = [];

		// for employee
		if(user == "undefined") {
			user = req.user;

			if (filter.startingDate) {
				cond = {
					$match: {startingDate: {$gte: new Date(filter.startingDate)}}
				}

				query.push(cond);
			}

			if(filter.endingDate) {
				cond = {
					$match: {startingDate: {$lte: new Date(filter.endingDate)}}

				}

				query.push(cond);
			}

			query.push({
				$match: {employeeDetails: ObjectId(user._id)}
			}, {
				$sort: {startingDate: -1}
			})

			query.push({
				$skip: (pno)*itemsPerPage
			}, {
				$limit: itemsPerPage
			})

			console.log(query);

			// query.push(cond3);
			return getUserAttendanceHelper(req, res, user, query)

		// for admin
		} else {
			user = JSON.parse(user);

			Employee.findOne({_id: user.employeeDetails}, function(err, user) {
				if (err) {
					console.log(err);
					throw err;
				}

				if (filter.startingDate) {
					cond = {
						$match: {startingDate: {$gte: new Date(filter.startingDate)}}
					}

					query.push(cond);
				}

				if(filter.endingDate) {
					cond = {
						$match: {startingDate: {$lte: new Date(filter.endingDate)}}

					}

					query.push(cond);
				}

				query.push({
					$match: {employeeDetails: ObjectId(user._id)}
				}, {
					$sort: {startingDate: -1}
				})

				query.push({
					$skip: (pno)*itemsPerPage
				}, {
					$limit: itemsPerPage
				})

				return getUserAttendanceHelper(req, res, user, query);
			})
		}
	},

	getAttendanceCount: function(req, res) {
		var user = req.user;
		var query = {};
		var query2 = {};
		var adminCheckingUserId = req.query.userId;

		if (req.query.filter != "undefined") {
			var filter = JSON.parse(req.query.filter);
		}



		if (filter && filter.startingDate) {
			console.log("*****************************************");
			if (query) {
				query.startingDate = {};
				query.startingDate.$gte = new Date(filter.startingDate)

			}
		}

		if(filter&&filter.endingDate) {
			if (query) {
				query.startingDate.$lte = new Date(filter.endingDate)

			} else {
				query.startingDate = {};
				query.startingDate.$lte = new Date(filter.endingDate);

			}
		}
		// for user view
		if (user.isAdmin == 'false') {
			query.employeeDetails = ObjectId(user._id);

			return attendanceCount(req, res, query);
		// for admin to user view
		} else if (adminCheckingUserId != "undefined") {
			query.employeeDetails = ObjectId(adminCheckingUserId);

			return attendanceCount(req, res, query);
		// for admin to reports
		} else {

			if (filter&&filter.designationId) {
				query2.designationId = filter.designationId;

			}

			if (filter&&filter.shiftId) {
				query2.shiftId = filter.shiftId;

			}

			Employee.find(query2, {_id: 1}, function(err, employee_ids) {
				if (err) {
					console.log(err);
					return	res.status(500).json(err);

				}

				var eId = [];
				employee_ids.forEach(function(employee_ids) {
					eId.push(employee_ids._id);
				})

				query.employeeDetails = {$in: eId};

				return attendanceCount(req, res, query);
			})
		}
	},

	approveAttendance: function(req, res) {
		var approveAttendanceList = req.body.approvedAttendanceList;
		var queryList = [];

		approveAttendanceList.forEach(function(singleAttendance) {
			queryList.push(function(cb) {
				Attendance.findByIdAndUpdate(singleAttendance, {isApproved: true}, function(err, updated) {
					if(err) {
						console.log(err);
						cb(err);
					}

					cb(null, updated);
				})
			})
		})

		async.parallel(queryList, function(err, allUpdatedAttendance) {
			if (err) {
				console.log(err);
				return	res.status(500).json(err);

			}

			res.json({message: 'approved successfully'});
		})
	}
}

function getUserAttendanceHelper(req, res, user, query) {

	Employee.findOne({_id: ObjectId(user._id)}).populate('designationId').populate('shiftId').exec(function(err, employee) {
		if (err) {
			console.log(err);
			return	res.status(500).json(err);

		}

		Attendance.aggregate(query, function(err, attendanceList) {
			if (err) {
				console.log(err);
				return	res.status(500).json(err);

			}

			return res.json({ 'attendanceList': attendanceList, 'user': employee});
		})
	})
}

function attendanceCount(req, res, query) {

	console.log(query);

	Attendance.count(query).exec(function(err, totalCount) {
			if (err) {
				console.log(err);
				throw err;
			}
			console.log(totalCount);

			return res.json({totalItems: totalCount});
	})
}
