function GetAssigments() {
	let gr = document.getElementById('amt-group').value
	let sb = document.getElementById('amt-subject').value
	if (gr == "*") {
		gr = 'all'
	} if (sb == "*") {
		sb = 'all'
	}
	let assigmetsRquest = fetch("http://127.0.0.1:43400/assigments?group=" + gr + "&subject=" + sb, { mode: 'cors' })
	assigmetsRquest.then((res) => {
		if (res.ok) {
			res.text().then(responseText => {
				let obj = JSON.parse(responseText)
				createSection(obj)
			})
		}
	})
}
function createSection(assigmentsObject) {
	let space = document.getElementById('assigments')
	space.innerHTML = ""
	assigmentsObject.forEach((element, i) => {

		let days = ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela']
		let month = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień']


		let assigment = document.createElement('div')
		let title = document.createElement('h2')
		let description = document.createElement('div')
		let due = document.createElement('div')
		let subject = document.createElement('div')
		title.innerText = element.title
		description.innerText = element.description.substring(0, 200)
		let date = new Date(element.due);
		subject.innerText = element.subject;

		let day = (date.getDate().toString().length == 1) ? "0" + date.getDate().toString() : date.getDate().toString()
		due.innerText = days[date.getDay()] + "   " + day + "  " + month[date.getMonth()]
		let link = document.createElement('a')
		link.href = "task.html?aid=" + element.aid
		link.append(assigment)
		assigment.append(title)
		assigment.append(subject)
		assigment.append(description)
		assigment.append(due)
		space.append(link)

	});
}