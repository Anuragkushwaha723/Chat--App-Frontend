//submit the form 
async function submitForm(e) {
    try {
        e.preventDefault();
        const info = {
            name: e.target.name.value,
            email: e.target.email.value,
            phone: + e.target.phone.value,
            password: e.target.password.value,
        };
        await axios.post('http://localhost:3000/user/signUp', info);
        alert('Successfully signed up');
        login();
    } catch (error) {
        showErrorMessage(error);
    }
}
// showing error message in the output screen
function showErrorMessage(error) {
    if (error.response === undefined) {
        let errorParent = document.getElementById('error');
        errorParent.innerHTML = `<p style="color:red">Something went wrong</p>`;
    } else {
        let errorParent = document.getElementById('error');
        errorParent.innerHTML = `<p style="color:red">${error.response.data.message}</p>`;
    }
}
//open login page
function login() {
    window.location.href = './login/login.html';
}