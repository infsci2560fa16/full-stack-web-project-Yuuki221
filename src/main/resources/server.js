var mongoose = require('mongoose');
var url = require('url');
var express = require('express');
var querystring = require('querystring');
var path = require('path');
var app = express();
var http = require('http').Server(app);

// configuration for app
app.set('view engine', 'html');
app.set('views', (__dirname + '/public'));
app.use(express.static(path.join('views')));

var db = mongoose.connect('mongodb://localhost:27017/ripples');
var Schema = mongoose.Schema;

mongoose.connection.on('error', function(error){
	console.log('... cannot connect to database ...');
});

mongoose.connection.once('open', function(){
	console.log('Cheers ~, database connected!');
});

/*
	Define Schemas for application 
*/

// songs schema 
var songSchema = new Schema({
	song_id : Number,
	song_name : String,
	song_artist : String,
	song_likes : Number,
	lables : Array,
	song_url : String,
	song_add_date : String
});

// model of song schema 
var Song = mongoose.model('Song', songSchema, 'songs');

/*
	Dealing with route of getFocusTrack
*/

// user schema 
var userSchema = new Schema({
	user_id : Number,
	user_email : String,
	user_password : String,
	blog_id : Number,
	like_track : Array
});

// model of user schema
var User = mongoose.model('User', userSchema);

// Blog schema 
var blogSchema = new Schema({
	blog_id : Number,
	blog_content : String, 
	publish_date : String, 
	blog_likes : Number
});

var Blog = mongoose.model('Blog', blogSchema);

app.all('/', function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	next();
	console.log('in get focus track header configuration');
});

app.all('/getFocusTrack', function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	next();
	console.log('in get focus track header configuration');
});

app.get('/getFocusTrack', function(req, res){
	var findFocusTrackQuery = Song.find({ labels: {'$in' : ['focus']}});
	 findFocusTrackQuery.exec(function(err, focusRes){
		console.log('in getFocusTrack find');
		if(err){
			console.log(err);
			res.send(JSON.stringify({message: 'bad'}));
			return;
		}else{
			var focusSongData = {};
			// build the response object
			for(var i=0; i<focusRes.length; i++){
				var curItem = {};
				curItem['track_id'] = focusRes[i].song_id;
				curItem['track_name'] = focusRes[i].song_name;
				curItem['track_artist']	 = focusRes[i].song_artist;
				curItem['track_url'] = focusRes[i].song_url;

				focusSongData['' + focusRes[i].song_id] = curItem;
			}
			res.send(JSON.stringify(focusSongData));
			return;
		}
	});
});

/*
	Dealing with route of getAllTracks
*/

app.all('/getAllTracks', function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	next();
	console.log('in get all track header configuration');
});

app.get('/getAllTracks', function(req, res){
	var findAllTracksQuery = Song.find();
	findAllTracksQuery.exec(function(err, allTracks){
		if(err){
			console.log(err);
			res.send(JSON.stringify({message: 'good'}));
			return;
		}else{
			var allTracksRes = {};

			for(var i=0; i<allTracks.length; i++){
				var curSong = {};
				curSong['track_id'] = allTracks[i].song_id;
				curSong['track_name'] = allTracks[i].song_name;
				curSong['track_artist'] = allTracks[i].song_artist;
				curSong['track_url'] = allTracks[i].song_url;

				allTracksRes['' + allTracks[i].song_id] = curSong;
			}
			res.send(JSON.stringify(allTracksRes));
			return;
		}
	});
});

/*
	Dealing with route of login 
*/

app.all('/login', function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	next();
	console.log('in get all track header configuration');
});

app.get('/login', function(req, res){
	var userEmail = req.query.userEmail;
	var userInfoQuery = User.find({user_email: userEmail});
	userInfoQuery.exec(function(err, userResult){
		if(err){
			console.log(err);
			res.send(JSON.stringify({}));
			return;
		}else{
			var curUser = userResult[0];
			var userInfo = {};
			userInfo['password'] = curUser['user_password'];
			userInfo['user_id'] = curUser['user_id'];

			res.send(JSON.stringify(userInfo));
			return;
		}
	});
});

/*
	Get Liked tracks
*/

app.all('/getLikeTracks', function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	next();
	console.log('in get all track header configuration');
});

app.get('/getLikeTracks', function(req, res){
	var userID = parseInt(req.query.userID, 10);
	var likeArr;
	var getLikeSongs = User.find({user_id: userID});
	getLikeSongs.exec(function(err, likeSongsRes){
		if(err){
			console.log(err);
			res.send(JSON.stringify({}));
			return;
		}else{
			likeArr = likeSongsRes[0]['like_track'];

			// query song information from Song collection 
			var songInfosQuery = Song.find({song_id : {'$in' : likeArr}});
			songInfosQuery.exec(function(err, likeSongInfoRes){
				if(err){
					console.log(err);
					res.send(JSON.stringify({}));
					return;
				}else{
					var infoRes = {};
					for(var i=0; i<likeSongInfoRes.length; i++){
						var likeSong = likeSongInfoRes[i];
						var curSong = {};

						curSong['song_id'] = likeSong['song_id'];
						curSong['song_name'] = likeSong['song_name'];
						curSong['song_artist'] = likeSong['song_artist'];
						curSong['song_url'] = likeSong['song_url'];

						infoRes['' + likeSong['song_id']] = curSong;
					}
					res.send(JSON.stringify(infoRes));
				}
			});
		}
	});

});

