function GetAssigments() {
	let params = {}
	let gr = document.getElementById('amt-group').value
	if (gr != '*') {
		params.subclass = gr
	}
	let sb = document.getElementById('amt-subject').value
	if(sb != "*"){
		params.subject =sb
	}
	let active =document.getElementById("amt-due").checked
	if(active){
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
let instertLessons = ()=>{
	let lesson_to_html = (lesson) =>{
		let maindiv = document.createElement('div')
		maindiv.className ="lesson-div"
		let hour = document.createElement('span')
		hour.className = "lesson-hour lesson-element"
		hour.innerText = lesson.hour
		maindiv.append(hour)
		let subject = document.createElement('span')
		subject.className ="lesson-subject lesson-element"
		subject.innerText = lesson.subject 
		maindiv.append(subject)
		let room = document.createElement('span')
		room.className ="lesson-room lesson-element"
		room.innerText = lesson.room 
		maindiv.append(room)
		return maindiv
	}
	let date = new Date()
	let today_div = document.getElementById("lessons-today")
	APIgetLessons(date.getHours,date.getDay,10).then(obj =>{
		obj.forEach(element => {
			console.log(element)
			today_div.append(lesson_to_html(element))
		});
	})

}
