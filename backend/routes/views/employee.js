var Employee = require('../../model/employee');
const JWT = require("jsonwebtoken");
const User = require("../../model/user");
const { JWT_SECRET } = require("../../config");
var ObjectId = require('mongodb').ObjectID;

signToken = user => {
  return JWT.sign(
    {
      iss: "Hanu",
      sub: user.id,
      iat: new Date().getTime(), //current Time
      exp: new Date().setDate(new Date().getDate() + 1) //current day +1
    },
    JWT_SECRET
  );
};



module.exports = {

	addEmployee: function(req, res) {
		var employee = req.body.employee;

		Employee.findOne({code: employee.code}, function(err, checkEmployeeCode) {
			if (err) {
				console.log(err);
				throw err;
			}

			if (checkEmployeeCode) {
				return res.json({message: 'exists'});

			} else {

		    	var newEmployee = new Employee(employee);

		    	newEmployee.save(function(err, employeeCreated) {
		    		if (err) {
		    			console.log(err);
		    			res.json('asdasdasd');
		    			throw err;
		    		}

		    		var token = signToken(employeeCreated);

		    		return res.json({token: token, user: employeeCreated});
		    	})
			}
		})
	},

	signIn: function(req, res) {

    	const token = signToken(req.user);

	    res.json({ token: token, user: req.user });
	},

	getAllEmployee: function(req, res) {

		Employee.find({isAdmin: false}).populate('designationId').populate('shiftId').exec(function(err, allEmployee) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json(allEmployee);
		})
	},

	updateEmployee: function(req, res) {
		var employee = req.body.employee;

		Employee.findByIdAndUpdate(employee._id, employee, function(err, updatedEmployee) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json(updatedEmployee);
		})

	},

	removeEmployee: function(req, res) {
		var id = req.params.id;

		Employee.deleteOne({_id: id}, function(err, deletedEmployee) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json(deletedEmployee);
		})

	}
}
