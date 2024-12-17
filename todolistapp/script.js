document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    window.location.href = "login.html";
  }

  
  loadTasksForUser();

  
  document.getElementById("add-btn").addEventListener("click", function () {
    const taskInput = document.getElementById("todo-input");
    const taskValue = taskInput.value.trim();

    if (taskValue === "") {
     
      toastr.error("Task cannot be empty!", "Error");
      return;
    }

   
    postTaskToAPI(taskValue);  
    addTaskToUI(taskValue);     
    saveTaskForUser(taskValue); 

    taskInput.value = "";  
    toastr.success("Task added successfully!", "Success");
  });

  
  document.getElementById("logout-btn").addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
    toastr.warning("You have been logged out.", "Logout");
  });
});


function loadTasksForUser() {
  const currentUser = localStorage.getItem("currentUser");
  const tasksFromLocalStorage = JSON.parse(localStorage.getItem(currentUser)) || [];

  
  getDataAndDisplay(tasksFromLocalStorage);
}


const getDataAndDisplay = (localStorageTasks) => {
  fetch('https://dummyjson.com/todos?limit=5')
    .then(response => response.json())
    .then(data => {
      const apiTasks = data.todos;
      const allTasks = [...localStorageTasks, ...apiTasks]; 
      allTasks.forEach(task => {
        addTaskToUI(task.todo || task.taskValue); 
      });
    })
    .catch(error => console.error('Error fetching todos:', error));
}


function addTaskToUI(taskValue) {
  const newTask = document.createElement("li");
  const taskText = document.createElement("span");
  taskText.textContent = taskValue;

  const tickBtn = document.createElement("button");
  tickBtn.textContent = "✓";
  tickBtn.classList.add("tick-btn");
  tickBtn.addEventListener("click", function () {
    const isCompleted = taskText.style.textDecoration !== "line-through";
    taskText.style.textDecoration = isCompleted ? "line-through" : "none";
    toggleTaskCompletion(taskValue, isCompleted);
  });

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn");
  editBtn.addEventListener("click", function () {
    const newTaskValue = prompt("Edit your task:", taskText.textContent);
    if (newTaskValue !== null && newTaskValue.trim() !== "") {
      taskText.textContent = newTaskValue.trim();
      updateTaskInLocalStorage(taskValue, newTaskValue.trim());
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", function () {
    document.getElementById("todo-list").removeChild(newTask);
    removeTaskForUser(taskValue);
    toastr.info("Task deleted!", "Deleted");
  });

  newTask.appendChild(taskText);
  newTask.appendChild(tickBtn);
  newTask.appendChild(editBtn);
  newTask.appendChild(deleteBtn);

  document.getElementById("todo-list").appendChild(newTask);
}


function saveTaskForUser(taskValue) {
  const currentUser = localStorage.getItem("currentUser");
  const tasks = JSON.parse(localStorage.getItem(currentUser)) || [];
  tasks.push({ taskValue, isCompleted: false });
  localStorage.setItem(currentUser, JSON.stringify(tasks));
}

function removeTaskForUser(taskValue) {
  const currentUser = localStorage.getItem("currentUser");
  let tasks = JSON.parse(localStorage.getItem(currentUser)) || [];
  tasks = tasks.filter(task => task.taskValue !== taskValue);
  localStorage.setItem(currentUser, JSON.stringify(tasks));
}


function updateTaskInLocalStorage(oldTaskValue, newTaskValue) {
  const currentUser = localStorage.getItem("currentUser");
  let tasks = JSON.parse(localStorage.getItem(currentUser)) || [];
  tasks = tasks.map(task => {
    if (task.taskValue === oldTaskValue) {
      task.taskValue = newTaskValue;
    }
    return task;
  });
  localStorage.setItem(currentUser, JSON.stringify(tasks));
}


function toggleTaskCompletion(taskValue, isCompleted) {
  const currentUser = localStorage.getItem("currentUser");
  let tasks = JSON.parse(localStorage.getItem(currentUser)) || [];
  tasks = tasks.map(task => {
    if (task.taskValue === taskValue) {
      task.isCompleted = isCompleted;
    }
    return task;
  });
  localStorage.setItem(currentUser, JSON.stringify(tasks));
}


function postTaskToAPI(taskValue) {
  fetch('https://dummyjson.com/todos/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ todo: taskValue, completed: false, userId: 5 })
  })
    .then(response => response.json())
    .then(data => console.log('New task created:', data))
    .catch(error => console.error('Error posting new task:', error));
}
