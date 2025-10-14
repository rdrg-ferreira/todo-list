import "./styles.css";

function createApp() {
    const todoController = (function () {
        const createTodo = (title, description="", dueDate="", priority="") => {
            const getTitle = () => title;
            const setTitle = (newTitle) => title = newTitle;

            const getDesc = () => description;
            const setDesc = (newDescription) => description = newDescription;
            
            const getDueDate = () => dueDate;
            const setDueDate = (newDueDate) => dueDate = newDueDate;
            
            const getPrio = () => priority;
            const setPrio = (newPriority) => priority = newPriority;

            let assignedProject;
            const getProject = () => assignedProject;
            const setProject = (newProject) => assignedProject = newProject; 

            const markAsDone = () => {

            };
            
            return {getTitle, setTitle, getDesc, setDesc, 
                getDueDate, setDueDate, getPrio, setPrio, 
                getProject, setProject, markAsDone};
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

            return {getTitle, setTitle, getDesc, setDesc, getTodos, addTodos}
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

    // event listeners

    // add default project and todos
    const defaultProject = app.createProject("Summer Trip");
    defaultProject.addTodos(app.createTodo("Passport", undefined, undefined, "High"));
    defaultProject.addTodos(app.createTodo("Bag", undefined, undefined, "Medium"));
    defaultProject.addTodos(app.createTodo("Tickets", "Look in this website ...", undefined, "High"));
})();