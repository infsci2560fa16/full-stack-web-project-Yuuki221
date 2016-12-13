/*
	This File handle the listening home DOM manipulation 
*/
var playBtnSvg = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 41.999 41.999" style="enable-background:new 0 0 41.999 41.999;" xml:space="preserve" width="32" height="32">' +
				'<path d="M36.068,20.176l-29-20C6.761-0.035,6.363-0.057,6.035,0.114C5.706,0.287,5.5,0.627,5.5,0.999v40 c0,0.372,0.206,0.713,0.535,0.886c0.146,0.076,0.306,0.114,0.465,0.114c0.199,0,0.397-0.06,0.568-0.177l29-20 c0.271-0.187,0.432-0.494,0.432-0.823S36.338,20.363,36.068,20.176z"/>' + 
				'</svg>';
var pauseBtnSvg = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32; " xml:space="preserve" width="32" height="32" style="fill: #f6f5f3">' +
					'<g>' +
						'<g id="pause">' + 
					'<g>' +
					'<rect x="4" style="fill:#f6f5f3;" width="8" height="32"/>' + 
					'<rect x="20" style="fill:#f6f5f3;" width="8" height="32"/>' + 
					'</g>' + 
					'</g>' + 
					'</g>' + 
					'</svg>';

window.addEventListener('load', function(){
	// load focus now tab 

	var subSectionTitle = document.getElementById('sub-content-title');
	var subSectionContent = document.getElementById('sub-content-ul');
	var titleSection = document.getElementById('sub-content-title');
	
	subSectionTitle.innerHTML = 'Focus Now';

	// XMLHttp Request for loading focus now content 
	var focusNowSongxhrq = new XMLHttpRequest();
	var focusNowSongURL = 'http://127.0.0.1:3000/getFocusTrack';
	var volumeAdjusterHTML = '<h3 class="ripple-focus-track-name">{%TrackName%}</h3>' + 
							 '<div class="ripple-music-wrap">' + 
							 	'<audio class="ripple-music" id="ripple-music-focus-{%TrackID%}" src="{%MusicSRC%}"></audio>' + 
							 '</div>' +
							 '<div class="ripple-volume-adjuster-wrap" id="ripple-volume-{%TrackID%}" style="width: 300px;">' + 
							 	'<span class="ripple-volume-inner" id="ripple-volume-inner-{%TrackID%}" style="width: 0;"></span>' +
							 '</div>';

	focusNowSongxhrq.open('get', focusNowSongURL, true);
	focusNowSongxhrq.onreadystatechange = function(){
		if(focusNowSongxhrq.readyState === XMLHttpRequest.DONE){
			var focusTracks = JSON.parse(focusNowSongxhrq.responseText);

			// build Focus Now Section 
			titleSection.innerHTML = 'Focus Now';
			var playBtn = document.createElement('span');
			playBtn.setAttribute('class', 'ripple-play-btn-wrap');
			playBtn.setAttribute('id', 'ripple-play-btn-wrap');
			playBtn.innerHTML = playBtnSvg;

			titleSection.append(playBtn);

			playBtn.addEventListener('click', toggleAllFocusTrack);

			// build main content 
			for(var key in focusTracks){
				var newAdjusterHTML = volumeAdjusterHTML;
				newAdjusterHTML = newAdjusterHTML.replace('{%TrackName%}', focusTracks[key]['track_name']);
				newAdjusterHTML = newAdjusterHTML.replace(/{%TrackID%}/g, focusTracks[key]['track_id']);
				newAdjusterHTML = newAdjusterHTML.replace('{%MusicSRC%}', focusTracks[key]['track_url'])

				var newLi = document.createElement('li');
				newLi.setAttribute('class', 'focus-track-li');
				newLi.setAttribute('id', 'focus-track-li-' + key);
				newLi.innerHTML = newAdjusterHTML;

				subSectionContent.append(newLi);
				var currentVolumeBar = document.getElementById('ripple-volume-' + focusTracks[key]['track_id']);
				currentVolumeBar.addEventListener('click', function(event){
					changeVolumeBar(event);
				});
			}
		}
	}
	focusNowSongxhrq.send(null);

	/*
		handler for click on all tracks 
	*/

	var allSongLink = document.getElementById('navigation-item-all-tracks');
		allSongLink.addEventListener('click', loadAllSongs);
});


