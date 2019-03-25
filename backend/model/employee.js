var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: {type: String, required: true},
	designationName: {type: String, required: true},
	code: {type: String, required: true},
	shiftName: {type: String, required: true},
	address: {type: String, required: true}
})

module.exports = mongoose.model('employee', schema);
