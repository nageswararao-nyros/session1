const users = require('../models/user');
const bcrypt = require('bcrypt')


exports.login = (req, res)=>{
	console.log(req.body)
	users.findOne({email: req.body.email}, function(err, user){
		if(user && user.email !== ''){
			if(!user.verified){
				res.json({
						status: 400,
						message: "Please Verify Email Address"
					})
			}else{
				bcrypt.compare(req.body.password, user.password, (err, isValid) => {
					console.log(isValid)
					if(isValid){
						res.json({
							status: 200,
							data: user
						})
					}else{
						res.json({
							status: 400,
							message: "Incorrect password"
						})
					}
					
				})
			}
		}else{
			res.json({
				status: 404,
				message: "User Not Found"
			})
		}
	})
}

exports.get_data = (req, res) =>{


	console.log(req.params)

	res.json({
		data: "Data fetched by nageswar",
		status: 200
	})
}