/*
	Get Blog Post Route
*/

app.all('/getBlog', function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	next();
	console.log('in get all track header configuration');
});

app.get('/getBlog', function(req, res){
	var userID = parseInt(req.query.userID, 10);

	// userID and blog_id is the same
	var blogsQuery = Blog.find({blog_id: userID});

	blogsQuery.exec(function(err, blogRes){
		if(err){
			console.log(err);
			return;
		}else{
			var blogEntryRes = {};
			for(var i=0; i<blogRes.length; i++){
				var singlePost = {};

				singlePost['content'] = blogRes[i]['blog_content'];
				singlePost['blog_date'] = blogRes[i]['publish_date'];
				singlePost['likes'] = blogRes[i]['blog_likes'];

				blogEntryRes['' + i] = singlePost;
			}
			res.send(blogEntryRes);
		}
	});
});

/*
	Laod All Blog Post
*/

app.all('/loadAllBlogs', function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	next();
	console.log('in get all track header configuration');
});

app.get('/loadAllBlogs', function(req, res){
	var allBlogsQuery = Blog.find();

	allBlogsQuery.exec(function(err, blogResult){
		if(err){
			console.log(err);
			res.send(JSON.parse({}));
			return;
		}else{
			var blogResponse = {};
			for(var i=0; i<blogResult.length; i++){
				var curBlog = blogResult[i];
				blogResponse['' + i] = curBlog;
			}
			res.send(JSON.stringify(blogResponse)); 
		}
	});
});

/*
	Handle post a blog 
*/

app.all('/postBlog', function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	next();
});

app.post('/postBlog', function(req, res){
	var body = '', userID, content, date, likes;
	req.on('data', function(chunk){
		body+=chunk;
	}).on('end', function(){
		body = JSON.parse(body);
		
		userID = body['userID'];
		content = body['content'];
		date = body['date'];
		likes = body['like'];

		var newblog = new Blog();

		newblog.blog_id = userID;
		newblog.blog_content = content;
		newblog.publish_date = date;
		newblog.blog_likes = likes;

		newblog.save(function(err){
			if(err){
				console.log(err);
				res.send({message: 'bad'});
			}else{
				res.send({message: 'good'});
			}
		});
	});
});

/*
	Handle Like a song track 
*/

app.all('/likeTheSong', function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	next();
});

app.get('/likeTheSong', function(req, res){
	var songId = parseInt(req.query.song_id, 10);
	var userId = parseInt(req.query.user_id, 10);
	var getLikeListQuery = User.find({user_id: userId});

	getLikeListQuery.exec(function(err, Likeresult){
		if(err){
			console.log(err);
			res.send(JSON.stringify({message: 'bad'}));
		}else{
			var likeList = Likeresult[0]['like_track'];
			console.log(likeList);
			if(likeList.indexOf(songId)>-1){
				// if the song user like is already in the users' like list 
				res.send(JSON.stringify({message: 'repeat'}));
			}else{
				// add the new song to list 
				likeList.push(songId);
				User.update({user_id: userId}, {like_track: likeList}, function(err, updateRes){
					if(err){
						console.log(err);
						res.send(JSON.stringify({message: 'bad'}));
					}else{
						res.send(JSON.stringify({message: 'good'}));
					}
				});
			}
		}
	});
});

/*
	Handle remove like song route 
*/

app.all('/removeLikeSong', function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	next();
});

app.get('/removeLikeSong', function(req, res){
	var userID = parseInt(req.query.userID, 10);
	var songID = parseInt(req.query.songId, 10);

	var likeListQuery = User.find({user_id: userID});
	likeListQuery.exec(function(err, likeListRes){
		if(err){
			console.log(err);
			res.send(JSON.stringify({message: 'bad'}));
		}else{
			var curLikeList = likeListRes[0]['like_track'];
			console.log(curLikeList);
			// remove the song
			curLikeList.splice(curLikeList.indexOf(songID), 1);
			console.log(curLikeList);

			User.update({user_id: userID}, {like_track: curLikeList}, function(err, updateRes){
				if(err){
					console.log(err);
					res.send(JSON.stringify({message: 'bad'}));
				}else{
					res.send(JSON.stringify({message: 'good'}));
				}
			});
		}
	});

});

/*
	Some Helper Function
*/

// function for query of the largest song_id

function getMaxID(){
	var currentMaxId = 0;
	var maxIDQuery = Song.find().sort({song_id: -1}).limit(1);
	maxIDQuery.exec(function(err, maxResult){
		if(err){
			return;
		}else{
			if(maxResult.length !== 0){
				currentMaxId = maxResult[0].song_id;
			}
		}
		return currentMaxId;
	});
}

http.listen(3000, function(){
	console.log('Listening on http://127.0.0.1:3000');
});