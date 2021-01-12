var users = require('../models/user')
var bcrypt = require('bcrypt')
const mailer = require('../mailer');

exports.save_user = (req, res) =>{
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    users.find({email: req.body.email}, function(err, ex_user){
      console.log(ex_user)
      if(ex_user && ex_user.length > 0){
        res.json({
          status: 400,
          msg: "Email already registered"
        })
      }else{
        var data = {
          phone: req.body.phone,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          dob: req.body.dob,
          email: req.body.email,
          address: req.body.address,
          verified: false,
          password: hash
        }
        users.create(data, function(err, user_rec){
          console.log(req.body, user_rec, 200)
          mailer.sendConfirmationMail(user_rec.email, user_rec._id, user_rec.first_name)
          res.json({
            status: 200,
            msg: "user saved successfully"
          })
        })
      }
    })
  })
}

