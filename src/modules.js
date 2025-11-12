export function updateHomeTab(todoData, app) {
    const panel = document.querySelector("#todo-container");

    // add new data
    const newTodo = document.createElement("div");
    newTodo.classList.add("flex", "align-center", "todo");
    newTodo.setAttribute("data-priority", todoData.getPrio());
    newTodo.setAttribute("data-id", todoData.getId());

    // add check button
    const checkButton = document.createElement("div");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", () => {
        const todoId = checkButton.parentElement.dataset.id;
        const tabButton = document.querySelector(`header > button[data-todo-id="${todoId}"]`);
        
        if (tabButton) tabButton.remove();
        app.removeTodo(todoId)
        checkButton.parentElement.remove();
    });
    newTodo.appendChild(checkButton);

    // handle title
    const title = document.createElement("span");
    title.textContent = todoData.getTitle();
    title.style.flexGrow = 1;
    newTodo.appendChild(title);

    // handle due date
    const dueDate = document.createElement("span");
    dueDate.textContent = todoData.getDueDate();
    newTodo.appendChild(dueDate);

    panel.appendChild(newTodo);
}

export function updateProjectsTab(projectData, app) {
    const panel = document.querySelector("#projects-container");

    // add new project
    const newProject = document.createElement("div");
    newProject.classList.add("flex", "items-center", "project");
    newProject.setAttribute("data-id", projectData.getId());

    // add check button
    const checkButton = document.createElement("div");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", () => {
        const projectId = checkButton.parentElement.dataset.id;
        const tabButton = document.querySelector(`header > button[data-project-id="${projectId}"]`);
        
        if (tabButton) tabButton.remove();
        app.removeProject(projectId)
        checkButton.parentElement.remove();
    });
    newProject.appendChild(checkButton);

    // handle title
    const title = document.createElement("span");
    title.textContent = projectData.getTitle();
    newProject.appendChild(title);

    panel.appendChild(newProject);
}