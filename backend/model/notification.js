var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	createdAt: {type: Date, default: Date.now()},
	heading: {type: String, required: true},
	message: {type: String, required: true},
	openedEmployees: [],
	sendedEmployees: []

})

module.exports = mongoose.model('notification', schema);
