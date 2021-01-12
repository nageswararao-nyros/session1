var tasks = require('../../models/task');
var users = require('../../models/user');
var moment = require('moment');
const mailer = require('../../mailer');

exports.all_tasks = (req, res) =>{
	tasks.find({}).populate('user_id').exec(function(err, t_list){
	    res.render('../views/tasks/tasks', {tasks: t_list, moment: moment});
	})
}

exports.add_task = (req, res)=>{
	users.find({verified: true, deleted: {$ne: true}}, function(err, users) {
		res.render('../views/tasks/add_task', {users: users} )
		console.log(users)
	})
}

exports.save_task = (req, res)=>{
	// console.log(req.body)
	tasks.create({status: "Yet to start", title: req.body.title, est_hrs: req.body.est_hrs, description: req.body.description, user_id: req.body.user_id}, function(err, t_data){
		console.log(t_data)
        const data = t_data
        users.findOne({_id: req.body.user_id},function(err, user){
        	mailer.sendTaskUpdateMail(user.email, "Task created", "check it once", t_data.title)
        })
		res.json({
			status: "suceess"
		})
	})
}

exports.edit_task = (req, res) => {
  tasks.findOne({_id: req.params.task_id}, function(err, task){
  	users.find({verified: true, _id: { $ne: task.user_id }}, function(err, all_users) {
    	users.findOne({_id: task.user_id}, function(err, selected_user) {
    		res.render('../views/tasks/edit_task', {task: task, moment: moment, users: all_users, selected_user: selected_user })
    	})
  	})
  })
}

exports.update_task = (req, res) => {
  console.log(req.params, req.body)
    tasks.updateOne({_id:req.params.task_id},{$set:{status: "Yet to start", title: req.body.title, est_hrs: req.body.est_hrs, description: req.body.description, user_id: req.body.user_id}}, function(err, updated_meeting){
      console.log(err, updated_meeting)
      if(updated_meeting && updated_meeting.nModified === 1){
        console.log("Status success")
        res.json({
          status: 200,
          message: "Updated successfully"
          });
      }else{
        console.log(err, "11111111111111")
        res.json({
          status: 400,
          message: "Meeting Not Updated"
          });
      }
    })
}

exports.delete_task = (req, res) =>{
	console.log(req.params)
	tasks.deleteOne({_id: req.params.task_id}, function(err, del_meet){
		console.log(del_meet)
		if(err){
			res.json({
				status: 400,
				message: "failed to delete"
			})
		}else{
			res.json({
				status: 200,
				message: "successfully deleted"
			})
		}
	})
}