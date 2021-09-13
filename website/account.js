let loadMyInfo = () => {
	APImyUserInfo().then((obj) => {
		instertInfo(obj)
		getCookie()
		cookie.nick = obj.nick
		writeCookie()
	})
}
let instertInfo = (user) => {
	document.getElementById("nick-info").innerText = user.nick
	let info_box = document.getElementById("info");
	info_box.innerText += "stworzone: " + new Date(user.created).toDateString()
	info_box.append(document.createElement('br'))
	info_box.innerText += "discord id: " + user.discord
	if (user.status == 0) {
		let outdiv = document.getElementById("verify")
		let warrning = document.createElement('h3')
		warrning.innerText = "konto nie jest aktywne"
		let input = document.createElement('input')
		input.type = "text"
		input.placeholder = "kod weryfikacji"
		let input_button = document.createElement('input')
		input.id = "verify_me"
		input_button.type = "button"
		input_button.value = "wyślij"
		input_button.addEventListener('click', sendVerifyCode)
		outdiv.append(warrning)
		outdiv.append(input)
		outdiv.append(input_button)
	}
}
let sendVerifyCode = () => {
	let code = document.getElementById("verify_me").value
	APIverifyAccount(code).then((res) => {
		if (res === true) {
			document.getElementById("verify").remove();
		}
		else {
			let box = document.getElementById('verify').getElementsByTagName('input')[0]
			box.value = ""
			box.placeholder = "błędny kod"
		}
	});
}