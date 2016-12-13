/*
	The File dealing with login and register events 
*/

window.addEventListener('load', function(){
	var loginBtn = document.getElementById('ripple-login-btn');
	loginBtn.addEventListener('click', loginListener);
});

/*
	Handler for login 
*/

function loginListener(){
	// check if the user input is valid 
	var enterEmail = document.getElementById('login-email').value.trim();
	var enterPassword = document.getElementById('login-password').value.trim();

	if(enterEmail === undefined || enterEmail.length === 0){
		alert('Please enter your email to login');
		return;
	}

	if(enterPassword === undefined || enterPassword.length === 0){
		alert('Please enter your password to login');
		return;
	}

	var loginxhrq = new XMLHttpRequest();
	var loginURL = 'http://127.0.0.1:3000/login?userEmail=' + enterEmail;
	loginxhrq.open('get', loginURL, true);

	loginxhrq.onreadystatechange = function(){
		if(loginxhrq.readyState === XMLHttpRequest.DONE){
			var storedPassword = JSON.parse(loginxhrq.responseText)['password'];
			if(storedPassword === undefined || storedPassword.length ===0){
				alert('The email you entered does not registered yet');
			}
			if(storedPassword === enterPassword){
				var userID = JSON.parse(loginxhrq.responseText)['user_id'];
				sessionStorage.setItem('user_id', '' + userID);
				sessionStorage.setItem('login', 'true');
				window.location.href = 'home.html';
				alert('Login Success');
			}else{
				alert('Password is wrong');
			}
		}
	};
	loginxhrq.send(null);
}