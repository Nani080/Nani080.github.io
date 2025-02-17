let users = JSON.parse(localStorage.getItem("users")) || [];
let user = {};

// 🔹 Toggle Dark/Light Theme
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

// 🔹 Toggle Sidebar Menu
function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("open");
}

// 🔹 Show Login Form
function showLogin() {
    toggleMenu();
    document.getElementById("root").innerHTML = `
        <h2>Login</h2>
        <div id="msg"></div>
        <input type="text" id="email" placeholder="Email">
        <input type="password" id="password" placeholder="Password">
        <button onclick="chkUser()">Login</button>
        <p>Don't have an account? <button onclick="showForm()">Register</button></p>
    `;
}

// 🔹 Show Registration Form
function showForm() {
    toggleMenu();
    document.getElementById("root").innerHTML = `
        <h2>Create Account</h2>
        <input type="text" id="name" placeholder="Full Name">
        <input type="text" id="email" placeholder="Email">
        <input type="password" id="password" placeholder="Password">
        <input type="date" id="dob">
        <button onclick="addUser()">Register</button>
        <p>Already have an account? <button onclick="showLogin()">Login</button></p>
    `;
}

// 🔹 Add User
function addUser() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let dob = document.getElementById("dob").value;

    if (!name || !email || !password || !dob) {
        alert("All fields are required.");
        return;
    }

    let newUser = { name, email, password, dob, balance: 0 };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    showLogin();
}

// 🔹 Check Login Credentials
function chkUser() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
        user = foundUser;
        home();
    } else {
        document.getElementById("msg").innerHTML = `<p style="color: red;">Invalid credentials.</p>`;
    }
}

// 🔹 Clear Local Storage & Reset
function clearLocalStorage() {
    localStorage.clear();
    alert("Local storage cleared!");
    location.reload();
}

// 🔹 Show Dashboard
function home() {
    document.getElementById("root").innerHTML = `
        <h2>Welcome, ${user.name}!</h2>
        <p><b>Balance: $<span id="spBalance">${user.balance}</span></b></p>
        <p><button onclick="showLogin()">Logout</button></p>
    `;
}

// 🔹 Initialize App
showLogin();
