var salaryComponent = require('../../model/salaryComponent');

module.exports = {

	addComponent: function(req, res) {
		var component = req.body.data;

		salaryComponent.create(component, function(err, result) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json(result);
		})

	},


	getAllComponents: function(req, res) {

		salaryComponent.find({}, function(err, allComponents) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json(allComponents);
		})
	},

	deleteComponent: function(req, res) {
		var componentNeedToBeDeletedId = req.params.id;

		salaryComponent.deleteOne({_id: componentNeedToBeDeletedId}, function(err, removedComponent) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json('component removed');

		})
	},

	updateComponent: function(req, res) {
		var updatedComponent = JSON.parse(req.body.component);
		delete updatedComponent['$$hashK	ey'];

		console.log(updatedComponent);

		salaryComponent.findByIdAndUpdate(updatedComponent._id, updatedComponent, function(err, status) {
			if (err) {
				console.log(err);
				throw err;
			}

			console.log(status);
			res.json('item updated successfully');
		})
	}

}
