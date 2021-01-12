var mongoose = require('mongoose');


var tasks = new mongoose.Schema({
  title: {type: String},
  est_hrs: {type: String},
  description: {type: String},
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  status: {type: String},
},{
  timestamps: true
});

module.exports = mongoose.model('tasks',tasks);