async function submitForm(e) {
    try {
        e.preventDefault();
        const info = {
            name: e.target.name.value,
            email: e.target.email.value,
            phone: + e.target.phone.value,
            password: e.target.password.value,
        };
        let data = await axios.post('http://localhost:4000/user/signUp', info);
    } catch (error) {
        showErrorMessage(error);
    }
}
function showErrorMessage(error) {
    if (error.response === undefined) {
        let errorParent = document.getElementById('error');
        errorParent.innerHTML = `<p style="color:red">Something went wrong</p>`;
    } else {
        let errorParent = document.getElementById('error');
        errorParent.innerHTML = `<p style="color:red">${error.response.message}</p>`;
    }
}