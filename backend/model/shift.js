var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	shiftName: { type: String, required: true},
	shiftType: { type: String, required: true},
	startingTime: {type: Date, required: true},
	endingTime: {type: Date, required: true}
})

module.exports = mongoose.model('shift', schema);