/*
	Handler for toggling play all track 
*/

function toggleAllFocusTrack(){
	var track1 = document.getElementById('ripple-music-focus-1'),
		track2 = document.getElementById('ripple-music-focus-2'),
		track3 = document.getElementById('ripple-music-focus-3'),
		track4 = document.getElementById('ripple-music-focus-4'),
		track5 = document.getElementById('ripple-music-focus-5'),
		playBtnArea = document.getElementById('ripple-play-btn-wrap');

	var volumeBar1 = document.getElementById('ripple-volume-inner-1'),
		volumeBar2 = document.getElementById('ripple-volume-inner-2'),
		volumeBar3 = document.getElementById('ripple-volume-inner-3'),
		volumeBar4 = document.getElementById('ripple-volume-inner-4'),
		volumeBar5 = document.getElementById('ripple-volume-inner-5');

	if(track1.paused && track2.paused && track3.paused && track4.paused && track5.paused){
		track1.play();
		track2.play();
		track3.play();
		track4.play();
		track5.play();
		playBtnArea.innerHTML = pauseBtnSvg;
		// console.log(track1.volume);
		// set volume bar  
		volumeBar1.style.width = track1.volume*100 + '%';
		volumeBar2.style.width = track2.volume*100 + '%';
		volumeBar3.style.width = track3.volume*100 + '%';
		volumeBar4.style.width = track4.volume*100 + '%';
		volumeBar5.style.width = track5.volume*100 + '%';
	}else{
		track1.pause();
		track2.pause();
		track3.pause();
		track4.pause();
		track5.pause();
		playBtnArea.innerHTML = playBtnSvg;
	}
}

/*
	Function for calculate current item position
*/

function getPos(element, direction){
	if(direction.trim().toLowerCase()==='left'){
		// deal with body element
		var xPos = 0;
		while(element){
			if(element.tagName == 'BODY'){
				var xScroll = element.scrollLeft || document.documentElement.scrollLeft;

				xPos+=(element.offsetLeft - xScroll + element.clientLeft);
			}else{
				xPos+=(element.offsetLeft - element.scrollLeft + element.clientLeft);
			}
			element = element.offsetParent;
		}
		return xPos;
	}else{
		// top position 
		var yPos = 0;
		while(element){
			if(element.tagName === 'BODY'){
				var yScroll = element.scrollTop || document.documentElement.scrollTop;
				yPos+=(element.offsetTop - yScroll + element.clientTop);
			}else{
				yPos+=(element.offsetTop - element.scrollTop + element.clientTop);
			}
			element = element.offsetParent;
		}
		return yPos;
	}
}

/*
	handler for click on volume bar 
*/

function changeVolumeBar(event){
	var order = event.target.getAttribute('id').indexOf('inner')>-1? event.target.getAttribute('id').substring(20):event.target.getAttribute('id').substring(14);
	console.log(order);
	var totalBarLen = 300;
	var volumeBar = document.getElementById('ripple-volume-inner-' + order);
	var volumeLen = getPos(volumeBar, 'left');

	var currentLen = event.clientX;
	var curTrack = document.getElementById('ripple-music-focus-'+order);
	// console.log(currentLen);
	// console.log(volumeLen);
	curTrack.volume = (currentLen - volumeLen)/totalBarLen;
	// console.log((currentLen - volumeLen)/totalBarLen);
	volumeBar.style.width = curTrack.volume*100 + '%';
}

/*
	handler for single song play button
*/

