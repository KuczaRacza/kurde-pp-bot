function GetAssigments() {
	let assigmetsRquest = fetch("http://127.0.0.1:43400/assigments?group=all&active=true", {mode:'cors'})
	assigmetsRquest.then((res)=>{
		if(res.ok){
			res.text().then( responseText => {
				let obj  = JSON.parse(responseText)
				createSection(obj)
			})
		}
	})
}
function createSection(assigmentsObject){
	let space = document.getElementById('assigments')
	assigmentsObject.forEach((element,i) => {

		let assigment = document.createElement('div')
		let title = document.createElement('h2')
		let description = document.createElement('div')

		title.innerText = element.title
		description.innerHTML = element.description.substring(0,200)

		assigment.append(title)
		assigment.append(description)
		space.append(assigment)

	});	
}