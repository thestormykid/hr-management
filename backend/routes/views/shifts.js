var Shift = require('../../model/shift');
var Factor = require('../../model/factor');
var Employee = require('../../model/employee');


module.exports = {

	addShift: function(req, res) {
		var shift = req.body.shift;
		console.log(shift);

		Shift.create(shift, function(err, shiftAdded) {
			if(err) {
				console.log(err);
				return err;
			}

			res.json('shift added');
		})
	},

	getAllShifts: function(req, res) {

		Shift.find({}, function(err, allShifts) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json(allShifts);
		})
	},

	deleteShift: function(req, res) {
		var shiftNeedToBeDeleteId = req.params.id;

		// check dependancy with factor.
		Factor.find({shiftId: shiftNeedToBeDeleteId}, function(err, checkShift) {
			if (err) {
				console.log(err);
				throw err;
			}

			if (checkShift.length != 0) {
				return res.json("can't deleted, dependancy over shift factor");
			}

			// check dependancy with employee
			Employee.find({shiftId: shiftNeedToBeDeleteId}, function(err, checkEmployee) {
				if (err) {
					console.log(err);
					throw err;
				}

				if (checkEmployee.length != 0) {
					return res.json("can't deleted, dependancy over employee");

					Shift.deleteOne({_id: shiftNeedToBeDeleteId}, function(err, deletedShift) {
						if (err) {
							console.log(err);
							throw err;
						}

						res.json('shift deleted successfully');
					})
				}
			})
		})
	},

	updateShift: function(req, res) {
		var shiftNeedToBeUpdated = JSON.parse(req.body.shift);
		console.log(shiftNeedToBeUpdated);
		delete shiftNeedToBeUpdated['$$hashKey'];

		Shift.findByIdAndUpdate(shiftNeedToBeUpdated._id, shiftNeedToBeUpdated, function(err, updatedShift) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json(updatedShift);
		})
	}
}


// "[{"type":"reduction","timeType":"minutes","shiftName":"man","factorName":"lalal","time":162,"amount":55,"shiftId":1552918448081,"id":1552977099182,"$$hashKey":"object:10"},{"type":"allowance","timeType":"minutes","shiftName":"hanu","factorName":"lalal","time":55,"amount":55,"shiftId":1552918448081,"id":1552978300614,"$$hashKey":"object:11"},{"type":"allowance","timeType":"minutes","shiftName":"hanu","factorName":"lall","time":55,"amount":55,"shiftId":1552918448081,"id":1552978603632,"$$hashKey":"object:13"},{"type":"allowance","timeType":"minutes","shiftName":"hanu","factorName":"lalal","time":22,"amount":22,"shiftId":1552918448081,"id":1552978674104,"$$hashKey":"object:14"},{"type":"allowance","timeType":"minutes","shiftName":"hanu","factorName":"lalala","time":22,"amount":22,"shiftId":1552918448081,"id":1552978772493,"$$hashKey":"object:15"},{"type":"allowance","timeType":"minutes","shiftName":"man","factorName":"lalll","time":55,"amount":55,"shiftId":1552918460046,"id":1552978825879,"$$hashKey":"object:16"},{"type":"allowance","timeType":"minutes","shiftName":"hanu","factorName":"lalal","time":44,"amount":44,"shiftId":1552918448081,"id":1552979037382,"$$hashKey":"object:17"},{"type":"allowance","timeType":"minutes","shiftName":"hanu","factorName":"lals","time":3232,"amount":3222,"shiftId":1552918448081,"id":1552979052734,"$$hashKey":"object:18"}]"
