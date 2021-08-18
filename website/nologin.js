let isLoged = () => {
	if (cookie.token == undefined) {
		getCookie()
		if (cookie.token == undefined) {
			let adress_table = window.location.href.split("/");
			let outstring = "/"
			for (let i = 3; i < adress_table.length; i++) {
				outstring+=adress_table[i]
			}
			window.location = "./login.html#" + outstring;
		}
	}
}
let isNotLoged = () => {
	if (cookie.token != undefined) {
		window.location = "./account.html"
	}
}