var mongoose = require('mongoose');


var users = new mongoose.Schema({
  phone:{type:String},
  first_name:{type:String},
  last_name:{type:String},
  dob: {type: Date},
  email:{type:String},
  address:  {type: String},
  verified: {type: Boolean},
  deleted: {type: Boolean},
  password: {type: String}
},{
  timestamps: true
});

module.exports = mongoose.model('users',users);