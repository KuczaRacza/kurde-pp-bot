var limits = {}
function start() {
	limits = fetch("http://127.0.0.1:8080/limits.json").then((res) => {
		if (res.ok) {
			res.json().then((obj => {
				limits = obj
				let gr = document.getElementById('amt-group')
				obj.groups.forEach(element => {
					let opt = document.createElement('option');
					opt.setAttribute('name', element)
					opt.innerText = element
					gr.append(opt)
				});
				let sb = document.getElementById('amt-subject')
				obj.subjects.forEach(element => {
					let opt = document.createElement('option');
					opt.setAttribute('name', element)
					opt.innerText = element
					sb.append(opt)
				});
			}))
		}
	})
}
function addAssigment() {
	let asigment = { description: "zad z wf", title: "wf", due: new Date().getTime(), subject: "wf", group: "1" }
	let assigmetsRquest = fetch("http://127.0.0.1:43400/assigmentadd", { method: 'POST', mode: 'cors', body: JSON.stringify(asigment) })
}