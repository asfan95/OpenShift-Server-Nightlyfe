 //Lets require/import the HTTP module
var express = require('express'),
	app = express(),
	server= require('http').createServer(app),
	io= require('socket.io').listen(server),
	mongoose = require('mongoose'),
	path = require('path'),
	fs = require('fs'); // required for file serving

app.use(express.static(__dirname + '/public'));
const PORT=3000; 
//Create a server
server.listen(PORT);
console.log("server is running at port: 3000");

mongoose.connect('mongodb://localhost/nightLyfe', function(err){
	if(err)
	{
		console.log(err);
	}else{
		console.log("connected to mongodb");
	}
});

var clubCommentSchema= mongoose.Schema({
	place_Name:String,
	person_Name:String,
	text:String,
	created: Date,
	location:{lat:0,long:0}
});
var clubComments = mongoose.model("clubComments",clubCommentSchema);

var chatMessagesSchema= mongoose.Schema({
	place_Name:String,
	person_Name:String,
	text:String,
	created: Date,
	location:{lat:0,long:0}
});
var chatMessages = mongoose.model("chatMessages",chatMessagesSchema);

var clubPhotoSchema= mongoose.Schema({
	place_Name:String,
	person_Name:String,
	image:String,
	created: Date,
	buffer: String
});
var clubPhotos = mongoose.model("clubPhotos",clubPhotoSchema);

io.sockets.on('connection', function(socket){

	// clubcomments.remove({},function(err,doc){
	// 				if(err)throw err;
	// 		});
	// socket.on('server function', function(data){
	// 	console.log("client called the server");	
	// 	io.sockets.emit('client function', {});
	// });

//---------------------------------------------------------------------------------------------------
// These functions control the club comments
	socket.on('New Club Comment', function(data){

		var newClubcomment= new clubComments({
			place_Name:data.place_Name,
			person_Name:data.person_Name,
			text:data.text,
			created: data.created
			});

		newClubcomment.save(function(err){
			if(err)
				throw err;
		
			clubComments.find({place_Name:data.place_Name},function(err,doc)
			{
				if(err)throw err;

				io.sockets.emit('refresh Club Comments',doc);
			});
		
		});
	});
	socket.on('find Club Comment', function(data){
		clubComments.find(data, function(err,doc)
		{
			if(err)throw err;

			io.sockets.emit('refresh Club Comments',doc);
		});
	});
//---------------------------------------------------------------------------------------------------
// These functions control the club comments
	socket.on('New Chat Message', function(data){

		var newChatMessages = new chatMessages({
			place_Name:data.place_Name,
			person_Name:data.person_Name,
			text:data.text,
			created: data.created
			});

		newChatMessages.save(function(err){
			if(err)
				throw err;
		
			chatMessages.find({place_Name:data.place_Name},function(err,doc)
			{
				if(err)throw err;

				io.sockets.emit('refresh Chat Message',doc);
			});
		
		});
	});
	socket.on('find Chat Message', function(data){
		chatMessages.find(data, function(err,doc)
		{
			if(err)throw err;

			io.sockets.emit('refresh Chat Message',doc);
		});
	});
//---------------------------------------------------------------------------------------------------
// These functions control the club Photos
	socket.on('New Club Photo', function(data){
		//  fs.readFile(__dirname + '/images/image.jpg', function(err, buf){
		// fs.readFile(data.buffer.fullPath, function(err, buf){
		// 	console.log(buf);
		// 	var newclubPhotos= new clubPhotos({
		// 		image:true,
		// 		buffer: buf,
		// 		place_Name:data.place_Name,
		// 		person_Name:data.person_Name,
		// 		created: data.created
		// 		});

		// 	newclubPhotos.save(function(err){
		// 		if(err)
		// 			throw err;
			
		// 		clubPhotos.find({},function(err,doc)
		// 		{
		// 			if(err)throw err;

		// 			io.sockets.emit('refresh Club Photo',doc);
		// 		});
			
		// 	});
		// });
	});
	socket.on('find Club Photo', function(data){
		// clubPhotos.find({}, function(err,doc)
		// {
		// 	if(err)throw err;

		// 	io.sockets.emit('refresh Club Photo',doc);
		// });
	});
});