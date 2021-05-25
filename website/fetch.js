function GetAssigments() {
	let params = {}
	let gr = document.getElementById('amt-group').value
	if (gr != '*') {
		params.group = gr
	}
	let sb = document.getElementById('amt-subject').value
	if(sb != "*"){
		params.subject =sb
	}


	APIgetAssigments(params).then(createSection)
}
function createSection(assigmentsObject) {
	let space = document.getElementById('assigments')
	space.innerHTML = ""
	assigmentsObject.forEach((element, i) => {



		let assigment = document.createElement('div')
		let title = document.createElement('h2')
		let description = document.createElement('div')
		let due = document.createElement('div')
		let subject = document.createElement('div')
		title.innerText = element.title
		description.innerText = element.description.substring(0, 200)
		let date = new Date(element.due);
		subject.innerText = element.subject;

		due.innerText = date.toDateString()
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