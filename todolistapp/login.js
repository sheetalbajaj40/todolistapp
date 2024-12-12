
const predefinedUsers = {
  user1: "password1",
  user2: "password2",
  user3: "password3"
};


document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  console.log(`Username: ${username}, Password: ${password}`);

  if (predefinedUsers[username] && predefinedUsers[username] === password) {
    console.log("Regular user logged in");
    localStorage.setItem("currentUser", username);
    window.location.href = "index.html";
  } else if (username === "sheetal" && password === "sami1234") {
    console.log("Admin logged in");
    debugger
    localStorage.setItem("currentUser", username);
    window.location.href = "admin.html";
  } else {
    console.log("Invalid credentials");
    alert("Invalid username or password!");
  }
});
