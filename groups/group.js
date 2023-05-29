let token = localStorage.getItem('token');
// create group name form
document.getElementById('creategroupname').style.display = 'none';
function openCreateGroupName() {
    document.getElementById('creategroupname').style.display = 'block';
}
function closegroupForm() {
    document.getElementById('creategroupname').style.display = 'none';
}
async function submitCreateGroupNameForm(e) {
    try {
        e.preventDefault();
        const groupName = e.target.groupName.value;
        let data = await axios.post('http://localhost:3000/groups/create-group', { groupName }, { headers: { Authorization: token } });
        if (data.data) {
            document.getElementById('creategroupname').style.display = 'none';
            getData();
        }
    } catch (error) {
        let errorParent = document.getElementById('errorgroupname');
        errorParent.innerHTML = `<p class="fw-bold text-danger p-2" id="errorChildgroupname">Something went wrong</p>`;
        setTimeout(() => {
            if (document.getElementById('errorChildgroupname')) {
                errorParent.removeChild(document.getElementById('errorChildgroupname'));
            }
        }, 4000);
    }
}
//     --------------- x --------------------   end of create group name and display  --------->
var allgroups = document.getElementById('showAllGroups');
window.addEventListener('DOMContentLoaded', () => {
    getData();
})
async function getData() {
    try {
        let data = await axios.get('http://localhost:3000/groups/get-all-group', { headers: { Authorization: token } });
        if (data.data.length > 0) {
            allgroups.innerHTML = ``;
            for (let i = 0; i < data.data.length; i++) {
                showAllGroupsOnTheScreen(data.data[i]);
            }
        } else {
            allgroups.innerHTML = ``;
            allgroups.innerHTML = `<p class="fw-bold fs-5 text-danger p-3 mt-4">No groups exist</p>`;
        }
    } catch (error) {

    }
}
function showAllGroupsOnTheScreen(data) {
    let div = document.createElement('div');
    div.id = `groupInfo${data.id}`;
    div.className = "p-3 mt-4";
    const p = document.createElement('p');
    p.className = "fs-5 fw-bold";
    let text1 = document.createTextNode(`${data.name} ${data.admin === true ? "(Admin)" : ""}`);
    p.append(text1);
    const button = document.createElement('button');
    const button1 = document.createElement('button');
    const button3 = document.createElement('button');
    button.id = `addMemebers${data.id}`;
    button1.id = `viewuserinfo${data.id}`;
    button3.id = `openChats${data.id}`;
    button.className = "btn btn-outline-primary m-2";
    button1.className = "btn btn-outline-primary m-2";
    button3.className = "btn btn-outline-success";
    button.append(document.createTextNode("Add Members"));
    button1.append(document.createTextNode("See the users who joined"));
    button3.append(document.createTextNode("Chats"));
    button.onclick = function () {
        openAddMemeberForm(data.id);
    }
    button1.onclick = function () {
        addUsersLists(data.id, data.admin);
    }
    button3.onclick = function () {
        localStorage.setItem('gId', JSON.stringify(data.id));
        window.location.href = "../chats/chats.html"
    }
    if (data.admin === true) {
        p.append(button);
    }
    p.append(button1, button3);

    const div1 = document.createElement('div');
    div1.id = `memeberForm${data.id}`;
    const ul = document.createElement('ul');
    ul.id = `usersList${data.id}`;
    ul.style = "list-style: none;";
    ul.className = "mt-2";
    div.append(p, div1, ul);
    allgroups.append(div);
}
function openAddMemeberForm(id) {
    let memberForm = document.getElementById(`memeberForm${id}`);
    memberForm.innerHTML = ``;
    const button = document.createElement('button');
    button.className = "btn-close";
    button.onclick = function () {
        closememberForm(id);
    }
    let form = document.createElement('form');
    form.action = '#';
    form.onsubmit = function () {
        submitAddMemeberForm(event, id);
    }
    let label = document.createElement('label');
    label.className = "form-label fw-bold";
    label.htmlFor = 'phone';
    label.innerHTML = "Phone Number";
    let input = document.createElement('input');
    input.type = "tel";
    input.name = "phone";
    input.className = "form-control mb-3";
    input.id = "phone";
    input.placeholder = "9876543210";
    input.setAttribute('required', "");
    let input1 = document.createElement('input');
    input1.type = "submit";
    input1.className = "btn btn-success";
    input1.value = "Add in the group";
    form.append(label, input, input1);
    let p = document.createElement('p');
    p.className = "text-danger mt-2";
    p.id = `errorMember${id}`;
    memberForm.append(button, form, p);
}

function closememberForm(id) {
    let memberForm = document.getElementById(`memeberForm${id}`);
    memberForm.innerHTML = ``;
}
async function submitAddMemeberForm(e, id) {
    let memberForm = document.getElementById(`memeberForm${id}`);
    try {
        e.preventDefault();
        let phoneNo = e.target.phone.value;
        let data = await axios.post(`http://localhost:3000/groups/add-user-in-group?gid=${id}`, { phoneNo }, { headers: { Authorization: token } });
        if (data.data.message === 'success') {
            memberForm.innerHTML = ``;
        }
    } catch (error) {
        let errElement = document.getElementById(`errorMember${id}`);
        errElement.innerText = "This phone no. doesn't registered in this app";
    }
}
async function addUsersLists(id, admin) {
    let userList = document.getElementById(`usersList${id}`);
    userList.innerHTML = ``;
    const button = document.createElement('button');
    button.className = "btn-close";
    button.onclick = function () {
        closeUserList(id);
    }
    userList.append(button);
    try {
        let data = await axios.get(`http://localhost:3000/groups/get-users-in-group?gid=${id}`, { headers: { Authorization: token } });
        if (data.data.length > 0) {
            for (var i = 0; i < data.data.length; i++) {
                showUserListOnScreen(data.data[i], id, admin);
            }
        }
    } catch (error) {
        const p = document.createElement('p');
        p.className = 'fw-bold text-danger';
        p.innerText = 'No users exist in this group';
        userList.append(p);
    }
}
function showUserListOnScreen(data, id, admin) {
    let li = document.createElement('li');
    li.className = "m-2";
    let text1 = document.createTextNode(`${data.name} ${data.admin === true ? "(Admin)" : ""}`);
    li.append(text1);
    if (data.admin === false) {
        let button = document.createElement('button');
        let button1 = document.createElement('button');
        button.className = "btn btn-outline-danger m-2";
        button1.className = "btn btn-outline-warning m-2";
        button.innerText = "Delete";
        button1.innerText = "Make the Admin";
        button.onclick = function () {
            deleteUser(data.id, id);
        }
        button1.onclick = function () {
            makeUserAdmin(data.id, id);
        }
        if (admin == true) {
            li.append(button, button1);
        }

    }
    let userList = document.getElementById(`usersList${id}`);
    userList.append(li);
}
function closeUserList(id) {
    let userList = document.getElementById(`usersList${id}`);
    userList.innerHTML = ``;
}
async function deleteUser(id, gid) {
    try {
        let data = await axios.get(`http://localhost:3000/groups/delete-users-in-group?gid=${gid}&uId=${id}`, { headers: { Authorization: token } });
        if (data.data.message === 'success') {
            closeUserList(gid);
        }
    } catch (error) {

    }
}
async function makeUserAdmin(id, gid) {
    try {
        let data = await axios.get(`http://localhost:3000/groups/make-admin-users-in-group?gid=${gid}&uId=${id}`, { headers: { Authorization: token } });
        if (data.data.message === 'success') {
            closeUserList(gid);
        }
    } catch (error) {

    }
}