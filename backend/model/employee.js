var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var ValidationError = mongoose.Error.ValidationError;
var ValidatorError  = mongoose.Error.ValidatorError;

// admin: 12345

var schema = new mongoose.Schema({
	name: {type: String, required: true},
	designationId: {type: mongoose.Schema.Types.ObjectId, ref:'designation'},
	shiftId: {type: mongoose.Schema.Types.ObjectId, ref:'shift'},
	code: {type: String, required: true},
	address: {type: String, required: true},
	password: {type: String, required: true},
	isAdmin: {type: String, required: true},
	uniqueToken: {type: String},
  email: {
    type: String,
    unique: true
    // validate: {
    //   validator: function() {
    //     return
    //   },
    //   message: 'this is not a valid email id'
    // }
  },
  firstLogin: {type: Boolean, default: true}
})

schema.pre('validate', async function(next) {
  try {

  } catch(error) {
    next(error);

  }

})


schema.pre("save", async function(next) {
  try {
    //salt generated
    const salt = await bcrypt.genSalt(10);

    //hashed password
    const passwordHash = await bcrypt.hash(this.password, salt);

    //assigning hashed version
    this.password = passwordHash;

    // next();

    if (this.email) {
      var query = { $or: [{code: this.code}, {email: this.email}]};

    } else {
      query = { code: this.code}

    }

    if (this.code.length <= 2) {
      next(new Error("employee code length must be greater than 2"));

    }

    // employee.findOne(query, function(err, checkEmployee) {
    //   if (err) {
    //     console.log(err);
    //     next(err);

    //   }

    //   if (!checkEmployee) {
    //     var error = new Error("Could not access the file")
    //     error.isPresent = true;

    //     var error = new ValidationError(this);
    //     error.errors.email = new ValidatorError('email', 'Email is not valid', 'notvalid', this.email);

    //     return next(error);


    //   } else {

    //     var error = new ValidationError(this);
    //     error.errors.email = new ValidatorError('email', 'Email is not valid', 'notvalid', this.email);

    //     return next(error);
    //     // return next(new Error('employee already present with same code or email'));
    //   }
    //   // next();
    // })



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

var employee = mongoose.model('employee', schema);

module.exports = employee
