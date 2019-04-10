var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var schema = new mongoose.Schema({
	name: {type: String, required: true},
	designationId: {type: mongoose.Schema.Types.ObjectId, ref:'designation'},
	shiftId: {type: mongoose.Schema.Types.ObjectId, ref:'shift'},
	code: {type: String, required: true},
	address: {type: String, required: true},
	password: {type: String, required: true},
	isAdmin: {type: String, required: true},
	uniqueToken: {type: String},
  email: {type: String, unique: true},
  firstLogin: {type: Boolean, default: true}
})

schema.pre("save", async function(next) {
  try {
    //salt generated
    const salt = await bcrypt.genSalt(10);

    //hashed password
    const passwordHash = await bcrypt.hash(this.password, salt);

    //assigning hashed version
    this.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});

schema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword,this.password);
  } catch (error) {
    throw new Error(error);
  }
};


module.exports = mongoose.model('employee', schema);
