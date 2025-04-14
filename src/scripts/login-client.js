const loginButton = document.getElementById('login-button');

async function login(username, password) {
    const response = await fetch('switch-management-app/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password,
            database: 'administracion_red'
        })
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data);
    } else {
        console.error('Login Error:', response.statusText);
    }
}

loginButton.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    await login(username, password);
})