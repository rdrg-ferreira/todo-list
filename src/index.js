import "./styles.css";
import { updateTodos, updateProjectsTab } from "./modules";

function createApp() {
    const todoController = (function () {
        const createTodo = (title, description="", dueDate="", priority, assignedProject) => {
            const getTitle = () => title;
            const setTitle = (newTitle) => title = newTitle;

            const getDesc = () => description;
            const setDesc = (newDescription) => description = newDescription;
            
            const getDueDate = () => dueDate;
            const setDueDate = (newDueDate) => dueDate = newDueDate;
            
            const getPrio = () => priority;
            const setPrio = (newPriority) => priority = newPriority;

            const id = crypto.randomUUID();
            const getId = () => id;

            const getAssignedProject = () => assignedProject;
            const setAssignedProject = (newProject) => assignedProject = newProject;
            
            return {getTitle, setTitle, getDesc, setDesc, getDueDate, 
                setDueDate, getPrio, setPrio, getId, getAssignedProject, setAssignedProject};
        }

        const todosList = [];
        const getTodos = () => todosList;
        const addTodo = (newTodo) => todosList.push(newTodo);
        const removeTodo = (todoId) => todosList.splice(todosList.findIndex(item => item.getId() === todoId), 1);

        return {createTodo, getTodos, addTodo, removeTodo};
    })();

    const projectsController = (function () {
        const createProject = (title, description="") => {
            const getTitle = () => title;
            const setTitle = (newTitle) => title = newTitle;

            const getDesc = () => description;
            const setDesc = (newDescription) => description = newDescription;

            const todos = [];
            const getTodos = () => todos;
            const addTodos = (todo) => todos.push(todo);
            const removeTodo = (todoId) => todos.splice(todos.findIndex(item => item.getId() === todoId), 1);

            const id = crypto.randomUUID();
            const getId = () => id;

            return {getTitle, setTitle, getDesc, setDesc, getTodos, addTodos, removeTodo, getId}
        };

        const projectList = [];
        const getProjects = () => projectList;
        const addProject = (newProject) => projectList.push(newProject);
        const removeProject = (projectId) => projectList.splice(projectList.findIndex(item => item.getId() === projectId), 1);

        return {createProject, getProjects, addProject, removeProject};
    })();

    return {
        createTodo: todoController.createTodo,
        getTodos: todoController.getTodos,
        addTodo: todoController.addTodo,
        removeTodo: todoController.removeTodo,
        createProject: projectsController.createProject,
        getProjects: projectsController.getProjects,
        addProject: projectsController.addProject,
        removeProject: projectsController.removeProject
    };
}

