var Shift = require('../../model/shift');
var Factor = require('../../model/factor');
var Employee = require('../../model/employee');


module.exports = {

	addShift: function(req, res) {
		var shift = req.body.shift;

		Shift.create(shift, function(err, shiftAdded) {
			if(err) {
				console.log(err);
				return	res.status(500).json(err);
			}

			res.status(200).json('shift added');
		})
	},

	getAllShifts: function(req, res) {

		Shift.find({}, function(err, allShifts) {
			if (err) {
				console.log(err);
				return	res.status(500).json(err);

			}

			res.status(200).json(allShifts);
		})
	},

	deleteShift: function(req, res) {
		var shiftNeedToBeDeleteId = req.params.id;

		// check dependancy with factor.
		Factor.find({shiftId: shiftNeedToBeDeleteId}, function(err, checkShift) {
			if (err) {
				console.log(err);
				return	res.status(500).json(err);

			}

			if (checkShift.length != 0) {
				return res.status(300).json("can't deleted, dependancy over shift factor");

			}

			// check dependancy with employee
			Employee.find({shiftId: shiftNeedToBeDeleteId}, function(err, checkEmployee) {
				if (err) {
					console.log(err);
					return	res.status(500).json(err);
				}

				if (checkEmployee.length != 0) {
					return res.status(300).json("can't deleted, dependancy over employee");

				} else {

					Shift.deleteOne({_id: shiftNeedToBeDeleteId}, function(err, deletedShift) {
						if (err) {
							console.log(err);
							return	res.status(500).json(err);

						}

						res.status(200).json('shift deleted successfully');
					})

				}
			})
		})
	},

	updateShift: function(req, res) {
		var shiftNeedToBeUpdated = JSON.parse(req.body.shift);

		delete shiftNeedToBeUpdated['$$hashKey'];

		Shift.findByIdAndUpdate(shiftNeedToBeUpdated._id, shiftNeedToBeUpdated, function(err, updatedShift) {
			if (err) {
				console.log(err);
				return	res.status(500).json(err);

			}

			res.status(200).json(updatedShift);
		})
	}
}
