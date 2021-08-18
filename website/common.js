let cookie = {}
let getCookie = () => {
	if (document.cookie.length > 0) {
		cookie = JSON.parse(document.cookie)
	}
}
let writeCookie = () => {
	document.cookie = JSON.stringify(cookie)
}
let myNick = () => {
	if(cookie.nick != undefined){
		return cookie.nick

	}
	else{
		getCookie()
		if(cookie.nick != undefined){
			return cookie.nick
	
		}
		else{
			return undefined
		}
	}
}
let insertMyNick = () =>{
	document.getElementById('menu-nick').innerText = myNick()
}
let setHttpParams = (endpoint, params) => {
	let url = endpoint;
	Object.keys(params).forEach(key => {
		if (!url.includes('?')) {
			url += "?"
		}
		else {
			url += "&"
		}
		url += key + "=" + params[key]
	});

	return url
}
let APIgetAssigments = (params) => {
	let prm = new Promise((cb, err) => {
		fetch(setHttpParams("http://localhost/api/assigment", params), { method: 'GET', headers: { "auth": cookie.token } }).then((res) => {
			res.json().then((obj) => {
				cb(obj)
			})
		})
	})
	return prm
}
let APIaddAssigment = (asigment) => {
	return new Promise((resolve, reject) => {
		fetch("http://localhost/api/assigmentadd", { method: 'POST', body: JSON.stringify(asigment), headers: { "auth": cookie.token } }).then(response => {
			response.json().then(obj => {
				resolve(obj)
			})
		})
	})
}
let APIaddUser = (data) => {
	return new Promise((resolve, reject) => {
		fetch("http://localhost/api/useradd", { method: 'POST', body: JSON.stringify(data) }).then(response => {
			response.json().then(obj => {
				resolve(obj)
			})
		})
	})

}
let APIloginUser = (login) => {
	return new Promise((resolve, reject) => {
		fetch("http://localhost/api/login", { method: 'POST', body: JSON.stringify(login) }).then(response => {
			response.json().then(obj => {
				resolve(obj)
			})
		})
	})

}
let APImyUserInfo = () => {
	return new Promise((resolve, reject) => {
		fetch("http://localhost/api/myaccount", { method: 'GET', headers: { "auth": cookie.token } }).then((response) => {
			response.json().then((obj => {
				resolve(obj)
			}))
		})
	})
}
let APIverifyAccount = (text) => {
	return new Promise((resolve, reject) => {
		fetch("http://localhost/api/verifyaccount?c=" + text, { method: 'GET', headers: { "auth": cookie.token } }).then((response) => {
			response.json().then((obj => {
				resolve(obj)
			}))
		})
	})
}