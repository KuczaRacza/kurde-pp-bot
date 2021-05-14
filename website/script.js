function testAssigments(){
	let asigment = {description:"zad z wf",title:"wf",due:new Date().getTime(),subject:"wf",group:"1"}
	let assigmetsRquest = fetch("http://127.0.0.1:43400/assigmentadd", {method:'POST', mode:'cors' , body: JSON.stringify(asigment)})
}