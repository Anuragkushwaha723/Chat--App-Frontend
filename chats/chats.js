let token = localStorage.getItem('token');
async function submitMessage(e) {
    try {
        e.preventDefault();
        let messages = e.target.messages.value;
        let data = await axios.post('http://localhost:3000/chats/saveMessage', { messages: messages }, { headers: { Authorization: token } });
        console.log(data);
    } catch (error) {
        showErrorMessage(error);
    }
}
// showing error message in the output screen
function showErrorMessage(error) {
    let errorParent = document.getElementById('error');
    if (error.response === undefined) {
        errorParent.innerHTML = `<p id="errorChild" style="color:red">Something went wrong</p>`;
    } else {
        errorParent.innerHTML = `<p id="errorChild" style="color:red">${error.response.data.message}</p>`;
    }
    setTimeout(() => {
        if (document.getElementById('errorChild')) {
            errorParent.removeChild(document.getElementById('errorChild'));
        }
    }, 4000);
}