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
        fetch(setHttpParams("http://127.0.0.1/api/assigment", params)).then((res) => {
            res.json().then((obj) => {
                cb(obj)
            })
        })
    })
    return prm
}