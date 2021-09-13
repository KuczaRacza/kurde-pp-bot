function GetAssigments() {
	let params = {}
	let gr = document.getElementById('amt-group').value
	if (gr != '*') {
		params.subclass = gr
	}
	let sb = document.getElementById('amt-subject').value
	if (sb != "*") {
		params.subject = sb
	}
	let active = document.getElementById("amt-due").checked
	if (active) {
		params.due = new Date().getTime()
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
let instertLessons = (day, hour, div_id) => {
	let daysNames = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota']

	let lesson_to_html = (lesson) => {
		let maindiv = document.createElement('div')
		maindiv.className = "lesson-div"
		let hour = document.createElement('span')
		hour.className = "lesson-hour lesson-element"
		hour.innerText = lesson.hour
		maindiv.append(hour)
		let subject = document.createElement('span')
		subject.className = "lesson-subject lesson-element"
		subject.innerText = lesson.subject
		maindiv.append(subject)
		let room = document.createElement('span')
		room.className = "lesson-room lesson-element"
		room.innerText = lesson.room
		maindiv.append(room)
		return maindiv
	}
	let lesson_div = document.getElementById(div_id)
	let day_header = document.createElement('h3')
	day_header.innerText = daysNames[day]
	lesson_div.append(day_header)
	let day_div = document.createElement('div')
	day_div.className = "lesson-day"
	lesson_div.append(day_div)

	APIgetLessons(hour, day, 10).then(obj => {
		obj.forEach(element => {
			day_div.append(lesson_to_html(element))
		});
		if (obj[0] == undefined) {
			day_div.innerText = "Brak lekcji na ten dzień"
		}

	})

}
let insterAllDaysPlan = () => {
	for (let i = 1; i < 7; i++) {
		instertLessons(i, 7, "lessons-all")
	}
}