import "./styles.css";
import { updateTodos, updateProjectsTab } from "./modules";

function createApp() {
    const todoController = (function () {
        const createTodo = (title, description="", dueDate="", priority, assignedProject, id="") => {
            const getTitle = () => title;

            const getDesc = () => description;
            
            const getDueDate = () => dueDate;
            
            const getPrio = () => priority;

            if (id === "") id = crypto.randomUUID();
            const getId = () => id;

            const getAssignedProject = () => assignedProject;
            
            return {getTitle, getDesc, getDueDate, getPrio, getId, getAssignedProject};
        }

        const todosList = [];
        const getTodos = () => todosList;
        const addTodo = (newTodo) => todosList.push(newTodo);
        const removeTodo = (todoId) => todosList.splice(todosList.findIndex(item => item.getId() === todoId), 1);

        return {createTodo, getTodos, addTodo, removeTodo};
    })();

    const projectsController = (function () {
        const createProject = (title, description="", id="") => {
            const getTitle = () => title;

            const getDesc = () => description;

            const todos = [];
            const getTodos = () => todos;
            const addTodos = (todo) => todos.push(todo);
            const removeTodo = (todoId) => todos.splice(todos.findIndex(item => item.getId() === todoId), 1);

            if (id === "") id = crypto.randomUUID();
            const getId = () => id;

            return {getTitle, getDesc, getTodos, addTodos, removeTodo, getId}
        };

        const projectList = [];
        const getProjects = () => projectList;
        const addProject = (newProject) => projectList.push(newProject);
        const removeProject = (projectId) => projectList.splice(projectList.findIndex(item => item.getId() === projectId), 1);

        return {createProject, getProjects, addProject, removeProject};
    })();

    const isStorageAvailable = (type="localStorage") => {
        let storage;
        try {
            storage = window[type];
            const x = "__storage_test__";
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
            );
        }
    }

    const storeLocalData = (item) => {
        if (!isStorageAvailable()) return;
        
        // determine what item is and store its info
        const itemInfo = {"id": item.getId(), "title": item.getTitle(), "desc": item.getDesc()};
        if (Object.hasOwn(item, "getTodos")) {
            localStorage.setItem(`project:${item.getId()}`, JSON.stringify(itemInfo));
        } else {
            itemInfo["date"] = item.getDueDate();
            itemInfo["prio"] = item.getPrio();
            itemInfo["project"] = item.getAssignedProject();

            localStorage.setItem(`todo:${item.getId()}`, JSON.stringify(itemInfo));
        }
    }

    const removeLocalData = (item) => {
        // determine what item is and remove its info
        if (Object.hasOwn(item, "getTodos")) {
            localStorage.removeItem(`project:${item.getId()}`);
        } else {
            localStorage.removeItem(`todo:${item.getId()}`);
        }
    }

    const fetchLocalData = () => {
        const todos = [];
        const projects = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (key.startsWith("todo:")) {
                const todoInfo = JSON.parse(localStorage.getItem(key));
                todos.push(todoInfo);
            } else if (key.startsWith("project:")) {
                const project = JSON.parse(localStorage.getItem(key));
                projects.push(project);
            }
        }

        return [todos, projects];
    }

    return {
        createTodo: todoController.createTodo,
        getTodos: todoController.getTodos,
        addTodo: todoController.addTodo,
        removeTodo: todoController.removeTodo,
        createProject: projectsController.createProject,
        getProjects: projectsController.getProjects,
        addProject: projectsController.addProject,
        removeProject: projectsController.removeProject,
        storeLocalData: storeLocalData,
        removeLocalData: removeLocalData,
        fetchLocalData: fetchLocalData
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

        // store change locally
        app.storeLocalData(newTodo);

        // only update for now if the container is the home one
        if (data["project"] === "home") updateTodos(newTodo, app, handleTabButtonClick, homeButton, homeContainer);
        else {
            const assignedProject = app.getProjects().find(p => p.getId() === data["project"]);
            assignedProject.addTodos(newTodo);
            
            // store change locally
            app.storeLocalData(assignedProject);

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

        // store change locally
        app.storeLocalData(newProject);

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

    // get local data and create it on the app
    let [todos, projects] = app.fetchLocalData();

    projects.forEach(projectInfo => {
        const project = app.createProject(projectInfo["title"], projectInfo["desc"], projectInfo["id"]);
        app.addProject(project);
        updateProjectsTab(project, app, handleTabButtonClick, homeButton);
    });

    todos.forEach(todoInfo => {
        const todo = app.createTodo(todoInfo["title"], todoInfo["desc"], todoInfo["date"], todoInfo["prio"], todoInfo["project"], todoInfo["id"]);
        app.addTodo(todo);

        if (todo.getAssignedProject() === "home") updateTodos(todo, app, handleTabButtonClick, homeButton, homeContainer);
        else app.getProjects().find(p => p.getId() === todo.getAssignedProject()).addTodos(todo);
    });
})();