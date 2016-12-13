/*
	Dealing with user-account page routes 
*/

window.addEventListener('load',function(){
	// only if the user is logged in the page can have access to data 
	if(sessionStorage.getItem('login')===undefined || sessionStorage.getItem('login') === 'false'){
		alert('You must login to see your account content');
		window.location.href = 'index.html';
		
	}else{
		// if the user already logged in some content 
		var favoLink = document.getElementById('navigation-item-favo');
		favoLink.addEventListener('click', loadLikeTracks);

		var blogLink = document.getElementById('navigation-item-blog');
		blogLink.addEventListener('click', LoadBlogPost);
	}
});


/*
	Handlers 
*/

// handlers for see favorite songs of the user 

function loadLikeTracks(){
	var curUserID = sessionStorage.getItem('user_id');

	var contentSection = document.getElementById('sub-content-content');
	var contentHeading = document.getElementById('sub-content-title');

	var getLikeTracksxhrq = new XMLHttpRequest();
	var getLikeTracksURL = 'http://127.0.0.1:3000/getLikeTracks?userID=' + curUserID;

	var likeTrackHTML = '<span class="ripple-song-name" id="ripple-like-track-{%TrackID%}">{%TrackName%}</span><br>' +
					 	'<span class="ripple-artist"> By: {%TrackArtist%}</span><br>' + 
					 	'<span class="ripple-play-btn-wrap" id="ripple-play-btn-wrap-{%TrackID%}">Play the Track</span>' + 
					 	'<span class="ripple-like-btn-wrap" id="ripple-like-btn-{%TrackID%}">Dislike</span>' + 
					 	'<span class="ripple-audio-wrap">' +
					 	'<audio class="ripple-music" id="ripple-music-like-{%TrackID%}" src="{%MusicSRC%}"></audio>';

	getLikeTracksxhrq.open('get', getLikeTracksURL, true);

	getLikeTracksxhrq.onreadystatechange = function(){
		if(getLikeTracksxhrq.readyState === XMLHttpRequest.DONE){
			var tracks = JSON.parse(getLikeTracksxhrq.responseText);
			contentHeading.innerHTML = 'My favorite Track';
			contentSection.innerHTML = '';
			for(var key in tracks){
				var curSong = tracks[key];
				var likeSongHTML = likeTrackHTML;
				likeSongHTML = likeSongHTML.replace(/{%TrackID%}/g, curSong['song_id']);
				likeSongHTML = likeSongHTML.replace('{%TrackName%}', curSong['song_name']);
				likeSongHTML = likeSongHTML.replace('{%TrackArtist%}', curSong['song_artist']);
				likeSongHTML = likeSongHTML.replace('{%MusicSRC%}', curSong['song_url']);

				var newLi = document.createElement('li');
				newLi.setAttribute('class', 'ripple-like-track-li');
				newLi.setAttribute('id', 'ripple-music-like-li-' + curSong['song_id']);

				newLi.innerHTML = likeSongHTML;
				contentSection.appendChild(newLi);

				var playLikeBtn = document.getElementById('ripple-play-btn-wrap-'+curSong['song_id']);
				playLikeBtn.addEventListener('click', togglePlayOneSong);

				var disLikeBtn = document.getElementById('ripple-like-btn-' + curSong['song_id']);
				disLikeBtn.addEventListener('click', disLikeTrack);
			}
		}
	};
	getLikeTracksxhrq.send(null);
}
/*
	handler for single song play button
*/

	function togglePlayOneSong(event){
		console.log(event.target);
		var curId = event.target.id.substring(21);
		console.log(curId);
		var curSong = document.getElementById('ripple-music-like-' + curId);
		if(curSong.paused || curSong.ended){
			curSong.play();
			event.target.innerHTML = 'Pause the Track';
		}else{
			curSong.pause();
			event.target.innerHTML = 'Play the Track';
		}
	}


// handle retrieve blog post and enter blog post 

