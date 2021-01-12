var admins = require('../../models/admin')

const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')
const bcrypt = require('bcrypt')


exports.getLogin = (req, res) => {
	res.render('../views/auth/login');
}


exports.LoginVerification = (req, res, done) =>{
	console.log(req.body)
	passport.use(new LocalStrategy(
		 (username, password, done) => {
		    admins.findOne({email: req.body.email}, (err, user) => {
		      if (err) {
		        return done(err)
		      }
		      if (!user) {
		        return done(null, false)
		      }
		      bcrypt.compare(req.body.password, user.password, (err, isValid) => {
		      	console.log(isValid)
		        if (err) {
		          return done(err)
		        }
		        if (!isValid) {
		          return done(null, false)
		        }
		        return done(null, user)
		      })
		    }) 
		}
    ))
}