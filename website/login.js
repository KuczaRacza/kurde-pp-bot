let login_button = () => {
	window.sessionStorage.setItem("token", "01")
}
let register_form = () => {
	let userdata = {}
	userdata.nick = document.getElementById('reg-nick').value
	userdata.discord = document.getElementById('reg-tag').value
	userdata.password = document.getElementById('reg-passwd').value
	APIaddUser(userdata).then((res)=>{
		res.json().then((obj)=>{
			if(obj = false){
				console.log(false)
			}
		})
	})
}