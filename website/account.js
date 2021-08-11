let loadMyInfo = () => {
	APImyUserInfo().then((res) => {
		res.json().then((obj) => { instertInfo(obj) })
	})
}
let instertInfo = (user) => {
	document.getElementById("nick-info").innerText = user.nick
	let info_box = document.getElementById("info");
	info_box.innerText += "stworzone: " + new Date(user.created).toDateString()
	info_box.append(document.createElement('br'))
	info_box.innerText += "discord id: " + user.discord
	if(user.status == 0) {
		let outdiv = document.getElementById("verify")
		let warrning = document.createElement('h3')
		warrning.innerText = "konto nie jest aktywne"
		let input = document.createElement('input')
		input.type = "text"
		input.placeholder = "kod weryfikacji"
		let input_button = document.createElement('input')
		input_button.type ="button"
		input_button.value = "wyśli"
		input_button.onclick = "sendVerifyCode()"
		outdiv.append(warrning)
		outdiv.append(input)
		outdiv.append(input_button)
	}
}