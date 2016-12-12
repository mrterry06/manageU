var nodemailer = require('nodemailer');
var events	   = require('events');

var mailer = {};


 var smtpConfig = { 
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: 'mrterry06@gmail.com',
		pass: ''
	}
};

var transporter = nodemailer.createTransport(smtpConfig);


mailer.sendMessage = function(element, sender, subject, body, func){

	 var mailOption = {
		from: sender,
		to: 'mrterry06@gmai.com',
		subject: subject ,
		text: body,
		html: element
	};

	 transporter.sendMail(mailOption, function(err, info){
		if (err){
			console.warn(err);
			
			func(err);
			return false;
		}else{
			func(null, true)
			console.log('Message sent: ' + info.response );
			return true;
		}
 		

	});

}

module.exports = mailer;



