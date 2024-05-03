const form = document.getElementById("form");
const input = document.getElementById("taskInput");
const tasksList = document.getElementById("tasksList");

let tasks = [];

if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
}

tasks.forEach((elem) => renderTask(elem));

checkEmptyList();

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);

function addTask(event) {
    event.preventDefault();

    const taskText = input.value;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };
    tasks.push(newTask);
    saveToLocalStorage();

    renderTask(newTask);

    input.value = "";
    input.focus();

    checkEmptyList();
}

function deleteTask(event) {
    const target = event.target;

    if (target.dataset.action !== "delete") {
        return;
    }

    const liElement = target.closest(".list-group-item");

    const id = liElement.getAttribute("id");
    const index = tasks.findIndex((item) => item.id == id);
    tasks.splice(index, 1);
    saveToLocalStorage();

    liElement.remove();
    checkEmptyList();
}

function doneTask(event) {
    let target = event.target;
    if (target.dataset.action != "done") return;

    const liElement = target.closest(".list-group-item");

    const id = liElement.id;
    const task = tasks.find((item) => id == item.id);
    task.done = !task.done;

    const taskTitle = liElement.querySelector(".task-title");
    taskTitle.classList.toggle("task-title--done");

    saveToLocalStorage();
}

function checkEmptyList() {
    if (tasks.length == 0) {
        tasksList.insertAdjacentHTML(
            "afterbegin",
            `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
        <div class="empty-list__title">Список дел пуст</div>
    </li>`
        );
    } else if (tasks.length > 0) {
        const emptyList = document.querySelector("#emptyList");
        emptyList ? emptyList.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(elem) {
    const cssClass = elem.done ? "task-title task-title--done" : "task-title";
    const taskHTML = `  <li id="${elem.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${elem.text}</span>
    <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18" />
        </button>
        <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18" />
        </button>
    </div>
</li>`;

    tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
