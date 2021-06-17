let isLoged = () => {
	if (cookie.token == undefined) {
		getCookie()
		if (cookie.token == undefined) {
			window.location = "./login.html#" + window.location;
		}
	}
}
let isNotLoged = () => {
	if (cookie.token != undefined) {
		window.location = "./account.html"
	}
}