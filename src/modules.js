export function updateHomeTab(todoData, app, handleTabButtonClick, homeButton) {
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
        const tabButton = document.querySelector(`header > #${todoId}-tab-button`);
        
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

    newTodo.addEventListener("click", () => {
        // create new tab if it doesnt exist
        const header = document.querySelector("#menu > header");
        const existentTabButton = header.querySelector(`#${CSS.escape(todoData.getId())}-tab-button`);

        if (!existentTabButton) {
            const newButton = document.createElement("button");
            newButton.id = `${todoData.getId()}-tab-button`;
            newButton.classList.add("tab", "flex", "items-center");
            newButton.textContent = todoData.getTitle();
            newButton.addEventListener("click", (e) => handleTabButtonClick(e.target));

            header.appendChild(newButton);

            // since there was no tab button, there also isn't a tab-panel
            // so we will also create one
            const todoDisplayTemplate = document.querySelector("#todo-info-display");
            const clone = document.importNode(todoDisplayTemplate.content, true);
            const newPanel = clone.querySelector(".tab-panel");
            newPanel.id = `${todoData.getId()}-tab`;
            newPanel.querySelector("h2").textContent = todoData.getTitle();
            newPanel.querySelector(".desc").textContent = todoData.getDesc();
            newPanel.querySelector(".date").textContent = todoData.getDueDate();
            newPanel.querySelector(".prio").textContent = todoData.getPrio();

            newPanel.querySelector(".close-button").addEventListener("click", () => {
                document.querySelector(`#${CSS.escape(newPanel.id)}-button`).remove();
                homeButton.click();
            });

            const main = document.querySelector("main");
            main.appendChild(newPanel);

            newButton.click();
        } else {
            existentTabButton.click();
        }
    });

    panel.appendChild(newTodo);
}

export function updateProjectsTab(projectData, app, handleTabButtonClick) {
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
        const tabButton = document.querySelector(`header > #${projectId}-tab-button`);
        
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