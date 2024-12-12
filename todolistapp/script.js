const currentUser = localStorage.getItem("currentUser");
console.log('Working index');
if (!currentUser) {
  console.log('is user exists');
  window.location.href = "login.html";
}
console.log("current user:",currentUser);
window.addEventListener("DOMContentLoaded", loadTasksForUser);

document.getElementById("add-btn").addEventListener("click", function () {
  const taskInput = document.getElementById("todo-input");
  const taskValue = taskInput.value.trim();

  if (taskValue === "") {
    alert("Please enter a task!");
    return;
  }

  addTaskToUI(taskValue);
  saveTaskForUser(taskValue);

  taskInput.value = "";
});


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
  });

  newTask.appendChild(taskText);
  newTask.appendChild(tickBtn);
  newTask.appendChild(editBtn);
  newTask.appendChild(deleteBtn);


  document.getElementById("todo-list").appendChild(newTask);
}


function saveTaskForUser(taskValue) {
  const tasks = JSON.parse(localStorage.getItem(currentUser)) || [];
  tasks.push({ taskValue, isCompleted: false });
  localStorage.setItem(currentUser, JSON.stringify(tasks));
}


function loadTasksForUser() {
  const tasks = JSON.parse(localStorage.getItem(currentUser)) || [];
  tasks.forEach(task => {
    addTaskToUI(task.taskValue);
    if (task.isCompleted) {
      const taskItem = document.querySelector('span');
      taskItem.style.textDecoration = "line-through";
    }
  });

  getDataAndDisplay();
}


function removeTaskForUser(taskValue) {
  let tasks = JSON.parse(localStorage.getItem(currentUser)) || [];
  tasks = tasks.filter(task => task.taskValue !== taskValue);
  localStorage.setItem(currentUser, JSON.stringify(tasks));
}

function updateTaskInLocalStorage(oldTaskValue, newTaskValue) {
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
  let tasks = JSON.parse(localStorage.getItem(currentUser)) || [];
  tasks = tasks.map(task => {
    if (task.taskValue === taskValue) {
      task.isCompleted = isCompleted;
    }
    return task;
  });
  localStorage.setItem(currentUser, JSON.stringify(tasks));
}


document.getElementById("logout-btn").addEventListener("click", function () {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});

const newTodoInput = document.getElementById('todo-input');




const getDataAndDisplay = () => {
  fetch('https://dummyjson.com/todos')
    .then(response => response.json())
    .then(data => {
      const todos = data.todos;
      const todoListElement = document.getElementById('todo-list');

   
      todoListElement.innerHTML = '';

      todos.forEach(todo => {
        const newTask = document.createElement("li");
        console.log(todo);
        addTaskToUI(todo.todo);
      });
    })
    .catch(error => console.error('Error fetching todos:', error));
};