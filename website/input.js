var limits = {}
function start() {
	limits = fetch("./limits.json").then((res) => {
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
function getInput() {
	let assigment = {}
	let ok = true;
	let errDiv = document.getElementById('amt-error');
	errDiv.innerHTML = ""
	assigment.title = document.getElementById('amt-title').value
	if (assigment.title.length < limits['title-min']) {
		errDiv.innerText += "tytuł  może mieć najwięcej " + limits['title-max'] + " znaków\n";
		ok = false
	}
	else if (assigment.title.length > limits['title-max']) {
		errDiv.innerText += "tytuł musi mieć conajmniej " + limits['title-min'] + " znaków\n";
		ok = false

	}
	assigment.description = document.getElementById('amt-description').value
	if (assigment.description.length < limits['description-min']) {
		errDiv.innerText += "opis musi mieć conajmniej" + limits['description-min'] + " znaków\n";

		ok = false
	} else if (assigment.description.length > limits['description-max']) {
		errDiv.innerText += "opis  może mieć najwięcej " + limits['description-max'] + " znaków\n";
		ok = false
	}
	assigment.due =  new Date(document.getElementById('amt-due').value).getTime()
	assigment.subject = document.getElementById('amt-subject').value
	assigment.group = document.getElementById('amt-group').value
	if (assigment.due <= 0 || assigment.due == undefined || assigment.due == NaN || assigment.due == null) {
		ok = false;
		errDiv.innerText += "błędna data"
	}
	if (ok) {
		addAssigment(assigment).then((res) => {
			res.json().then((obj) => {
				if (obj === true) {
					window.location = '/'
				}
				else {
					errDiv.innerText = " wystąpił błąd przy dodaniu"
				}
			})
		})
	}
}
function addAssigment(asigment) {
	let assigmetsRquest = fetch("http://localhost/api/assigmentadd", { method: 'POST', mode: 'cors', body: JSON.stringify(asigment) })
	return assigmetsRquest;
}
