var express = require('express');
var app 	= express();
var mongojs = require('mongojs');
var bcrypt 	= require('bcryptjs');
var morgan	= require('morgan');
var bodyParser= require('body-parser');
var nodemailer = require('nodemailer');
var dburl 	= URL;
var db = mongojs(dburl, ['users']);

db.on('connect', function(){
	console.log('you have connected to the database');
});

db.on('error', function(err){
	console.log('There was an error connecting to the database ' + err);
});



app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(morgan('dev'));

 var smtpConfig = { 
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: 'email',
		pass: 'pass'
	}
};

var transporter = nodemailer.createTransport(smtpConfig);

app.post('/email', function(req, res){
	console.log(req.body);
	var element = '<p>' + req.body.content + '<br>' + req.body.email + '</p>';
 	var tips = '"' + req.body.name + '"' + ' '  + '<' + req.body.email + '>';
 	var mailOption = {
	from: tips,
	to: 'bigdummy@fred.com',
	subject: req.body.subject ,
	text: req.body.email,
	html: element
};

transporter.sendMail(mailOption, function(err, info){
	if(err){console.log(err);
		res.send(false);
	}else{
		console.log('Message sent: ' + info.response );
		res.send(true);}
	});
});

app.post('/add', function(req, res){
	console.log(req.body);
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(req.body.pass, salt, function(err, hash){
			console.log(hash);
			db.users.insert({
						"user": req.body.user,
						"pass": hash,
						"bills": [],
						"have": 0,
						"free": 0,
						"daily":[],
						"weekly":[],
						"monthly":[],
						"retirement": [],
						"emergency": 0,
						"investment": [],
						"wants": [],
						"paid" : true
					}, function(err, data){
				console.log(data);
				res.json(data);
			});
		});
	});
});
app.put('/storage', function(req, res){
	console.log(req.body.user);
	db.users.findOne({ "user": req.body.user}, function(err, doc){
		console.log(doc);
		if(doc !== null){
			bcrypt.compare(req.body.pass, doc.pass, function(err, predicate){
				predicate === true ? res.json(doc) : res.send(false);
			});
		} else {
			res.send(false);
		}
	})
});
app.put('/bills', function(req, res){

	db.users.update({user: req.body.user}, {$push:{ bills: req.body }}, function(err, doc){
		console.log(doc);
		res.json(doc);
	});

});

app.get('/bills/:id', function(req, res){
	
	var id = req.params.id;
	db.users.findOne({_id: mongojs.ObjectId(id)}, function(err, docs){
		res.json(docs);
	});
});

app.get('/profile/:id', function(req, res){
	var id = req.params.id;
	console.log(id);
	db.users.findOne({_id: mongojs.ObjectId(id)}, function(err, docs){
		console.log(docs);
		res.json(docs);
	});
});

app.post('/wants', function(req, res){
 		console.log(req.body);
 	db.users.update({user: req.body.user}, {$push:{wants: req.body}}, function(err, doc){
 		console.log(doc);
 		res.json(doc);
 	});	
});

app.post('/day', function(req, res){
	console.log(req.body);
 	db.users.update({user: req.body.user}, {$push:{daily: req.body}}, function(err, doc){
 		console.log(doc);
 		res.json(doc);
 	});	

});

app.put('/day/:id', function(req, res){
	var id = req.params.id;
	console.log(id);
db.users.update( { _id: mongojs.ObjectId(id) }, { $pop: { daily: 1 } }, function(err, docs){
	console.log(docs);
	res.json(docs);
});

});

app.put('/week/:id', function(req, res){
	var id = req.params.id;
	console.log(id);
db.users.update( { _id: mongojs.ObjectId(id) }, { $pop: { weekly: 1 } }, function(err, docs){
	console.log(docs);
	res.json(docs);
});

});

app.put('/invest/:id', function(req, res){
	var id = req.params.id;
	console.log(id);
db.users.update( { _id: mongojs.ObjectId(id) }, { $pop: { investment: 1 } }, function(err, docs){
	console.log(docs);
	res.json(docs);
});

});

app.put('/bill/:id', function(req, res){
	var id = req.params.id;
	console.log(id);
db.users.update( { _id: mongojs.ObjectId(id) }, { $pop: { bills: 1 } }, function(err, docs){
	console.log(docs);
	res.json(docs);
});

});

app.put('/wants/:id', function(req, res){
	var id = req.params.id;
	console.log(id);
db.users.update( { _id: mongojs.ObjectId(id) }, { $pop: { wants: 1 } }, function(err, docs){
	console.log(docs);
	res.json(docs);
});

});

app.post('/invest', function(req, res){
	console.log(req.body);
 	db.users.update({user: req.body.user}, {$push:{investment: req.body}}, function(err, doc){
 		console.log(doc);
 		res.json(doc);
 	});	

});


app.post('/week', function(req, res){

	console.log(req.body);
 	db.users.update({user: req.body.user}, {$push:{weekly: req.body}}, function(err, doc){
 		console.log(doc);
 		res.json(doc);
 	});	
});

app.put('/maker/:id', function(req, res){
	console.log(req.body);
	var id = req.params.id;
	console.log(id);
	db.users.findAndModify({
		query: {_id:mongojs.ObjectId(id)},
		update: {$set: {have: req.body.have}},
		new: true
	}, function(err, doc){
		res.json(doc);
	});
});

app.put('/free/:id', function(req, res){
	console.log(req.body);
	var id = req.params.id;
	console.log(id);
	db.users.findAndModify({
		query: {_id:mongojs.ObjectId(id)},
		update: {$set: {free: req.body.free}},
		new: true
	}, function(err, doc){
		res.json(doc);
	});
});

app.put('/emer/:id', function(req, res){
	console.log(req.body);
	var id = req.params.id;
	console.log(id);
	db.users.findAndModify({
		query: {_id:mongojs.ObjectId(id)},
		update: {$set: {emergency: req.body.emergency}},
		new: true
	}, function(err, doc){
		res.json(doc);
	});
});

var port = process.env.PORT ||  8888;
app.use(express.static(__dirname + '/manageu'))
	.listen(port, function(){
		console.log('Your server is running on port ' + port);
	});

