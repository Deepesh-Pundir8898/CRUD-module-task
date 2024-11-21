const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Define the file path where tasks will be stored
const tasksFilePath = path.join(__dirname, 'tasks.json');

// Initialize readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Read tasks from the file
function readTasks() {
    try {
        const data = fs.readFileSync(tasksFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return []; // If file doesn't exist or is empty, return an empty array
    }
}

// Save tasks to the file
function saveTasks(tasks) {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8');
}

// Add a new task
function addTask(description) {
    const tasks = readTasks();
    const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        description,
        completed: false
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`Task added: ${description}`);
}

// View all tasks
function viewTasks() {
    const tasks = readTasks();
    if (tasks.length === 0) {
        console.log('No tasks available.');
    } else {
        tasks.forEach(task => {
            const status = task.completed ? 'Completed' : 'Pending';
            console.log(`${task.id}. ${task.description} [${status}]`);
        });
    }
}

// Mark a task as complete
function markTaskComplete(id) {
    const tasks = readTasks();
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = true;
        saveTasks(tasks);
        console.log(`Task ${id} marked as complete.`);
    } else {
        console.log('Task not found.');
    }
}

// Remove a task
function removeTask(id) {
    let tasks = readTasks();
    tasks = tasks.filter(task => task.id !== id);
    saveTasks(tasks);
    console.log(`Task ${id} removed.`);
}

// Display menu options
function displayMenu() {
    console.log('\nTask Manager');
    console.log('1. Add a new task');
    console.log('2. View all tasks');
    console.log('3. Mark a task as complete');
    console.log('4. Remove a task');
    console.log('5. Exit');

    rl.question('Choose an option: ', (option) => {
        switch (option) {
            case '1':
                rl.question('Enter task description: ', (desc) => {
                    addTask(desc);
                    displayMenu();
                });
                break;
            case '2':
                viewTasks();
                displayMenu();
                break;
            case '3':
                rl.question('Enter task ID to mark as complete: ', (id) => {
                    markTaskComplete(parseInt(id));
                    displayMenu();
                });
                break;
            case '4':
                rl.question('Enter task ID to remove: ', (id) => {
                    removeTask(parseInt(id));
                    displayMenu();
                });
                break;
            case '5':
                rl.close();
                break;
            default:
                console.log('Invalid option. Please try again.');
                displayMenu();
        }
    });
}

// Start the task manager
displayMenu();
