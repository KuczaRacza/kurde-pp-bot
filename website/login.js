let login_button = () => {
	let login = {}
	login.discord = document.getElementById("log-discord").value;
	login.password = document.getElementById("log-password").value;
	APIloginUser(login).then((res) => {
		res.json().then((obj) => {
			if (obj.loged == true) {
				cookie.token = obj.token
				writeCookie();
				let new_loc = window.location.toString().split("#");
				if (new_loc.length == 2) {
					window.location = new_loc[1]
				}

			}
		})

	})
}
let register_form = () => {
	let userdata = {}
	userdata.nick = document.getElementById('reg-nick').value
	userdata.discord = document.getElementById('reg-tag').value
	userdata.password = document.getElementById('reg-passwd').value
	APIaddUser(userdata).then((res) => {
		res.json().then((obj) => {
			console.log(obj)
			if (obj.added == false || obj.added == undefined) {

			}
			else {
				cookie.token = obj.token
				writeCookie();
				window.location = "/";

			}
		})
	})
}