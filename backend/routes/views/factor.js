var Factor = require('../../model/factor');
var async = require('async');

module.exports = {

	index: function(req, res) {

		var urlArray = ['http://www.google.com', 'http://www.facebook.com', 'http://www.youtube.com', "http://www.swiggy.com"];
		var answer = [];

		async.everySeries(urlArray, function(value, callback) {
            const gtmetrix = require ('gtmetrix') ({
                email: 'hanugautam96@gmail.com',
                apikey: '860f4ecd5361208d37067f4454cb09fd'
            });

            const testDetails = {
                url: value,
                location: 2,
                browser: 3
            };

            gtmetrix.test.create (testDetails).then (function(data) {
                gtmetrix.test.get(data.test_id, 5000, function(err, secondData) {
                    if (err) {
                    	console.log(err);
                    	throw err;
					}
					console.log(secondData);
					answer.push(secondData);
                	callback(null, secondData);
                })

            }, function(err) {
                console.log(err);
            })

		}, function(err, result) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json(answer);
		})
    },

	addFactor: function(req, res) {
		var factor = req.body.factor;

		Factor.create(factor, function(err, addedFactor) {
			if (err) {
				console.log(err);
				return	res.status(500).json(err);
			}

			console.log(addedFactor);

			res.status(200).json(addedFactor);
		})
	},

	getAllFactor: function(req, res) {

		Factor.find({}).populate('shiftId').exec(function(err, allFactors) {
			if (err) {
				console.log(err);
				return	res.status(500).json(err);

			}

			res.status(200).json(allFactors);
		})
	},

	updateFactor: function(req, res) {
		var factor = req.body.factor;

		Factor.findByIdAndUpdate(factor._id, factor, function(err, updatedFactor) {
			if (err) {
				console.log(err);
				return	res.status(500).json(err);

			}

			res.status(200).json(updatedFactor);
		})

	},

	removeFactor: function(req, res) {
		var id = req.params.id;

		Factor.deleteOne({_id: id}, function(err, factorRemoved) {
			if (err) {
				console.log(err);
				return	res.status(500).json(err);

			}

			res.status(200).json(factorRemoved);
		})

	},

	getSelectedFactors: function(req, res) {
		var shiftId = req.query.id;

		Factor.find({shiftId: shiftId}, function(err, selectedFactors) {
		  	if (err) {
		  		console.log(err);
				return	res.status(500).json(err);

		  	}

		  	res.status(200).json(selectedFactors);
		})
	}

}
