let isLoged = () => {
	if (window.sessionStorage.getItem("token") == null) {
		window.location = "./login.html"
	}
}
let isNotLoged = () => {
	if (window.sessionStorage.getItem("token") != null) {
		window.location = "./account.html"
	}
}