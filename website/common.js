let cookie = {}
let getCookie = () => {
	if (document.cookie.length > 0) {
		cookie = JSON.parse(document.cookie)
	}
}
let writeCookie = () => {
	document.cookie = JSON.stringify(cookie)
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
	let assigmetsRquest = fetch("http://localhost/api/assigmentadd", { method: 'POST', body: JSON.stringify(asigment), headers: { "auth": cookie.token } })
	return assigmetsRquest;
}
let APIaddUser = (data) => {
	let userAdd = fetch("http://localhost/api/useradd", { method: 'POST', body: JSON.stringify(data) })
	return userAdd
}
let APIloginUser = (login) => {
	let loginUser = fetch("http://localhost/api/login", { method: 'POST', body: JSON.stringify(login) })
	return loginUser;
}
let APImyUserInfo = () => {
	let myUser = fetch("http://localhost/api/myaccount", { method: 'GET', headers: { "auth": cookie.token } })
	return myUser
}
let APIverifyAccount = (text) => {
	return new Promise((resolve, reject) => {
		let endpoint = fetch("http://localhost/api/verifyaccount?c=" + text, { method: 'GET', headers: { "auth": cookie.token } }).then((response) => {
			response.json().then((obj => {
				resolve(obj)
			}))
		})
	})
}