function LoadBlogPost(){
	var curUserID = sessionStorage.getItem('user_id');

	var contentSection = document.getElementById('sub-content-content');
	var contentHeading = document.getElementById('sub-content-title');

	var getLikeTracksxhrq = new XMLHttpRequest();
	var getLikeTracksURL = 'http://127.0.0.1:3000/getBlog?userID=' + curUserID;

	var postHTML = '<p class="ripple-post-date">{%PostDate%}</p>' + 
				   '<p class="ripple-post-content">{%PostContent%}</p>' + 
				   '<p class="ripple-post-likes">{%PostLikes%} Likes</p>';

	var enterPost = '<textarea class="ripple-put-blog" id="ripple-put-blog"></textarea>' + 
					'<button class="common-btn ripple-post-btn" id="ripple-post-btn">Post</button>';

	getLikeTracksxhrq.open('get', getLikeTracksURL, true);

	getLikeTracksxhrq.onreadystatechange = function(){
		if(getLikeTracksxhrq.readyState === XMLHttpRequest.DONE){
			var postsRes = JSON.parse(getLikeTracksxhrq.responseText);
			contentHeading.innerHTML = 'My Blog Posts';
			// clear the previous content 
			contentSection.innerHTML = '';
			for(var key in postsRes){
				var curPost = postsRes[key];
				console.log(curPost);
				var newHTML = postHTML;
				newHTML = newHTML.replace('{%PostDate%}', curPost['blog_date']);
				newHTML = newHTML.replace('{%PostContent%}', curPost['content']);
				newHTML = newHTML.replace('{%PostLikes%}', curPost['likes']);

				var newLi = document.createElement('li');
				newLi.setAttribute('class', 'ripple-post-li');
				newLi.innerHTML = newHTML;

				contentSection.appendChild(newLi);
			}

			var enterDiv = document.createElement('div');
			enterDiv.setAttribute('id', 'ripple-post-area');
			enterDiv.innerHTML = enterPost;

			contentSection.appendChild(enterDiv);

			// add listener to post blog button 
			var postBtn = document.getElementById('ripple-post-btn');
			postBtn.addEventListener('click', postBlog);
		}
	};

	getLikeTracksxhrq.send(null);
}

/*
	Handler for enter blog post 
*/

function postBlog(){
	var postContent = document.getElementById('ripple-put-blog').value.trim();

	if(postContent === undefined || postContent.length === 0){
		alert('Please enter something to post');
		return;
	}

	var postBlogxhrq = new XMLHttpRequest();
	var postBlogURL = 'http://127.0.0.1:3000/postBlog';
	var contentSection = document.getElementById('sub-content-content');
	var postHTML = '<p class="ripple-post-date">{%PostDate%}</p>' + 
				   '<p class="ripple-post-content">{%PostContent%}</p>' + 
				   '<p class="ripple-post-likes">{%PostLikes%} Likes</p>';
	var enterPost = '<textarea class="ripple-put-blog" id="ripple-put-blog"></textarea>' + 
				   '<button class="common-btn ripple-post-btn" id="ripple-post-btn">Post</button>';

	// get current date
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();

	if(dd<10) dd = '0' + dd;
	if(mm<10) mm = '0' + mm;

	today = yyyy + '-' + mm + '-' + dd;

	var newPost = {};
	newPost['userID'] = sessionStorage.getItem('user_id');
	newPost['content'] = postContent;
	newPost['date'] = '' + today;
	newPost['like'] = 0;

	postBlogxhrq.open('post', postBlogURL, true);
	postBlogxhrq.onreadystatechange = function(){
		if(postBlogxhrq.readyState === XMLHttpRequest.DONE){
			var resMsg = JSON.parse(postBlogxhrq.responseText);
			if(resMsg['message'] === 'good'){
				alert('Add a New Entry!');
				postHTML = postHTML.replace('{%PostDate%}', today);
				postHTML = postHTML.replace('{%PostContent%}', postContent);
				postHTML = postHTML.replace('{%PostLikes%}', 0);

				var newLi = document.createElement('li');
				newLi.innerHTML = postHTML;

				var postArea = document.getElementById('ripple-post-area');
				contentSection.removeChild(postArea);
				contentSection.appendChild(newLi);

				var enterDiv = document.createElement('div');
				enterDiv.setAttribute('id', 'ripple-post-area');
				enterDiv.innerHTML = enterPost;

				contentSection.appendChild(enterDiv);
			}else{
				alert('New Post Failed!');
			}

		}
	};
	postBlogxhrq.send(JSON.stringify(newPost));
}

/*
	Handler for dislike the track 
*/

function disLikeTrack(){
	var removeLikexhrq = new XMLHttpRequest();
	var songId = event.target.id.substring(16);
	console.log(songId);
	var removeLikeURL = 'http://127.0.0.1:3000/removeLikeSong?songID=' + songId + '&userID=' + sessionStorage.getItem('user_id');
	removeLikexhrq.open('get', removeLikeURL, true);

	removeLikexhrq.onreadystatechange = function(){
		if(removeLikexhrq.readyState === XMLHttpRequest.DONE){
			var responseStatus = JSON.parse(removeLikexhrq.responseText);
			if(responseStatus['message'] === 'bad'){
				alert('update failed!');
			}else{
				alert('remove the song from your favorite collection');
				// remove the DOM of current song
				var removeLi = document.getElementById('ripple-music-like-li-' + songId);
				var parentUl = document.getElementById('sub-content-content');
				parentUl.removeChild(removeLi);
			}
		}
	};
	removeLikexhrq.send(null);
}
