//submit the form 
async function submitForm(e) {
    try {
        e.preventDefault();
        const info = {
            email: e.target.email.value,
            password: e.target.password.value
        };
        await axios.post('http://localhost:3000/user/login', info);
        alert('Successfully logging in');
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
//open signUp page
function signUp() {
    window.location.href = '../signUp.html';
}