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
        fetch(setHttpParams("http://localhost/api/assigment", params), { method: 'GET', headers: { "auth": window.sessionStorage.getItem("token") } }).then((res) => {
            res.json().then((obj) => {
                cb(obj)
            })
        })
    })
    return prm
}
let APIaddAssigment = (asigment) => {
    let assigmetsRquest = fetch("http://localhost/api/assigmentadd", { method: 'POST', body: JSON.stringify(asigment), headers: { "auth": window.sessionStorage.getItem("token") } })
    return assigmetsRquest;
}