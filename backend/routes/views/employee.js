var Employee 			= require('../../model/employee');
const JWT 				= require("jsonwebtoken");
const User 				= require("../../model/user");
const { JWT_SECRET } 	= require("../../config");
var ObjectId 			= require('mongodb').ObjectID;
var emailExistence 		= require('email-existence');
var nodemailer 			= require('nodemailer');
var transporter 		= require('nodemailer-sendgrid-transport');
var jwtDecode 			= require('jwt-decode');
var bcrypt 				= require('bcrypt');


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

adminToken = email => {
	return JWT.sign(
		{
			iss: 'Hanu',
			sub: email,
			iat: new Date().getTime(), // current Time
			exp: new Date().setMinutes(new Date().getMinutes() + 15)
		},
		JWT_SECRET
	);
}

module.exports = {

	addEmployee: function(req, res) {
		var employee = req.body.employee;
		console.log(employee);
		if (employee.email) {
			var query = { $or: [{code: employee.code}, {email: employee.email}]};

		} else {
			query = { code: employee.code}

		}

		Employee.findOne(query, function(err, checkEmployeeCode) {
			if (err) {
				console.log(err);
				throw err;
			}

			console.log(checkEmployeeCode);

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

		var pno = Number(req.query.pno)-1;
		var itemsPerPage = Number(req.query.itemsPerPage);

		Employee.find({isAdmin: false}).populate('designationId').populate('shiftId').skip(pno*itemsPerPage).limit(itemsPerPage).exec(function(err, allEmployee) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json(allEmployee);
		})
	},

	getEmployeeCount: function(req, res) {

		Employee.count({isAdmin: false}).exec(function(err, employeeCount) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json({totalItems: employeeCount});
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
	},

	sendEmail: function(req, res) {

		var mail = req.body.mail;
		var token = adminToken(mail);

		sendEmail(mail, token, function(err, token, emailSendStatus) {
			if (err) {
			 	console.log(err);
			 	throw err;
			}

			res.json({status: emailSendStatus, token: token});
		});
	},

	checkAdmin: function(req, res) {

		var token = req.params.token;
		var payload = jwtDecode(token);

		console.log(payload);

		Employee.findOne({email: payload.sub}, function(err, checkEmployeeExistance) {
			if (err) {
				console.log(err);
				throw err;
			}

			if (checkEmployeeExistance) {

				return res.json({ message: 'cannot create admin as email exists', mail: payload.sub, status: false});

			} else {
				return res.json({message: 'can create admin', mail: payload.sub, status: true});

			}
		})
	},

	checkFirstTimeUser: function(req, res) {
		var user = req.user;

		if (user.firstLogin) {
			return res.json({info: 'update your password', status: true, user: user});

		} else {
			return res.json({info: 'password updated successfully', status: false});

		}
	},

	updatePassword: async function(req, res) {
		var updatedData = {};
		var password = req.body.password;
		console.log(password);
		const salt = await bcrypt.genSalt(10);
		var hashPassword = await bcrypt.hash(password, salt);
		updatedData.password = hashPassword;
		updatedData.firstLogin = false;

		var id = req.user._id;

		Employee.findByIdAndUpdate(id, updatedData, function(err, passwordUpdated) {
			if (err) {
				console.log(err);
				throw err;
			}

			console.log(updatedData);

			res.json({info: 'password updated', status: true});
		})

	}
}

function sendEmail(mail, token, callback) {

	const mailOptions = {
	 	 from: process.env.senderEmail,
		 to: mail,
	 	 subject: `Admin Registration`,
	 	 html: `<h3>Use this link to create admin</h3><a href="http://localhost:63342/hr_management/fontend/index.html#!/create-admin/${token}">Create Admin</a>`
	};


	var transport = nodemailer.createTransport({
		 service: 'gmail',
		 auth: {
		        user: 'hanuketesting@gmail.com',
		        pass: 'delhi123@'
		    }
	});


	// var transport = nodemailer.createTransport(transporter({
	// 	auth:  {
	// 		api_key: 'delhi123@',
	// 		api_user: 'hanus'
	// 	}
	// }))



	// console.log(mailOptions);

	transport.sendMail(mailOptions, function (err, info) {
   		if(err) {
     		// console.log(err)
   			callback(err, null);
   		}

   		callback(null, token, info);
	});
}
