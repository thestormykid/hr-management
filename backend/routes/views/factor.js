var Factor = require('../../model/factor');

module.exports = {

	addFactor: function(req, res) {
		var factor = req.body.factor;

		Factor.create(factor, function(err, addedFactor) {
			if (err) {
				console.log(err);
				throw err;
			}

			console.log(addedFactor);

			res.json(addedFactor);
		})
	},

	getAllFactor: function(req, res) {

		Factor.find({}).populate('shiftId').exec(function(err, allFactors) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json(allFactors);
		})
	},

	updateFactor: function(req, res) {
		var factor = req.body.factor;

		Factor.findByIdAndUpdate(factor._id, factor, function(err, updatedFactor) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json(updatedFactor);
		})

	},

	removeFactor: function(req, res) {
		var id = req.params.id;

		Factor.deleteOne({_id: id}, function(err, factorRemoved) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json(factorRemoved);
		})

	},

	getSelectedFactors: function(req, res) {
		var shiftId = req.query.id;
		// console.log(req.query);
		// console.log(id);
		Factor.find({shiftId: shiftId}, function(err, selectedFactors) {
		  	if (err) {
		  		console.log(err);
		  		throw err;
		  	}

			console.log(selectedFactors);

		  	res.json(selectedFactors);
		})
	}

}
