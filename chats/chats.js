let token = localStorage.getItem('token');
let userName = parseJwt(token);
async function submitMessage(e) {
    try {
        e.preventDefault();
        let messages = e.target.messages.value;
        let data = await axios.post('http://localhost:3000/chats/saveMessage', { messages: messages }, { headers: { Authorization: token } });
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
//user refreshes the page it get fire the function 
window.addEventListener('DOMContentLoaded', async () => {
    try {
        let data = await axios.get('http://localhost:3000/chats/getMessage', { headers: { Authorization: token } });
        if (data.data.length > 0) {
            for (var i = 0; i < data.data.length; i++) {
                addingListInTheScreen(data.data[i]);
            }
        }
    } catch (error) {
        showErrorMessage(error);
    }
})
// adding list
function addingListInTheScreen(data) {
    let listsParent = document.getElementById('listOfChats');
    let name;
    if (userName.name === data.user.name) {
        name = 'You ';
    } else {
        name = data.user.name;
    }
    listsParent.innerHTML += `<li>${name}: ${data.messages}</li>`;
}
//decoding the token
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}