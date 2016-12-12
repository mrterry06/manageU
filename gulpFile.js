var express 	= require('express');
var app 		= express();
var mongojs 	= require('mongojs');
var bcrypt 		= require('bcryptjs');
var morgan		= require('morgan');
var bodyParser  = require('body-parser');
var dburl 	    = "localhost";
var db 			= mongojs(dburl, ['users']);
var mailer 		= require("./mailer");
var gulp  		= require('gulp');
var livereload  = require('gulp-livereload');
var port 		= process.env.PORT ||  8888;

gulp.task('styles', function(){
	gulp.src('**/*.css')
		.pipe(livereload());
		console.log("styles has loaded");
});

gulp.task('structure', function(){
	gulp.src('**/*.html')
		.pipe(livereload());
		console.log('html has loaded');
});

gulp.task('func', function(){
	gulp.src('**/*.js')
		.pipe(livereload());
		console.log("the behavior has reloaded");
});

gulp.task('comp', function(){
	
	gulp.src('**/*.less')
		.pipe(livereload());
		console.log("the preprocessor file has changed");
});	

gulp.task('watch', function(){
	
	livereload.listen();
	gulp.watch('**/*.js');
	gulp.watch('**/*.css');
	gulp.watch('**/*.html');
	gulp.watch('**/*.less');
	console.log("this should be logging");
});


gulp.task('default', ['styles', 'structure', 'func','watch']);

db.on('connect', function(){
	console.log('you have connected to the database');
});

db.on('error', function(err){
	console.warn('There was an error connecting to the database ' + err);
});


app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

app.use(morgan('dev'));


app.post('/email', function(req, res){
	
	var element = '<p>' + req.body.content + '<br>' + req.body.email + '</p>',
 	 sender = '"' + req.body.name + '"' + ' '  + '<' + req.body.email + '>';
      mailer.sendMessage(element, sender, req.body.subject, req.body.email, function(fail, suc){
      	
      	fail ? res.send(false) : res.send(suc);
      });

});

app.post('/add', function(req, res){
	
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(req.body.pass, salt, function(err, hash){
	
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
	
	db.users.findOne({ "user": req.body.user}, function(err, doc){
		
		if(!!doc){

			bcrypt.compare(req.body.pass, doc.pass, function(err, bool){

				bool === true ? res.json(doc) : res.send(false);

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
	//res.send();
});

app.get('/profile/:id', function(req, res){
	var id = req.params.id;
	
	db.users.findOne({_id: mongojs.ObjectId(id)}, function(err, docs){
	
		res.json(docs);
	});
});

app.post('/wants', function(req, res){
 	
 	db.users.update({user: req.body.user}, {$push:{wants: req.body}}, function(err, doc){
 	
 		res.json(doc);
 	});	
});

app.post('/day', function(req, res){
	
 	db.users.update({user: req.body.user}, {$push:{daily: req.body}}, function(err, doc){
 	
 		res.json(doc);
 	});	

});

app.put('/day/:id', function(req, res){
	var id = req.params.id;
	
	db.users.update( { _id: mongojs.ObjectId(id) }, { $pop: { daily: 1 } }, function(err, docs){
	
		res.json(docs);
	});

});

app.put('/week/:id', function(req, res){
	var id = req.params.id;
	
	db.users.update( { _id: mongojs.ObjectId(id) }, { $pop: { weekly: 1 } }, function(err, docs){
	
		res.json(docs);
	});

});

app.put('/invest/:id', function(req, res){
	var id = req.params.id;
	
	db.users.update( { _id: mongojs.ObjectId(id) }, { $pop: { investment: 1 } }, function(err, docs){
	
		res.json(docs);
	});

});

app.put('/bill/:id', function(req, res){
	var id = req.params.id;
	
	db.users.update( { _id: mongojs.ObjectId(id) }, { $pop: { bills: 1 } }, function(err, docs){
		
		res.json(docs);
	});

});

app.put('/wants/:id', function(req, res){
	var id = req.params.id;
	
	db.users.update( { _id: mongojs.ObjectId(id) }, { $pop: { wants: 1 } }, function(err, docs){
		
		res.json(docs);
	});

});

app.post('/invest', function(req, res){
	
 	db.users.update({
 		user: req.body.user
 		}, {
 		$push:{
 			investment: req.body
 		}}, function(err, doc){
 		
 		res.json(doc);
 	});	

});


app.post('/week', function(req, res){

 	db.users.update({
 		user: req.body.user
 		}, {
 		$push:{
 			weekly: req.body
 		}}, function(err, doc){
 		
 		res.json(doc);
 	});	
});

app.put('/maker/:id', function(req, res){
	
	var id = req.params.id;
	
	db.users.findAndModify({
		query: {_id:mongojs.ObjectId(id)},
		update: {$set: {have: req.body.have}},
		new: true
	}, function(err, doc){
		res.json(doc);
	});
});

app.put('/free/:id', function(req, res){
	
	var id = req.params.id;
	
	db.users.findAndModify({
		query: {_id:mongojs.ObjectId(id)},
		update: {$set: {free: req.body.free}},
		new: true
	}, function(err, doc){
		res.json(doc);
	});
});

app.put('/emer/:id', function(req, res){
	
	var id = req.params.id;
		db.users.findAndModify({
			query: {_id:mongojs.ObjectId(id)},
			update: {$set: {emergency: req.body.emergency}},
			new: true
	}, function(err, doc){
		res.json(doc);
	});
});


app.use(express.static(__dirname + '/manageu'))
	.listen(port, function(){
		console.log('Your server is running on port ' + port);
});

