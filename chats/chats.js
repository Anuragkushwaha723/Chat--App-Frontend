let token = localStorage.getItem('token');
let userName = parseJwt(token);
let gid = JSON.parse(localStorage.getItem('gId'));
localStorage.setItem("chats", '[]');
localStorage.setItem("users", '[]');
async function submitMessage(e) {
    try {
        e.preventDefault();
        let messages = e.target.messages.value;
        let data = await axios.post(`http://localhost:3000/chats/saveMessage?gid=${gid}`, { messages: messages }, { headers: { Authorization: token } });
        gettingData();
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
window.addEventListener('DOMContentLoaded', () => {
    gettingData();
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
//user name who joined the chat
function addingUsersJoinedName(data) {
    let listsParent = document.getElementById('listOfChats');
    let name;
    if (userName.name === data.name) {
        name = 'You ';
    } else {
        name = data.name;
    }
    listsParent.innerHTML += `<li>${name} joined</li>`;
}
//get the data from api and showe in the screen
async function gettingData() {
    try {
        let users = JSON.parse(localStorage.getItem("users"));
        let chats = JSON.parse(localStorage.getItem("chats"));
        let lstUsrId, lstChtId;
        if (users.length > 0) {
            lstUsrId = users[users.length - 1].id;
        }
        if (chats.length > 0) {
            lstChtId = chats[chats.length - 1].id;
        }
        let data = await axios.get(`http://localhost:3000/chats/getMessage?lstUsrId=${lstUsrId}&lstChtId=${lstChtId}&gid=${gid}`, { headers: { Authorization: token } });
        if (data.data.users.length > 0) {
            let newUsers = [...chats, ...data.data.users];
            if (newUsers.length > 1000) {
                for (var i = 0; i < 100; i++) {
                    newUsers.shift();
                }
            }
            localStorage.setItem("users", JSON.stringify(newUsers));
        }
        if (data.data.messages.length > 0) {
            let newChats = [...chats, ...data.data.messages];
            if (newChats.length > 1000) {
                for (var i = 0; i < 100; i++) {
                    newChats.shift();
                }
            }
            localStorage.setItem("chats", JSON.stringify(newChats));
        }
        let userList = JSON.parse(localStorage.getItem("users"));
        let chatList = JSON.parse(localStorage.getItem("chats"));
        clearListOnTheScreen();
        for (var i = 0; i < userList.length; i++) {
            addingUsersJoinedName(userList[i]);
        }
        for (var i = 0; i < chatList.length; i++) {
            addingListInTheScreen(chatList[i]);
        }
    } catch (error) {
        showErrorMessage(error);
    }
}
//clearing the list on the screen
function clearListOnTheScreen() {
    let listsParent = document.getElementById('listOfChats');
    listsParent.innerHTML = ``;
}
//refreshing the data at 3sec
// setInterval(() => {
//     gettingData();
// }, 3000);

