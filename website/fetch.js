function GetAssigments() {
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(this.responseText);
		}
	};
	xhttp.open("GET","127.0.0.0:43400/assigments?group=all&onlyative=1", true);
	xhttp.send();
}