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
    const buttons = document.querySelectorAll("button");
    const tabs = document.querySelectorAll(".tab-panel");

    // event listeners
    buttons.forEach(b => b.addEventListener("click", () => {
        buttons.forEach(btn => btn.classList.remove("active"));
        tabs.forEach(tab => tab.classList.remove("active"));
        
        b.classList.add("active");
        document.querySelector(`#${b.id}-tab`).classList.add("active");
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