
async function login() {
    const usernameElement = document.getElementById("username");
    const passwordElement = document.getElementById("password");
    let username = usernameElement.value;
    let password = passwordElement.value;
    try {
        let response = await fetch("/api/auth/login", {
            method: 'post',
            body: JSON.stringify({username: username, password: password}),
            headers: {'Content-type': 'application/json; charset=UTF-8'}
        });
        let body = await response.json();
        if (response?.status === 200) {
            localStorage.setItem('username', username);
            window.location.href = "./play.html";
        } else {
            const modalElement = document.getElementById('msgModal');
            modalElement.querySelector('.modal-body').textContent = `Error: ${body.msg}`;
            const msgModal = new bootstrap.Modal(modalElement, {});
            msgModal.show();
        }
    } catch (err) {
        console.log(err);
    }
}

async function signup() {
    const usernameElement = document.getElementById("username");
    const passwordElement = document.getElementById("password");
    let username = usernameElement.value;
    let password = passwordElement.value;
    try {
        let response = await fetch("/api/auth/create", {
            method: 'post',
            body: JSON.stringify({username: username, password: password}),
            headers: {'Content-type': 'application/json; charset=UTF-8'}
        });
        let body = await response.json();
        if (response?.status === 200) {
            localStorage.setItem('username', username);
            window.location.href = "./play.html";
        } else {
            const modalElement = document.getElementById('msgModal');
            modalElement.querySelector('.modal-body').textContent = `Error: ${body.msg}`;
            const msgModal = new bootstrap.Modal(modalElement, {});
            msgModal.show();
        }
    } catch (err) {
        console.log(err);
    }
}