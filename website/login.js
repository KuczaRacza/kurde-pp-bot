let login_button = () => {
	let login = {}
	login.discord = document.getElementById("log-discord").value;
	login.password = document.getElementById("log-password").value;
	APIloginUser(login).then((obj) => {
		if (obj.loged == true) {

			cookie.token = obj.token
			writeCookie();
			APImyUserInfo().then(info => {
				let new_loc = window.location.toString().split("#");
				cookie.nick = info.nick
				writeCookie()
				if (new_loc.length == 2) {
					window.location = window.location.href.split('/')[1] + new_loc[1]

				}
			})


		}


	})
}
let register_form = () => {
	let userdata = {}
	userdata.nick = document.getElementById('reg-nick').value
	userdata.discord = document.getElementById('reg-tag').value
	userdata.password = document.getElementById('reg-passwd').value
	APIaddUser(userdata).then((obj) => {
		console.log(obj)
		if (obj.added == false || obj.added == undefined) {

		}
		else {
			cookie.token = obj.token
			writeCookie();
			window.location = "/account.html";
		}
	})
}