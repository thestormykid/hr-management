var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	factorName: {type: String, required: true},
	type: {type: String, required: true},
	timeType: {type: String, required: true},
	shiftName: {type: String, required: true},
	shiftId: { type: mongoose.Schema.Types.ObjectId, ref: 'shift', required: true},
	time: {type: Number, required: true},
	amount: {type: Number, required: true}

})

module.exports = mongoose.model('factor', schema);
