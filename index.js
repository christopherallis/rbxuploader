var express = require("express");
var bodyParser = require("body-parser");
var MongoClient = require('mongodb').MongoClient;

var mongoUrl = 'mongodb://localhost:27017';
var dbName = "rbxscriptuploader";

var app = express();


function getRandomID(){
	var id = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 10; i++){
		id += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	
	return id;
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/',function(req,res){
	res.status(200).send('Hello World!');
});
app.get('/health',function(req,res){
	res.status(200).send();
});

app.get('/file',function(req,res){
	var id = req.query.id;
	MongoClient.connect(mongoUrl,function(err,client){
		var db = client.db(dbName);
		db.collection('Scripts').findOneAndDelete({id: id},function(err,doc){
			if (!err){
				if (doc && doc.value != null) {
					console.log(doc);
					res.send(doc.value.data);
				} else {
					res.send("Nice try.");
				}
			} else {
				console.log(err);
				res.send("error has occured");
			}
			client.close();
		});
	});
});
app.post('/file',function(req,res){
	var data = req.body.f;
	if (data) {
		var newID = getRandomID();
		MongoClient.connect(mongoUrl,function(err,client){
			var db = client.db(dbName);
			db.collection('Scripts').insertOne({
				id: newID,
				data: data
			});
			
			client.close();
			res.send(newID);
		});
	} else {
		res.send("error - data doesn't exist");
	}
	
});


app.listen(process.env.PORT || 3000);

