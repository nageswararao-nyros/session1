var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var admins = require('../models/admin');
// var Roles = require('../models/roles');
var bcrypt = require('bcrypt');
// expose this function to our app using module.exports
module.exports = function(passport) {
// console.log('--------------------------------------------------')
// console.log('passport--------------------------------------------',passport);
// console.log('--------------------------------------------------')
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        // console.log(user, "eeeeeeeeeeeeee")
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        // console.log(id, done, "eeeeeeeeeeeeee")
        admins.findById(id, function(err, user) {
            // Roles.findOne({role: user.role}).exec((err, roles)=> {
            //     var newUser = user.toObject();
            //     newUser['roles'] = roles.privileges;
                done(err, user);
            // })
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    // passport.use('local-signup', new LocalStrategy({
    //     // by default, local strategy uses username and password, we will override with email
    //     usernameField : 'email',
    //     passwordField : 'password',
    //     passReqToCallback : true // allows us to pass back the entire request to the callback
    // },
    // function(req, email, password, done) {
    //     // asynchronous
    //     // User.findOne wont fire unless data is sent back
    //     process.nextTick(function() {

    //     // find a user whose email is the same as the forms email
    //     // we are checking to see if the user trying to login already exists
    //     User.findOne({ 'email' :  email }, function(err, user) {
    //         // if there are any errors, return the error
    //         if (err)
    //             return done(err);

    //         // check to see if theres already a user with that email
    //         if (user) {
    //             return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
    //         } else {

    //             // if there is no user with that email
    //             // create the user
    //             var newUser            = new User();

    //             // set the user's local credentials
    //             newUser.email    = email;
    //             newUser.password = newUser.generateHash(password);
    //             newUser.role = req.body.role;

    //             // save the user
    //             newUser.save(function(err) {
    //                 if (err)
    //                     throw err;

    //                 Roles.findOne({role: newUser.role}).exec((err, roles)=> {
    //                     var signupUser = newUser.toObject();
    //                     signupUser['roles'] = roles.privileges;
    //                     return done(null, signupUser);
    //                 })
    //             });
    //         }

    //     });    

    //     });

    // }));


    passport.use('local', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
              console.log(req, email, password, "TTTTTTTTTTTTTT")
            
            admins.findOne({email: req.body.email}, (err, user) => {
              console.log(user)
              if (err) {
                return done(err)
              }
              if (!user) {
                return done(null, false, { message: 'No user with that email' });
              }
              bcrypt.compare(req.body.password, user.password, (err, isValid) => {
                  console.log(isValid)
                if (err) {
                  return done(err)
                }
                if (!isValid) {
                  return done(null, false, { message: 'Incorrect Password' });
                }
                return done(null, user)
              })
            }) 

    }));

};