const screenController = (function () {
    const app = createApp();
    const homeButton = document.querySelector("#home-tab-button");
    const projectsButton = document.querySelector("#projects-tab-button");
    const createTodoButton = document.querySelector("#create-todo");
    const createProjectButton = document.querySelector("#create-project");
    const createTodoForm = document.querySelector("#create-todo-form");
    const createProjectForm = document.querySelector("#create-project-form");
    const closeButtons = document.querySelectorAll("button.close-button");
    const homeContainer = document.querySelector("#home-todo-container");

    function handleTabButtonClick(b) {
        const tabButtons = document.querySelectorAll("button.tab");
        const tabs = document.querySelectorAll(".tab-panel");

        tabButtons.forEach(btn => btn.classList.remove("active"));
        tabs.forEach(tab => tab.classList.remove("active"));
        
        b.classList.add("active");
        const tab = document.querySelector(`#${CSS.escape(b.id.split("-tab-button")[0])}-tab`);
        tab.classList.add("active");
    }

    // event listeners
    homeButton.addEventListener("click", () => handleTabButtonClick(homeButton));
    projectsButton.addEventListener("click", () => handleTabButtonClick(projectsButton));

    createTodoButton.addEventListener("click", () => {
        createTodoButton.disabled = true;

        // update list of projects to choose from
        const currentProjectsOnForm = document.querySelectorAll("#get-assigned-project > option");
        const idsFromCurrentProjects = [];
        currentProjectsOnForm.forEach(project => {
            idsFromCurrentProjects.push(project.value);
        });

        app.getProjects().forEach(project => {
            if (!idsFromCurrentProjects.includes(project.getId())) {
                const newOption = document.createElement("option");
                newOption.value = project.getId();
                newOption.text = project.getTitle();

                const selectProjectElement = document.querySelector("#get-assigned-project");
                selectProjectElement.appendChild(newOption);
            }
        })

        const header = document.querySelector("#menu > header");

        const newButton = document.createElement("button");
        newButton.id = "create-todo-tab-button";
        newButton.classList.add("tab", "flex", "items-center");
        newButton.textContent = "Create todo";
        newButton.addEventListener("click", (e) => handleTabButtonClick(e.target));

        header.appendChild(newButton);
        newButton.click();
    });

    createProjectButton.addEventListener("click", () => {
        createProjectButton.disabled = true;

        const header = document.querySelector("#menu > header");

        const newButton = document.createElement("button");
        newButton.id = "create-project-tab-button";
        newButton.classList.add("tab", "flex", "items-center");
        newButton.textContent = "Create project";
        newButton.addEventListener("click", (e) => handleTabButtonClick(e.target));

        header.appendChild(newButton);
        newButton.click();
    });

    createTodoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // get form data
        const data = Object.fromEntries(new FormData(createTodoForm).entries());
        Object.keys(data).forEach(key => {if (data[key] === "") data[key] = undefined});

        // change date format to DD/MM/YYYY
        if (data["date"]) data["date"] = data["date"].split("-").reverse().join("/");

        const newTodo = app.createTodo(data["title"], data["desc"], data["date"], data["prio"], data["project"]);
        app.addTodo(newTodo);

        // only update for now if the container is the home one
        if (data["project"] === "home") updateTodos(newTodo, app, handleTabButtonClick, homeButton, homeContainer);
        else {
            app.getProjects().find(p => p.getId() === data["project"]).addTodos(newTodo);
            document.querySelector(`#projects-container > .project[data-id="${CSS.escape(data["project"])}"`).click();
        }

        document.querySelector("#home-tab-button").click();

        // delete tab button and enable form button again
        document.querySelector("#create-todo-tab-button").remove();
        createTodoButton.disabled = false;
    });

    createProjectForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // get form data
        const data = Object.fromEntries(new FormData(createProjectForm).entries());
        Object.keys(data).forEach(key => {if (data[key] === "") data[key] = undefined});

        const newProject = app.createProject(data["title"], data["desc"]);
        app.addProject(newProject);
        updateProjectsTab(newProject, app, handleTabButtonClick, homeButton);

        // update select option of todo form
        const currentProjectsOnForm = document.querySelectorAll("#get-assigned-project > option");
        const idsFromCurrentProjects = [];
        currentProjectsOnForm.forEach(project => {
            idsFromCurrentProjects.push(project.value);
        });

        if (!idsFromCurrentProjects.includes(newProject.getId())) {
            const newOption = document.createElement("option");
            newOption.value = newProject.getId();
            newOption.text = newProject.getTitle();

            const selectProjectElement = document.querySelector("#get-assigned-project");
            selectProjectElement.appendChild(newOption);
        }

        document.querySelector("#projects-tab-button").click();
        
        // delete tab button and enable form button again
        document.querySelector("#create-project-tab-button").remove();
        createProjectButton.disabled = false;
    });

    closeButtons.forEach((b) => b.addEventListener("click", () => {
        const parentId = b.parentElement.id;

        document.querySelector(`#${parentId}-button`).remove();
        document.querySelector(`#${parentId.split("-tab")[0]}`).disabled = false;

        homeButton.click();
    }));

    // create default project
    const defaultProject = app.createProject("Summer Trip", "Things to do to have a nice trip");
    const defaultProTodo = app.createTodo("Passport", "Need to renovate", "24/10/2025", "High", defaultProject.getId());
    defaultProject.addTodos(defaultProTodo);

    app.addProject(defaultProject);
    app.addTodo(defaultProTodo);
    updateProjectsTab(defaultProject, app, handleTabButtonClick, homeButton);

    // create default todo
    const defaultTodo = app.createTodo("Exercise", "30m", "24/10/2025", "High", "home");
    app.addTodo(defaultTodo);
    updateTodos(defaultTodo, app, handleTabButtonClick, homeButton, homeContainer);
})();