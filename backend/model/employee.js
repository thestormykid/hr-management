var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: {type: String, required: true},
	designationId: {type: mongoose.Schema.Types.ObjectId, ref:'designation', required: true},
	shiftId: {type: mongoose.Schema.Types.ObjectId, ref:'shift', required: true},
	code: {type: String, required: true},
	address: {type: String, required: true}
})

module.exports = mongoose.model('employee', schema);
