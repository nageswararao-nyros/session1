const users = require('../models/user');
const classifications = require('../models/user');
const meetings = require('../models/task');
const uploads = require('../models/task');
const imageDataURI = require('image-data-uri');

exports.getEvents = (req, res)=>{
	var today_events = [];
	var next_events = [];
	var wee_info = [];
	var bir_info = [];
	var up_events = [];
	users.find({}).sort({dob:'asc'}).exec(function(err, usr_list){
		var today = new Date();
	    var today_format = today.getFullYear()+"/"+(today.getMonth() + 1)+"/"+today.getDate()

		console.log(today.getMonth(), today.getFullYear())
		var info = [];
		var future = new Date(); // get today date
		future.setDate(future.getDate() + 7); // add 7 days
		var finalDate = future.getFullYear() +'/'+ ((future.getMonth() + 1) < 10 ? '0' : '') + (future.getMonth() + 1) +'/'+ future.getDate();
		console.log(finalDate, Date.parse(finalDate), "NEXt Date");
		for(var i=0; i<= 11; i++){
			for(var j=0; j<= usr_list.length-1; j++){
	            var date = new Date(usr_list[j].dob);
	            if(date.getMonth() === i){
	            	info.push(usr_list[j])
	            }
		    }
		}

		if(info.length == usr_list.length){
			info.map((item, index)=>{
				if(item.dob != null){
				    var birth_date = new Date(item.dob)
				    var bir_format = today.getFullYear()+"/"+(birth_date.getMonth() + 1)+"/"+birth_date.getDate()
				    var new_bir_date = new Date(bir_format)

				    // console.log(today_format, bir_format , Date.parse(new_bir_date), Date.parse(today_format), "PARSE")
				    if(Date.parse(new_bir_date) === Date.parse(today_format)){
				    	 var object = {
			            	user: item,
			            	type: "birth_date"
			            }
			            today_events.push(object)
				    }
				    else if(Date.parse(today_format) < Date.parse(new_bir_date)){
				    	// console.log(item.dob, "BIRTH")
				    	var next_obj = {
				    		date: Date.parse(new_bir_date),
				    		user: item,
				    		type: "birth_date"
				    	}
				    	// bir_info.push(next_obj)
				    	next_events.push(next_obj)
				    }
				    // if(birth_date.getDate() === today.getDate() && birth_date.getMonth() === today.getMonth()){
			     //        var object = {
			     //        	user: item,
			     //        	type: "birth_date"
			     //        }
			     //        today_events.push(object)
				    // }

				    // if(birth_date.getDate() > today.getDate() && birth_date.getMonth() >= today.getMonth()){
				    // 	// console.log(new Date(item.dob), "2222222222222")
				    // 	var next_obj = {
				    // 		date: Date.parse(today.getFullYear()+"/"+birth_date.getMonth()+"/"+ birth_date.getDate()),
				    // 		user: item,
				    // 		type: "birth_date"
				    // 	}
				    // 	bir_info.push(next_obj)
				    // 	next_events.push(next_obj)
				    // }
				}
				if(item.dow != null ){
					var wed_date = new Date(item.dow)
				    var wed_format = today.getFullYear()+"/"+(wed_date.getMonth() + 1)+"/"+wed_date.getDate()
				    var new_wed_date = new Date(wed_format)

				   // console.log(today_format, wed_format , Date.parse(new_wed_date), Date.parse(today_format), "PARSE")
				    if(Date.parse(new_wed_date) === Date.parse(today_format)){
				    	 var object = {
			            	user: item,
			            	type: "wed_date"
			            }
			            today_events.push(object)
				    }
				    else if(Date.parse(today_format) < Date.parse(new_wed_date)){
				    	// console.log(item.dow)
				    	var next_obj = {
				    		date: Date.parse(new_wed_date),
				    		user: item,
				    		type: "wed_date"
				    	}

				    	//console.log(next_obj,Date.parse(today_format) )
				    	// bir_info.push(next_obj)
				    	next_events.push(next_obj)
				    }
					// var today 
				    // var wed_date = new Date(item.dow)
			     //    if(wed_date.getDate() === today.getDate() && wed_date.getMonth() === today.getMonth()){
			     //        var object = {
			     //        	user: item,
			     //        	type: "wed_date"
			     //        }
			     //        today_events.push(object)
				    // }

				    // if(wed_date.getDate() > today.getDate() && wed_date.getMonth() >= today.getMonth()){
				    // 	var next_obj = {
				    // 		date: Date.parse(today.getFullYear()+"/"+wed_date.getMonth()+"/"+ wed_date.getDate()),
				    // 		user: item,
				    // 		type: "wed_date"
				    // 	}
				    	
				    // 	wee_info.push(next_obj)
				    // 	next_events.push(next_obj)
				    // }

				}

				if(usr_list.length-1 == index){
					// // console.log(Date.parse('05/09'), "Sep")
					// // console.log(Date.parse('02/25'), "May")
					// var lists = [];

					// next_events.map(item=>{
					// 	// console.log(item.user.dob)
					// 	var date = new Date(item.user.dob)
					// 	var item_date = date.getMonth() +"/"+ date.getDate()
					// 	lists.push({parse:Date.parse(item_date), date: item_date})
					// 	// console.log(Date.parse(item_date), item_date)
					// })
					next_events.sort(function(a, b){return a.parse-b.parse})
					// console.log(lists.length)
					// var dates = []
					// lists.map(i=>{
					// 	dates.push(i.date)
					// })
					// var uniqueNames =	dates.filter(function(item, pos) {
					//     return dates.indexOf(item) == pos;
					// })

					// // console.log(uniqueNames)
					// uniqueNames.map(item=>{
					// 	var date = item
					// 	var today = new Date()
					// 	next_events.map(nxt=>{
					// 		var x = new Date(nxt.user.dob)
					// 		var nxt_date = x.getMonth() + "/" + x.getDate()
					// 		if(x.getMonth() >= today.getMonth()) {
					// 			if(date === nxt_date){
					// 				// console.log(nxt, nxt_date)
					// 				up_events.push(nxt)
					// 			}
					// 		}
					// 	})
					// 	// console.log(date
					// 	// var next_date = 
					// })


					var final_data = []
					// next_events.map((item, index) =>{
					// 	// console.log(item, index)

					// 	// if(item.type == "birth_date"){
					// 	// 	var y = new Date(item.user.dob)
					// 	// 	// console.log(y)
					// 	// 	var y_parse = today.getFullYear()+"/"+(y.getMonth() + 1)+"/"+y.getDate()
					// 	// 	//console.log(y_parse, finalDate, Date.parse(y_parse), Date.parse(finalDate))
					// 	// 	if(Date.parse(y_parse) <= Date.parse(finalDate)){
					// 	// 		final_data.push(item)
					// 	// 	}
					// 	// }
					// 	if(item.type == "wed_date"){
					// 		var z = new Date(item.user.dow)
					// 		//console.log(item)
					// 		var y_parse = today.getFullYear()+"/"+(z.getMonth() + 1)+"/"+z.getDate()
					// 		console.log(y_parse, finalDate, Date.parse(y_parse), Date.parse(finalDate))
					// 		if(Date.parse(y_parse) <= Date.parse(finalDate)){
					// 			final_data.push(item)
					// 		}
					// 	}
					// })

					next_events.map(item=>{
						if(item.date <= Date.parse(finalDate)){
							up_events.push(item)
						}
					})

					//console.log(up_events)
					// console.log(lists.sort(function(a, b){return a.parse-b.parse}), "ddddd")
	      	// bir_info.sort(function(a,b){return a.user.dob - b.user.dob});
	      	// console.log(next_events)
	      	setTimeout(function(){
	      		res.json({
							status: "Success Dashboard",
							today_events: today_events,
							next_events: up_events

						})
	      	}, 1000)

				}
			})
		}
	})
}

