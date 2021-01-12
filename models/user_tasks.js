var mongoose = require('mongoose');


var user_tasks = new mongoose.Schema({
  user_id: {type: String},
  meeting_id: {type: String},
},{
  timestamps: true
});

module.exports = mongoose.model('user_tasks',user_tasks);