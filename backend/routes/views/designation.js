var Designation = require('../../model/designation');

module.exports = {

	getAllDesignation: function(req, res) {

		Designation.find({}).populate('components').exec(function(err, allComponents) {

			if (err) {
				console.log(err);
				HandleError(err);
			}

			res.json(allComponents);
		})
	},

	addDesignation: function(req, res) {
		var designation = req.body.designation;

		Designation.create(designation, function(err, createdDesignation) {
			if (err) {
				console.log(err);
				HandleError(err);
			}

			res.json('desingation created');
		})
	},

	deleteDesignation: function(req, res) {
		var id = req.params.id;
		console.log(id);

		Designation.deleteOne({_id: id}, function(err, status) {
			if (err) {
				console.log(err);
				HandleError(err);
			}

			res.json('designation deleted');
		})
	}
}
