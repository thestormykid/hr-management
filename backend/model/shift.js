var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	shiftName: { type: String, required: true},
	shiftType: { type: String, required: true},
	startingTime: {type: Date, required: true},
	endingTime: {type: Date, required: true},
	factors: [{
		factorName: {type: String, required: true},
		type: {type: String, required: true},
		timeType: {type: String, required: true},
		time: {type: Number, required: true},
		amount: {type: Number, required: true}
	}]
})

module.exports = mongoose.model('shift', schema);






