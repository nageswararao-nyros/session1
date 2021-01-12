var user_meetings = require('../models/user_tasks');
var meetings = require('../models/task');
// const vapidKeys = webpush.generateVAPIDKeys();


exports.update_attendee_count = (req, res) =>{
	console.log("Success users")
	var today = new Date()
	var today_format = today.getFullYear()+"/"+today.getMonth()+"/"+today.getDate()
	meetings.findOne({_id: req.params.meeting_id}, function(err, m_info){
		if(m_info){
			var meet_date = new Date(m_info.date)
			var meet_date_format = meet_date.getFullYear()+"/"+meet_date.getMonth()+"/"+meet_date.getDate()
			if(Date.parse(today_format) > Date.parse(meet_date_format)){
				console.log("Meeting Completed")
				res.json({
					status: 204,
					message: "Meeting already Completed"
				})
			}
			if(Date.parse(today) < Date.parse(meet_date)){
				console.log("Meeting Completed")
				res.json({
					status: 204,
					message: "Meeting not yet to be started"
				})
			}
			else{
				user_meetings.findOne({$and:[{meeting_id:req.params.meeting_id},{user_id:req.params.user_id}]}, function(err, user_meeting){
					if(user_meeting != null){
						res.json({
						    status: 200,
						    message: "you have already attended"
					    })
					}else{
						meetings.updateOne({_id:m_info._id}, { $set:{attendee_count:m_info.attendee_count+1 }}, function(err, update_m){
							if(update_m && update_m.nModified === 1){
								user_meetings.create({meeting_id: req.params.meeting_id, user_id: req.params.user_id}, function(err, update_info){
									console.log("Attendence Noted")
									
									res.json({
									    status: 200,
									    message: "Attendence Noted"
							        })
								})
							}else{
								res.json({
								    status: 400,
								    message: "Not Updated"
							    })
							}
						})
					}
				})
			}
		}else{
			console.log("Meeting Not found")
			res.json({
		    status: 404,
		    message: "Meeting Not Found"
	    })
		}
	})
}


exports.getAllEvents = (req, res)=>{
	var today_date = new Date()
	var final_meetings = [];

	meetings.find({}, function(err, meetings_info){
		if(meetings_info && meetings_info.length > 0){
			meetings_info.map((item, index)=>{
				if(Date.parse(today_date) <= Date.parse(item.date)){
					final_meetings.push(item)
				}

				if(index === meetings_info.length-1){
					res.json({
						meetings_info: final_meetings
					})
				}
			})
		}
	})
}