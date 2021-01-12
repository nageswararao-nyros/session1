const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: 'gmail',
    auth: {
      user: 'nageswararao.nyros@gmail.com', // generated ethereal user
      pass: 'FoF15@Jnr8', // generated ethereal password
    },
  });
exports.sendTaskUpdateMail = (to, body, subject, task_name) => {
  let info = transporter.sendMail({
    from: '"Task Manager" <service@taskmanager.com>', // sender address
    to: to, // list of receivers
    subject: "New Task", // Subject line
    // text: "The "+task_name+" is assigned to you", // plain text body
    html: "The <b>"+task_name+"</b> is assigned to you", // html body
  });

  console.log(info)
}

exports.sendConfirmationMail = (to, id, name) =>{
	let info = transporter.sendMail({
    from: '"Task Manager" <service@taskmanager.com>', // sender address
    to: to, // list of receivers
    subject: "Confirmation", // Subject line
    // text: "The "+task_name+" is assigned to you", // plain text body
    html: "Hi "+name+", <br> Please confirm Task Manager <a href='https://taskmanager/admin/verify/"+id+"'>here</a> ", // html body
  });
}