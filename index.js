
function login() {
    const usernameElement = document.getElementById("name");
    localStorage.setItem("username", usernameElement.value);
    window.location.href = "./play.html";
}