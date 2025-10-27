export function updateHomeTab(todoData) {
    const panel = document.querySelector("#todo-container");

    // add new data
    const newTodo = document.createElement("div");
    newTodo.classList.add("flex", "align-center", "todo");

    // handle title
    const title = document.createElement("span");
    title.textContent = todoData.getTitle();
    newTodo.appendChild(title);

    // handle description
    const desc = document.createElement("span");
    desc.textContent = todoData.getDesc();
    newTodo.appendChild(desc);

    // handle due date
    const dueDate = document.createElement("span");
    dueDate.textContent = todoData.getDueDate();
    newTodo.appendChild(dueDate);

    // handle priority
    const prio = document.createElement("span");
    prio.textContent = todoData.getPrio();
    newTodo.appendChild(prio);

    panel.appendChild(newTodo);
}

export function updateProjectsTab(projectList) {
    const panel = document.querySelector("#projects-tab");
}