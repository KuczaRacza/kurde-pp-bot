let start = ()=>{
    console.log(window.location)
    let ftch = fetch("http://127.0.0.1:43400/assigment?" + window.location.toString().split("?")[1],{mode:"cors"}).then((res)=>{
        res.json().then((obj)=>{
            createPage(obj)
        })
    })
}
let createPage = (array) =>{
    let obj =  array[0]
    document.getElementById("task-title").innerText = obj.title
    document.getElementById("task-description").innerText = obj.description
    document.getElementById("task-due").innerText = new Date(obj.due).toDateString()
    
}