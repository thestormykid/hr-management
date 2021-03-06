var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	startingDate: {type: Date, required: true},
	startingTime: {type: Date, required: true},
	endingTime: {type: Date, required: true},
	employeeDetails: {type: mongoose.Schema.Types.ObjectId, ref:'employee', required: true},
	amount: {type: Number, required: true},
	isApproved: {type: Boolean, default: false},
	factor: []
})


schema.pre('validate', function() {

})


module.exports = mongoose.model('attendance', schema);
