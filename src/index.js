import "./styles.css";
import { updateHomeTab, updateProjectsTab } from "./modules";

function createApp() {
    const todoController = (function () {
        const createTodo = (title, description="", dueDate="", priority) => {
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
            
            return {getTitle, setTitle, getDesc, setDesc, 
                getDueDate, setDueDate, getPrio, setPrio, getId};
        }

        const todosList = [];
        const getTodos = () => todosList;
        const addTodo = (newTodo) => todosList.push(newTodo);

        return {createTodo, getTodos, addTodo};
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

            const id = crypto.randomUUID();
            const getId = () => id;

            return {getTitle, setTitle, getDesc, setDesc, getTodos, addTodos, getId}
        };

        const projectList = [];
        const getProjects = () => projectList;
        const addProject = (newProject) => projectList.push(newProject);

        return {createProject, getProjects, addProject};
    })();

    return {
        createTodo: todoController.createTodo,
        getTodos: todoController.getTodos,
        addTodo: todoController.addTodo,
        createProject: projectsController.createProject,
        getProjects: projectsController.getProjects,
        addProject: projectsController.addProject
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

    function handleTabButtonClick(b) {
        const tabButtons = document.querySelectorAll("button.tab");
        const tabs = document.querySelectorAll(".tab-panel");

        tabButtons.forEach(btn => btn.classList.remove("active"));
        tabs.forEach(tab => tab.classList.remove("active"));
        
        b.classList.add("active");
        const tab = document.querySelector(`#${b.id.split("-tab-button")[0]}-tab`);
        tab.classList.add("active");
    }

    // event listeners
    homeButton.addEventListener("click", () => handleTabButtonClick(homeButton));
    projectsButton.addEventListener("click", () => handleTabButtonClick(projectsButton));

    createTodoButton.addEventListener("click", () => {
        createTodoButton.disabled = true;

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
        newButton.classList.add("tab", "flex", "align-center");
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
        data["date"] = data["date"].split("-").reverse().join("/");

        const newTodo = app.createTodo(data["title"], data["desc"], data["date"], data["prio"]);
        app.addTodo(newTodo);
        updateHomeTab(newTodo);

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
        updateProjectsTab(newProject);

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
    const defaultProject = app.createProject("Summer Trip");
    defaultProject.addTodos(app.createTodo("Passport", undefined, undefined, "High"));
    defaultProject.addTodos(app.createTodo("Bag", undefined, undefined, "Medium"));
    defaultProject.addTodos(app.createTodo("Tickets", "Look in this website ...", undefined, "High"));

    app.addProject(defaultProject);
    updateProjectsTab(defaultProject);

    // create default todo
    const defaultTodo = app.createTodo("Exercise", "30m", "24/10/2025", "High");
    app.addTodo(defaultTodo);
    updateHomeTab(defaultTodo);
})();