function togglePlayOneSong(event){
	console.log(event.target);
	var curId = event.target.id.substring(21);
	console.log(curId);
	var curSong = document.getElementById('ripple-music-all-' + curId);
	if(curSong.paused || curSong.ended){
		curSong.play();
		event.target.innerHTML = 'Pause the Track';
	}else{
		curSong.pause();
		event.target.innerHTML = 'Play the Track';
	}
}

/*
	handler for like a single song 
*/

function toggleLikeSong(event){
	if(sessionStorage.getItem('login') === undefined || sessionStorage.getItem('login') === 0){
		alert('To add songs to your collection you must register or login in first');
		return;
	}

	// request to increase the like of current song
	var addLikexhrq = new XMLHttpRequest();
	var songId = event.target.id.substring(16);
	console.log(songId);
	var addLikeURL = 'http://127.0.0.1:3000/likeTheSong?song_id=' + songId + '&user_id=' + sessionStorage.getItem('user_id');
	addLikexhrq.open('get', addLikeURL, true);

	addLikexhrq.onreadystatechange = function(){
		if(addLikexhrq.readyState === XMLHttpRequest.DONE){
			var responseStatus = JSON.parse(addLikexhrq.responseText);
			if(responseStatus['message'] === 'bad'){
				alert('update failed');
			}else{
				alert('add song to your collection');
			}
		}
	};
	addLikexhrq.send(null);
}

/*
	Listener for click on all sound 
*/

function loadAllSongs(){
	var subSectionTitle = document.getElementById('sub-content-title');
	var subSectionContent = document.getElementById('sub-content-ul');
	var titleSection = document.getElementById('sub-content-title');

	titleSection.innerHTML = 'All tracks';

	var tracksHTML = '<span class="ripple-song-name" id="ripple-all-track-{%TrackID%}">{%TrackName%}</span><br>' +
					 '<span class="ripple-artist"> By: {%TrackArtist%}</span><br>' + 
					 '<span class="ripple-all-track-play-btn ripple-play-btn-wrap" id="ripple-play-btn-wrap-{%TrackID%}"></span>' + 
					 '<span class="ripple-like-btn-wrap" id="ripple-like-btn-{%TrackID%}">Like</span>' + 
					 '<span class="ripple-audio-wrap">' +
					 '<audio class="ripple-music" id="ripple-music-all-{%TrackID%}" src="{%MusicSRC%}"></audio>' + 
					 '</span>';

	var allTracksxhrq = new XMLHttpRequest();
	var allTracksURL = 'http://127.0.0.1:3000/getAllTracks';
	var subsectionContent = document.getElementById('sub-content-ul');
	allTracksxhrq.open('get', allTracksURL, true);

	subsectionContent.innerHTML = '';
	allTracksxhrq.onreadystatechange = function(){
		if(allTracksxhrq.readyState === XMLHttpRequest.DONE){
			var allTracksRes = JSON.parse(allTracksxhrq.responseText);
			for(var key in allTracksRes){
				var curTrack = allTracksRes[key];
				var newHTML = tracksHTML;

				newHTML = newHTML.replace(/{%TrackID%}/g, curTrack['track_id']);
				newHTML = newHTML.replace('{%TrackName%}', curTrack['track_name']);
				newHTML = newHTML.replace('{%TrackArtist%}', curTrack['track_artist']);
				newHTML = newHTML.replace('{%MusicSRC%}', curTrack['track_url']);

				var newLi = document.createElement('li');
				newLi.setAttribute('class', 'ripple-all-track-li');
				newLi.setAttribute('id', 'ripple-all-track-'+curTrack['track_id']);
				newLi.innerHTML = newHTML;
				subsectionContent.appendChild(newLi);

				var curPlayBtnArea = document.getElementById('ripple-play-btn-wrap-' + curTrack['track_id']);
				curPlayBtnArea.innerHTML = 'Play the Track';

				curPlayBtnArea.addEventListener('click', togglePlayOneSong);

				var curLikeBtn = document.getElementById('ripple-like-btn-' + curTrack['track_id']);
				curLikeBtn.addEventListener('click', toggleLikeSong);
			}
		}
	};
	allTracksxhrq.send(null);
}