function loadAllTasksForAdmin() {
  const predefinedUsers = ["user1", "user2", "user3","sheetal"]; 
  const adminTable = document.getElementById("admin-task-table");

  adminTable.innerHTML = ""; 

  predefinedUsers.forEach(username => {
      const tasks = JSON.parse(localStorage.getItem(username)) || [];
      tasks.forEach(task => {
          const row = document.createElement("tr");

          const userCell = document.createElement("td");
          userCell.textContent = username;

          const taskCell = document.createElement("td");
          taskCell.textContent = task.taskValue;

          const statusCell = document.createElement("td");
          statusCell.textContent = task.isCompleted ? "Completed" : "Pending";

          row.append(userCell, taskCell, statusCell);
          adminTable.appendChild(row);
      });
  });
}


window.addEventListener("DOMContentLoaded", loadAllTasksForAdmin);