exports.getAllCarousel = (req, res)=>{
	uploads.find({}, function(err, up_info){
		if(up_info && up_info.length > 0){
			up_info.map((item, index)=>{
				imageDataURI.encodeFromURL("http://203.193.173.125:3009/carousel/"+item.image_url)
			    .then(p => {
			    	//console.log(p, "dddddddddd")
				    up_info[index].image_url = p
			    })

			    if(index === up_info.length-1){
			    	setTimeout(function(){
						res.json({
							up_list: up_info
						});
			    	}, 10000)
			    }
			})
		}else{
			res.render('../views/uploads/uploads', {up_list: []});

		}
	})
}
exports.searchData = (req, res)=>{
	console.log(req.body.name)
	var count = 0;
	String.prototype.toProperCase = function () {
	    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}

	var search_records = [];
	var final_name = req.body.name.toProperCase();
	users.find({first_name : {$regex: final_name }}, function(err, usr_name_info){
		count = 1;
		if(usr_name_info && usr_name_info.length > 0){
			usr_name_info.map((item,index)=>{
				if(index <= 2){
					search_records.push({name: item.first_name, id: item._id, type: 'members'})
				}
			})
		}
	})

	users.find({business_name : {$regex: final_name }}, function(err, user_business_info){
		count = 2;
		if(user_business_info && user_business_info.length > 0 ){
			user_business_info.map((item,index)=>{
				if(index <= 2){
					search_records.push({name: item.business_name, id: item._id, type: 'business'})
				}
			})
		}
	})

	classifications.find({name : {$regex: final_name }}, function(err, classification_info){
		count = 3;
		if(classification_info && classification_info.length > 0 ){
			classification_info.map((item,index)=>{
				if(index <= 2){
					search_records.push({name: item.name, id: item._id, type: 'classifications'})
				}
			})
		}
	})

	// if(search_records.length > 0){
		setTimeout(function(){
			res.json({
				status: "GGGGGG",
				data: search_records
			})
		}, 500)
		
	// }
}


exports.getClubEvents = (req, res)=>{
	var date = new Date()
	var today = date.getFullYear() +"/"+date.getMonth()+"/"+date.getDate()
	// console.log(Date.parse(today), today)
	const today_parse = Date.parse(today)
	meetings.find({}, function(err, meet_info){
		var final_meet = [];
		meet_info.map((item, index)=>{
			var meet_date = new Date(item.date)
	      	var current_meeting = meet_date.getFullYear() +"/"+meet_date.getMonth()+"/"+meet_date.getDate()
			var current = Date.parse(current_meeting) 
	      	if(today_parse <= current){
	      		// console.log(current_meeting)
	      		final_meet.push(item)
	      	}
	      	if(index === meet_info.length-1){
	      		final_meet.sort(function(a,b){return a.date - b.date});
	      		res.json({
					meet_info: final_meet.slice(0,5)
				})		
	      	}
		})
	})
}

exports.getSearchedClassifications = (req, res)=>{
	console.log(req.params)
	users.find({classification_id: req.params.class_id}).populate('classification_id').exec(function(err, cls_data){
		if(!err && cls_data.length > 0){
			res.json({
				status: 200,
				cls_data: cls_data
			})
		}else{
			res.json({
				status: 400,
				cls_data: []
			})
		}
	})
}