var users = require('../../models/user');
var moment = require('moment');
var bcrypt = require('bcrypt')

exports.add_user = (req, res) =>{
	res.render('../views/users/add_user')
}

exports.get_all_users = (req, res) =>{
  users.find({deleted: {$ne: true}}, function(err, users){
    res.render('../views/users/users', {users: users, moment: moment})
  })
}

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
          verified: req.body.verified,
          password: hash
        }

        users.create(data, function(err, user_rec){
          console.log(req.body, user_rec, 200)
          res.json({
            status: 200,
            msg: "user saved successfully"
          })
        })
      }
    })
  })
}


exports.edit_user = (req, res) => {
  users.findOne({_id: req.params.user_id}).populate('classification_id').exec(function(err, user){
    res.render('../views/users/edit_user', {user: user,  moment: moment})
  })
}

exports.update_user = (req, res) => {
  console.log(req.params.user_id, req.body)
    users.updateOne({_id:req.params.user_id},{$set:{
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone: req.body.phone,
      dob: req.body.dob,
      address: req.body.address,
      email: req.body.email,
    }}, function(err, update_usr){
      console.log(err, update_usr)
      if(update_usr && update_usr.nModified === 1){
        console.log("Status success")
        res.json({
          status: 200,
          message: "Updated successfully"
          });
      }else{
        console.log(err, "11111111111111")
        res.json({
          status: 400,
          message: "Profile Not Updated"
          });
      }
    })
}


exports.delete_user = (req, res) =>{
  users.updateOne({_id:req.params.user_id},{$set:{deleted: true}}, function(err, user_del){
    if(user_del){
      res.json({
        status: 200,
        message: "successfully deleted"
      })
    }
    else{
      res.json({
        status: 400,
        message: "failed to delete"
      })
    }
  })
}