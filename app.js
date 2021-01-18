const todoList = document.querySelector('#todo-list');
const form = document.querySelector('#add-todo-form');
const updateBtn = document.querySelector('#update');
const logoutItems = document.querySelectorAll('.logged-out');
const loginItems = document.querySelectorAll('.logged-in');
let currentUser = null;
let newTitle = '';
let updateId = null;

function setupUI(user) {
    if (user) {
        loginItems.forEach(item => item.style.display = 'block');
        logoutItems.forEach(item => item.style.display = 'none');
    } else {
        loginItems.forEach(item => item.style.display = 'none');
        logoutItems.forEach(item => item.style.display = 'block');
    }
}


function renderList(doc) {
    let li = document.createElement('li');
    li.className = "list-group-item bg-secondary text-white";
    li.setAttribute('data-id', doc.id);
    let div = document.createElement('div');
    div.className = "d-flex justify-content-between align-items-center";
    let title = document.createElement('span');
    title.textContent = doc.data().title;
    let div1 = document.createElement('div');
    div1.className = "badge";
    let anchor = document.createElement('a');
    anchor.href = "#Modal-update";
    anchor.onclick = () =>{
        $("#Modal-update").modal('toggle');
    }
    let editBtn = document.createElement('i');
    editBtn.className = "far fa-edit px-2 text-white";    
    let deleteBtn = document.createElement('i');
    deleteBtn.className = "far fa-trash-alt";  

    anchor.appendChild(editBtn);
    div1.appendChild(anchor);
    div1.appendChild(deleteBtn);
    div.appendChild(title);
    div.appendChild(div1);
    li.appendChild(div);

    deleteBtn.addEventListener('click', e => {        
        let id = e.target.parentElement.parentElement.parentElement.getAttribute('data-id')
        db.collection('alltodos').doc(currentUser.uid).collection('todos').doc(id).delete();
    })

    editBtn.addEventListener('click', e => {
        updateId = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id')        
    })

    todoList.appendChild(li);
    
}

updateBtn.addEventListener ('click', e=> {
    newTitle = document.getElementsByName('newtitle')[0].value;
    db.collection('alltodos').doc(currentUser.uid).collection('todos').doc(updateId).update({
        title: newTitle
    })
})

$('#update').click(function() {
   $('#Modal-update').modal('hide');
});

form.addEventListener('submit', e => {
    e.preventDefault();
    db.collection('alltodos').doc(currentUser.uid).collection('todos').add({
        title: form.title.value
    }).catch(err=>{
        console.log(err.message);
    })
    form.title.value = '';
    
})


function getTodos() {
    todoList.innerHTML = '';
    currentUser = auth.currentUser;

    document.querySelector('#user-email').innerHTML = (currentUser != null ? currentUser.email : '');

    console.log("currentUser: ", currentUser)
    if (currentUser === null) {
        todoList.innerHTML = '<h3 class="text-center py-4">Please Login first!</h3>';
        return;
    }
    db.collection('alltodos').doc(currentUser.uid).collection('todos').orderBy('title').onSnapshot(snapshot =>{
        let changes = snapshot.docChanges()
        changes.forEach(change => {
            if (change.type == 'added') {
                renderList(change.doc)                
    
            } else if (change.type == 'removed') {
                let li = todoList.querySelector(`[data-id = ${change.doc.id}]`);
                todoList.removeChild(li)
    
            } else if (change.type == 'modified') {
                let li = todoList.querySelector(`[data-id = ${change.doc.id}]`);
                li.getElementsByTagName('span')[0].textContent = newTitle;
                newTitle = '';
            }            
        });
    })
}

