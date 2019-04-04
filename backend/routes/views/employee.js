var Employee = require('../../model/employee');



module.exports = {

	addEmployee: function(req, res) {
		var factor = req.body.employee;

		Employee.create(factor, function(err, addedFactor) {
			if (err) {
				console.log(err);
				throw err;
			}

			console.log(addedFactor);

			res.json(addedFactor);
		})
	},

	getAllEmployee: function(req, res) {

		Employee.find({}).populate('designationId').populate('shiftId').exec(function(err, allEmployee) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json(allEmployee);
		})
	},

	updateEmployee: function(req, res) {
		var employee = req.body.employee;

		Employee.findByIdAndUpdate(employee._id, employee, function(err, updatedEmployee) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json(updatedEmployee);
		})

	},

	removeEmployee: function(req, res) {
		var id = req.params.id;

		Employee.deleteOne({_id: id}, function(err, deletedEmployee) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json(deletedEmployee);
		})

	}
}
