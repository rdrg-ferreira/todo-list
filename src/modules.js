export function updateHomeTab(todoData) {
    const panel = document.querySelector("#todo-container");

    // add new data
    const newTodo = document.createElement("div");
    newTodo.classList.add("flex", "align-center", "todo");
    newTodo.setAttribute("data-priority", todoData.getPrio());
    newTodo.setAttribute("data-id", todoData.getId());

    // handle title
    const title = document.createElement("span");
    title.textContent = todoData.getTitle();
    newTodo.appendChild(title);

    // handle due date
    const dueDate = document.createElement("span");
    dueDate.textContent = todoData.getDueDate();
    newTodo.appendChild(dueDate);

    panel.appendChild(newTodo);
}

export function updateProjectsTab(projectData) {
    const panel = document.querySelector("#projects-container");

    // add new project
    const newProject = document.createElement("div");
    newProject.classList.add("flex", "items-center", "project");
    newProject.setAttribute("data-id", projectData.getId());

    // handle title
    const title = document.createElement("span");
    title.textContent = projectData.getTitle();
    newProject.appendChild(title);

    panel.appendChild(newProject);
}