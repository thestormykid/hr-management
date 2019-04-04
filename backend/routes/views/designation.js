var Designation = require('../../model/designation');
var Employee  = require('../../model/employee');

module.exports = {

	getAllDesignation: function(req, res) {

		Designation.find({}).exec(function(err, allComponents) {

			if (err) {
				console.log(err);
				throw err;
			}

			res.json(allComponents);
		})
	},

	addDesignation: function(req, res) {
		var designation = req.body.designation;

		Designation.create(designation, function(err, createdDesignation) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json('desingation created');
		})
	},

	updateDesignation: function(req, res) {
		var designation = req.body.designation;
		delete designation['$$hashKey'];

		Designation.findByIdAndUpdate(designation._id, designation, function(err, updated) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json('updated successfully');
		})
	},

	deleteDesignation: function(req, res) {
		var id = req.params.id;

		Employee.find({designationId: id}, function(err, checkEmployee) {
			if (err) {
				console.log(err);
				throw err;
			}

			if (checkEmployee.length != 0) {
				res.json("can't deleted, dependancy over employee");

			} else {
				Designation.deleteOne({_id: id}, function(err, status) {
					if (err) {
						console.log(err);
						throw err;
					}

					res.json('designation deleted');
				})
			}
		})
	}
}
