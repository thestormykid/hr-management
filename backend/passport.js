const passport        = require("passport");
const JWTStartegy     = require("passport-jwt").Strategy;
const LocalStartegy   = require("passport-local").Strategy;
const { ExtractJwt }  = require("passport-jwt");
const { JWT_SECRET }  = require("./config");
const User            = require("./model/user");

passport.use(
  new JWTStartegy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authoriation"),
      secretOrKey: JWT_SECRET
    },
    async (payload, done) => {
      try {
        console.log("payload", payload);
        //find the user specied
        const user = await User.findById(payload.sub);

        //if user does not exists
        if (!user) {
          return done(null, false);
        }
        //otherwise return user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.use(
  new LocalStartegy(
    {
      usernameField: "name"
    },
    async (name, password, done) => {
      try {
        //Find the user by email
        const user = await User.findOne({ name });
        //If not handle it
        if (!user) {
          return done(null, false);
        }
        //checking password is correct or not
        const isMatch = await user.isValidPassword(password);

        if (!isMatch) {
          return done(null, false);
        }

        //otherwise
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
