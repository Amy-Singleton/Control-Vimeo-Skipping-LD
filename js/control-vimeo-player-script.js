var iframe = document.querySelector('iframe');
var player = new Vimeo.Player(iframe);
var pageURL = window.location.href;
var videoURL = player.getVideoUrl().then(function(url) {
    // url = the vimeo.com url for the video
    }).catch(function(error) {
	switch (error.name) {
	    case 'PrivacyError':
		// the url isn’t available because of the video’s privacy setting
		break;
	    default:
		// some other error occurred
		break;
	}
});

player.getDuration().then(function(duration) {
	//var videolength = duration.seconds;
	console.log('Video Length:',duration);
}).catch(function(error) {
	// an error occurred
});
function createCookie(name,value,days) {
	var pageURL = window.location.href;
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path="+pageURL+";";
}
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
player.on('play', function() {
    console.log('played the video!'); 
});
player.getVideoTitle().then(function(title) {
    console.log('Title: ', title);
});
player.getVideoId().then(function(id) {
    // id = the video id
    var video_cookie = 'vimeo_video_progress_'+id;
    var x = readCookie(video_cookie);
    if (x) {
	player.pause().then(function() {
	    // the video was paused
	}).catch(function(error) {
	    switch (error.name) {
		case 'PasswordError':
		    // the video is password-protected and the viewer needs to enter the
		    // password first
		    break;
	
		case 'PrivacyError':
		    // the video is private
		    break;
	
		default:
		    // some other error occurred
		    break;
	    }
	});
	console.log('Video Paused!');
	    console.log(x);
		function getConfirmation(){
		    var retVal = confirm("Do you want to resume the video where you left off?");
		    if( retVal == true ){
		       console.log ("User wants to continue!");
		       curtime = x;
			player.setCurrentTime(curtime).then(function(seconds) {
			    // seconds = the actual time that the player seeked to
			    player.play().then(function() {
				// the video was played
			    }).catch(function(error) {
				switch (error.name) {
				    case 'PasswordError':
					// the video is password-protected and the viewer needs to enter the
					// password first
					break;
			    
				    case 'PrivacyError':
					// the video is private
					break;
			    
				    default:
					// some other error occurred
					break;
				}
			    });
			}).catch(function(error) {
			    switch (error.name) {
				case 'RangeError':
				    // the time was less than 0 or greater than the video’s duration
				    break;
			
				default:
				    // some other error occurred
				    break;
			    }
			});
			
			player.on('timeupdate', function(data) {
			    if(data.seconds < curtime + 1 && data.seconds > curtime) {
			    // Above is where I hack it.  I only update the current time if the timeupdate is less than a second ago (therefore proabaly not seeked to).  This stops the function from just updating curtime to the seeked time.  But I feel it's not the best way.
				curtime = data.seconds;
			    }
			});
		       
			player.on('seeked', function(data) {
			    player.getCurrentTime().then(function(seconds) {
				// seconds = the current playback position
				curtime = seconds;
			    }).catch(function(error) {
				// an error occurred
			    });
			    if(data.seconds > curtime) {
				player.setCurrentTime(curtime);
			    }
			});
			  player.getVideoId().then(function(id) {
			    // id = the video id
			    var video_cookie = 'vimeo_video_progress_'+id;
			 });
		       return true;
		    }
		    else{
		       console.log ("User does not want to continue!");
			player.getVideoId().then(function(id) {
			    // id = the video id
			    var video_cookie = 'vimeo_video_progress_'+id;
			    value = "";
			     document.cookie = video_cookie+"="+value+"; path="+pageURL+";";
			    curtime = 0;
			    console.log(curtime);
			    player.setCurrentTime(curtime).then(function(seconds) {
				// seconds = the actual time that the player seeked to
			    }).catch(function(error) {
				switch (error.name) {
				    case 'RangeError':
					// the time was less than 0 or greater than the video’s duration
					break;
			    
				    default:
					// some other error occurred
					break;
				}
			    });
			    player.play().then(function() {
				// the video was played
			    }).catch(function(error) {
				switch (error.name) {
				    case 'PasswordError':
					// the video is password-protected and the viewer needs to enter the
					// password first
					break;
			    
				    case 'PrivacyError':
					// the video is private
					break;
			    
				    default:
					// some other error occurred
					break;
				}
			    });
			    player.on('timeupdate', function(data) {
				if(data.seconds < curtime + 1 && data.seconds > curtime) {
				// Above is where I hack it.  I only update the current time if the timeupdate is less than a second ago (therefore proabaly not seeked to).  This stops the function from just updating curtime to the seeked time.  But I feel it's not the best way.
				    curtime = data.seconds;
				}
			    });
			    player.on('seeked', function(data) {
				if(data.seconds > curtime) {
				    player.setCurrentTime(curtime);
				}
			    });
			});
			return false;
		    }
		}
    }
    else {
	curtime = 0;
	console.log(curtime);
	    player.setCurrentTime(curtime).then(function(seconds) {
		// seconds = the actual time that the player seeked to
	    }).catch(function(error) {
		switch (error.name) {
		    case 'RangeError':
			// the time was less than 0 or greater than the video’s duration
			break;
		    default:
			// some other error occurred
			break;
		}
	    });
	    player.on('timeupdate', function(data) {
		if(data.seconds < curtime + 1 && data.seconds > curtime) {
		// Above is where I hack it.  I only update the current time if the timeupdate is less than a second ago (therefore proabaly not seeked to).  This stops the function from just updating curtime to the seeked time.  But I feel it's not the best way.
		    curtime = data.seconds;
		}
	    });
	    player.on('seeked', function(data) {
		if(data.seconds > curtime) {
		    player.setCurrentTime(curtime);
		}
	    });
    }
    getConfirmation();
}).catch(function(error) {
    // an error occurred
});

window.onbeforeunload = function(event) {
    // do stuff here
     player.on('timeupdate', function(data_progress) {
	var videoEnded = player.getEnded().then(function(ended) {
	    // ended = whether or not the video has ended
	}).catch(function(error) {
	    // an error occurred
	});
	player.getVideoId().then(function(id) {
	    // id = the video id
	    var video_cookie = 'vimeo_video_progress_'+id;
	    value = "";
	    document.cookie = video_cookie+"="+value+"; path="+pageURL+";";
	    createCookie(video_cookie,data_progress.seconds,120);
	       
	}).catch(function(error) {
	    // an error occurred
	});
	  
    });
    //return 'You have not completed the video. Are you sure you want to navigate away?';
}