// ****** SELECT ITEMS **********
const form = document.querySelector(".task-form");
const alert = document.querySelector(".alert");
const input = document.getElementById("task");
const submit = document.querySelector(".submit-btn");
const container = document.querySelector(".task-container");
const list = document.querySelector(".task-list");
const clearBtn = document.querySelector(".clear-btn")
// edit option
let editElement;
let editFlag = false;
let editId ="";

// ****** EVENT LISTENERS **********
form.addEventListener("submit", addToDo)
clearBtn.addEventListener("click",clearTasks);
window.addEventListener("DOMContentLoaded", loadTasks);
// ****** FUNCTIONS **********
function addToDo(e){
    e.preventDefault();
    const value = input.value;
    const id = new Date().getTime().toString()
    if(value !== "" && editFlag === false){
        createTaskItems(id, value);
        showAlert("Task has been added", "success");
        container.classList.add("show-container")
        addToMemory(id, value);
        resetValue();
    }
    else if(value !== "" && editFlag === true){
        editElement.innerHTML = value;
        showAlert("Task Edited", "success");
        input.value = "";
        editMemory(editId, value);
        resetValue();
    }
    else{
        showAlert("Please Insert Your Task", "danger")
        resetValue()
    }
};

function delItem(e){
    const task = e.currentTarget.parentElement.parentElement;
    const id = task.dataset.id;
    list.removeChild(task);
    if(list.children.length === 0){
        container.classList.remove("show-container")
    }
    showAlert("task deleted","danger");
    resetValue();
    removeMemory(id);
};

function editItem(e){
    const task = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    input.value = editElement.innerHTML;
    editFlag = true;
    editId = task.dataset.id;
    submit.textContent = "edit"
}
// alert conditions
function showAlert(text, action){
    alert.innerText = text;
        alert.classList.add(`alert-${action}`)
        setTimeout(()=>{alert.innerText = "";
            alert.classList.remove(`alert-${action}`)}
            ,1000);
}

function clearTasks(){
    const tasks = document.querySelectorAll(".task-item");
    if(tasks.length > 0){
        tasks.forEach(task =>{
            list.removeChild(task);
        })
        container.classList.remove("show-container")
    }
    showAlert("all tasks removed", "danger");
    resetValue();
    localStorage.clear()
}

function resetValue (){
    input.value = "";
    editFlag = false;
    editId = "";
    submit.textContent = "add";
}
// ****** LOCAL STORAGE **********
function addToMemory(id, value){
    const taskDetails = {id,value};
    let items = getMemoryInfo();
    items.push(taskDetails);
    localStorage.setItem("list", JSON.stringify(items))
}
function editMemory(id,value){
    let items = addToMemory();
    items = items.map(item=>{
        if(item.id === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items))
}
function removeMemory(id){
    let items = addToMemory();
    items = items.filter(item=>{
        if(item.id !== id){
            return item;
        }
        localStorage.setItem("list", JSON.stringify(items))
    })
}

function getMemoryInfo(){
    return localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[];
}
// ****** SETUP ITEMS **********
function loadTasks (){
    let items = getMemoryInfo();
    if (items.length > 0){
        items.forEach(item =>{
            createTaskItems(item.id, item.value)
        });
        container.classList.add("show-container")
    }
}
function createTaskItems(id, value){
    const article = document.createElement("article");
        article.classList.add("task-item")
        const attribute = document.createAttribute("data-id")
        article.setAttributeNode(attribute);
        article.attribute = id;
        article.innerHTML=`<p class="title">${value}</p>
        <div class="btn-container">
            <button class="edit-btn">
                <i class="fa fa-edit"> </i>
            </button>
            <button class="delete-btn">
                <i class="fas fa-trash"> </i>
            </button>
        </div>`;
        const delBtn = article.querySelector(".delete-btn");
        const editBtn = article.querySelector(".edit-btn");
        delBtn.addEventListener("click", delItem);
        editBtn.addEventListener("click", editItem);
        list.appendChild(article);
}