var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: {type: String, require: true},
	components: [{type: mongoose.Schema.Types.ObjectId, ref: 'salaryComponent', required: true}]
})

module.exports = mongoose.model('designation', schema);





