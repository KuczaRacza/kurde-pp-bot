const host = "kurde-pp.kuczaracza.com"
const protocol = "https"
let cookie = {}

let deleteAllCookies = () => {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos == 1 ? "" : (eqPos > -1 ? cookie.substr(0, eqPos) : cookie);
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

let logout = () => {
	document.cookie = "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

let getCookie = () => {
	if (document.cookie.length > 0) {
		const currentCookie = document.cookie.split("=");
		try {
			if(currentCookie[0] == "auth")
				cookie = JSON.parse(currentCookie[1])
			else
				deleteAllCookies()
		}
		catch (e) {
			console.log(e)
			// still an ugly hack
			deleteAllCookies()
		}
	}
}
let writeCookie = () => {
	document.cookie = "auth=" + JSON.stringify(cookie)
}
let myNick = () => {
	if (cookie.nick != undefined) {
		return cookie.nick

	}
	else {
		getCookie()
		if (cookie.nick != undefined) {
			return cookie.nick

		}
		else {
			return undefined
		}
	}
}
let insertMyNick = () => {
	let nickLink = document.createElement("a");
	nickLink.innerText = myNick();
	nickLink.href = "account.html";
	document.getElementById('menu-nick').appendChild(nickLink);
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
		fetch(setHttpParams(protocol + "://" + host + "/api/assigment", params), { method: 'GET', headers: { "auth": cookie.token } }).then((res) => {
			res.json().then((obj) => {
				cb(obj)
			})
		})
	})
	return prm
}
let APIaddAssigment = (asigment) => {
	return new Promise((resolve, reject) => {
		fetch(protocol + "://" + host + "/api/assigmentadd", { method: 'POST', body: JSON.stringify(asigment), headers: { "auth": cookie.token } }).then(response => {
			response.json().then(obj => {
				resolve(obj)
			})
		})
	})
}
let APIaddUser = (data) => {
	return new Promise((resolve, reject) => {
		fetch(protocol + "://" + host + "/api/useradd", { method: 'POST', body: JSON.stringify(data) }).then(response => {
			response.json().then(obj => {
				resolve(obj)
			})
		})
	})

}
let APIloginUser = (login) => {
	return new Promise((resolve, reject) => {
		fetch(protocol + "://" + host + "/api/login", { method: 'POST', body: JSON.stringify(login) }).then(response => {
			response.json().then(obj => {
				resolve(obj)
			})
		})
	})

}
let APImyUserInfo = () => {
	return new Promise((resolve, reject) => {
		fetch(protocol + "://" + host + "/api/myaccount", { method: 'GET', headers: { "auth": cookie.token } }).then((response) => {
			response.json().then((obj => {
				resolve(obj)
			}))
		})
	})
}
let APIverifyAccount = (text) => {
	return new Promise((resolve, reject) => {
		fetch(protocol + "://" +host +"/api/verifyaccount?c=" + text, { method: 'GET', headers: { "auth": cookie.token } }).then((response) => {
			response.json().then((obj => {
				resolve(obj)
			}))
		})
	})
}
let APIgetLessons = (start, day, number) => {
	return new Promise((resolve, reject) => {
		fetch(protocol +"://" + host + "/api/lessons?d=" + day + "&n=" + number + "&s=" + start, { method: 'GET', headers: { "auth": cookie.token } }).then(response => {
			response.json().then(obj => {
				resolve(obj)
			})
		})
	})
}