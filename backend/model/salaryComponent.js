var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    componentName: { type: String, required: true },
    salaryType: {type: String, required: true},
    salaryValue: {type: Number, required: true},
    componentType: {type: String, required: true},
    editableType: {type: String, required: true},
    isDeleteable: {type: Boolean, required: true}
})

module.exports = mongoose.model('salaryComponent', Schema);
