export function updateTodos(todoData, app, handleTabButtonClick, homeButton, containerElement) {

    const panel = document.querySelector("#home-todo-container");

    // add new data
    const newTodo = document.createElement("div");
    newTodo.classList.add("flex", "align-center", "todo");
    newTodo.setAttribute("data-priority", todoData.getPrio());
    newTodo.setAttribute("data-id", todoData.getId());

    // add check button
    const checkButton = document.createElement("div");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", (e) => {
        e.stopPropagation();
        const todoId = checkButton.parentElement.dataset.id;
        const tabButton = document.querySelector(`header > #${CSS.escape(todoId)}-tab-button`);
        
        if (tabButton) {
            tabButton.remove();
            document.querySelector(`#${CSS.escape(todoId)}-tab`).remove();
        }

        if (todoData.getAssignedProject() !== "home") {
            app.getProjects().find(p => p.getId() === todoData.getAssignedProject()).removeTodo(todoId);
        }
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
                newPanel.remove();
                homeButton.click();
            });

            const main = document.querySelector("main");
            main.appendChild(newPanel);

            newButton.click();
        } else {
            existentTabButton.click();
        }
    });

    containerElement.appendChild(newTodo);
}

export function updateProjectsTab(projectData, app, handleTabButtonClick, homeButton) {
    const panel = document.querySelector("#projects-container");

    // add new project
    const newProject = document.createElement("div");
    newProject.classList.add("flex", "items-center", "project");
    newProject.setAttribute("data-id", projectData.getId());

    // add check button
    const checkButton = document.createElement("div");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", (e) => {
        e.stopPropagation();
        const projectId = checkButton.parentElement.dataset.id;
        const tabButton = document.querySelector(`header > #${CSS.escape(projectId)}-tab-button`);
        
        if (tabButton) {
            tabButton.remove();
            document.querySelector(`#${CSS.escape(projectId)}-tab`).remove();
        }

        const pro = app.getProjects().find(p => p.getId() === projectData.getId());
        pro.getTodos().forEach(todo => {
            const tabButton = document.querySelector(`header > #${CSS.escape(todo.getId())}-tab-button`);
            if (tabButton) {
                tabButton.remove();
                document.querySelector(`#${CSS.escape(todo.getId())}-tab`).remove();
            }
            app.removeTodo(todo.getId());
        });

        app.removeProject(projectId)
        checkButton.parentElement.remove();
    });
    newProject.appendChild(checkButton);

    // handle title
    const title = document.createElement("span");
    title.textContent = projectData.getTitle();
    newProject.appendChild(title);

    newProject.addEventListener("click", () => {
        // create new tab if it doesnt exist
        const header = document.querySelector("#menu > header");
        const existentTabButton = header.querySelector(`#${CSS.escape(projectData.getId())}-tab-button`);

        if (!existentTabButton) {
            const newButton = document.createElement("button");
            newButton.id = `${projectData.getId()}-tab-button`;
            newButton.classList.add("tab", "flex", "items-center");
            newButton.textContent = projectData.getTitle();
            newButton.addEventListener("click", (e) => handleTabButtonClick(e.target));

            header.appendChild(newButton);

            // since there was no tab button, there also isn't a tab-panel
            // so we will also create one
            const todoDisplayTemplate = document.querySelector("#project-info-display");
            const clone = document.importNode(todoDisplayTemplate.content, true);
            const newPanel = clone.querySelector(".tab-panel");
            newPanel.id = `${projectData.getId()}-tab`;
            newPanel.querySelector("h2").textContent = projectData.getTitle();
            newPanel.querySelector("p").textContent = projectData.getDesc();
            
            // add project todos
            const todoContainer = newPanel.querySelector(".todo-container");
            const pro = app.getProjects().find(p => p.getId() === projectData.getId());
            pro.getTodos().forEach(todo => {
                updateTodos(todo, app, handleTabButtonClick, homeButton, todoContainer);
            });

            newPanel.querySelector(".close-button").addEventListener("click", () => {
                document.querySelector(`#${CSS.escape(newPanel.id)}-button`).remove();
                newPanel.remove();
                homeButton.click();
            });

            const main = document.querySelector("main");
            main.appendChild(newPanel);

            newButton.click();
        } else {
            const todoContainer = document.querySelector(`#${CSS.escape(projectData.getId())}-tab > div > .todo-container`);
            todoContainer.textContent = "";
            const pro = app.getProjects().find(p => p.getId() === projectData.getId());
            pro.getTodos().forEach(todo => {
                updateTodos(todo, app, handleTabButtonClick, homeButton, todoContainer);
            });

            existentTabButton.click();
        }
    });

    panel.appendChild(newProject);
}