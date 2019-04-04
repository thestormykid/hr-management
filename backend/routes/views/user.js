const JWT = require("jsonwebtoken");
const User = require("../../model/user");
const { JWT_SECRET } = require("../../config");

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

	signUp: function (req, res) {
		const { name, password, isAdmin } = req.body;

	    User.findOne({ name }, function(err, foundUser) {
	    	if (err) {
	    		console.log(err);
	    		throw err;
	    	}

		    if (foundUser) {
		      return res.status(403).json({ error: "username already exists" });
		    }

	    	var newUser = new User({name: name, password: password, isAdmin: isAdmin})

	    	newUser.save(function(err, userCreated) {
	    		if (err) {
	    			console.log(err);
	    			throw err;
	    		}

	    		var token = signToken(newUser);
	    		res.json(token);
	    	})
	    });
	},

	signIn: function(req, res) {
		console.log("Request Body", req.user);
    	const token = signToken(req.user);

	    res.json({ token });
	},

	secret: function(req, res) {
		res.json('granted');

	}
}
