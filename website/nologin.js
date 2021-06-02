let isLoged = () => {
    if (window.sessionStorage.getItem("token") == null) {
        window.location = "./login.html"
    }
}
document.addEventListener('loadstart',isLogged)