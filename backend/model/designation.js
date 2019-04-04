var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: {type: String, require: true},
	components: [{
		_id: {type: mongoose.Schema.Types.ObjectId, required: true},
		componentName: { type: String, required: true},
		salaryType: {type: String, required: true},
		salaryValue: {type: Number, required: true},
		componentType: {type: String, required: true},
		editableType: {type: String, required: true}
	}],
	amount: {type: Number, required: true}
})

module.exports = mongoose.model('designation', schema);





