var mongoose = require('mongoose');


var admins = new mongoose.Schema({
  email: {type: String},
  password: { type: String },
},{
  timestamps: true
});

module.exports = mongoose.model('admins',admins);