let products = [];
let currentUser = localStorage.getItem("currentUser") || null;
let users = JSON.parse(localStorage.getItem("users")) || {};
let cart = currentUser && users[currentUser] ? users[currentUser].cart || {} : {};

// ✅ Load Products
fetch("products(own).json")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    showProducts();
    showCart();
  })
  .catch((error) => console.error("Error loading products:", error));

// ✅ Display Products
const showProducts = () => {
    let str = "<div class='row'>";
    products.forEach((product) => {
        str += `
        <div class='box'>
            <img src='${product.url}' alt='${product.name}' width='100%' height='200px' />
            <h3>${product.name}</h3>
            <p>${product.desc}</p>
            <h4>Price: $${product.price}</h4>
            <button onclick='addToCart(${product.id})'>Add to Cart</button>
        </div>
        `;
    });
    document.getElementById("divProducts").innerHTML = str;
};

// ✅ Add to Cart
const addToCart = (id) => {
    if (!currentUser) {
        alert("Please log in to add items to the cart!");
        return;
    }
    cart[id] = (cart[id] || 0) + 1;
    updateLocalStorage();
    showCart();
};

// ✅ Show Cart
const showCart = () => {
    if (!currentUser) return;
    let count = Object.keys(cart).length;
    document.getElementById("items").innerText = count;
    
    let str = "";
    products.forEach((product) => {
        if (cart[product.id]) {
            str += `
            <div>
                <b>${product.name}</b> - $${product.price} x ${cart[product.id]}
                <button onclick='decrement(${product.id})'>-</button> 
                ${cart[product.id]} 
                <button onclick='increment(${product.id})'>+</button> 
                <button onclick='deleteCart(${product.id})'>🗑️ Remove</button>
            </div>`;
        }
    });

    document.getElementById("divCart").innerHTML = str;
    showTotal();
};

const displayCart = () => {
    let cartBox = document.getElementById("cartBox");
    let productBox = document.getElementById("productBox");

    if (cartBox.style.display === "none" || cartBox.style.display === "") {
        cartBox.style.display = "block";
        productBox.style.display = "none";
    } else {
        cartBox.style.display = "none";
        productBox.style.display = "block";
    }
};

const hideCart = () => {
    document.getElementById("cartBox").style.display = "none";
    document.getElementById("productBox").style.display = "block";
  };
  

// ✅ Increment Item
const increment = (id) => {
    cart[id]++;
    updateLocalStorage();
    showCart();
};

// ✅ Decrement Item (Prevent Negative)
const decrement = (id) => {
    if (cart[id] > 1) {
        cart[id]--;
    } else {
        delete cart[id]; 
    }
    updateLocalStorage();
    showCart();
};

// ✅ Remove Item from Cart
const deleteCart = (id) => {
    delete cart[id];
    updateLocalStorage();
    showCart();
};

// ✅ Calculate Total
const showTotal = () => {
    let total = Object.keys(cart).reduce((sum, id) => {
        let product = products.find((p) => p.id == id);
        return sum + (product ? product.price * cart[id] : 0);
    }, 0);
    document.getElementById("order").innerText = `$${total.toFixed(2)}`;
};

// ✅ Store Cart Data Per User
const updateLocalStorage = () => {
    if (currentUser) {
        users[currentUser].cart = cart;
        localStorage.setItem("users", JSON.stringify(users));
    }
};

// ✅ Checkout Process
const checkout = () => {
    if (!currentUser) {
        alert("Please log in to checkout!");
        return;
    }
    
    let str = "";
    let total = 0;

    Object.keys(cart).forEach((id) => {
        let product = products.find((p) => p.id == id);
        if (product) {
            let subtotal = product.price * cart[id];
            total += subtotal;
            str += `<p>${product.name} x ${cart[id]} = $${subtotal}</p>`;
        }
    });

    document.getElementById("orderSummary").innerHTML = str;
    document.getElementById("totalOrder").innerText = `$${total.toFixed(2)}`;

    document.getElementById("cartBox").style.display = "none";
    document.getElementById("checkoutBox").style.display = "block";
};

// ✅ Confirm Order
const confirmOrder = () => {
    cart = {};
    updateLocalStorage();
    showCart();
    document.getElementById("checkoutBox").style.display = "none";
    document.getElementById("confirmationBox").style.display = "block";
};

// ✅ Cancel Checkout
const cancelCheckout = () => {
    document.getElementById("checkoutBox").style.display = "none";
    document.getElementById("cartBox").style.display = "block";
};

// ✅ Reset Cart After Order
const resetCart = () => {
    cart = {};
    updateLocalStorage();
    showCart();
    document.getElementById("confirmationBox").style.display = "none";
};

// ✅ Search Products
const searchProducts = () => {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(input)
    );
    showFilteredProducts(filteredProducts);
};

// ✅ Display Filtered Products
const showFilteredProducts = (filteredProducts) => {
    let str = "<div class='row'>";
    filteredProducts.forEach((product) => {
        str += `
        <div class='box'>
            <img src='${product.url}' alt='${product.name}' width='100%' height='200px' />
            <h3>${product.name}</h3>
            <p>${product.desc}</p>
            <h4>Price: $${product.price}</h4>
            <button onclick='addToCart(${product.id})'>Add to Cart</button>
        </div>
        `;
    });
    document.getElementById("divProducts").innerHTML = str;
};

// ✅ Filter by Category
const filterByCategory = () => {
    document.getElementById("searchInput").value = "";
    let category = document.getElementById("categoryFilter").value;
    let filteredProducts = category === "all"
        ? products
        : products.filter(product => product.category === category);
    showFilteredProducts(filteredProducts);
};

// ✅ Dark Mode Toggle
const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
};

// ✅ Apply Dark Mode on Load
window.onload = () => {
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }
    checkLoginStatus();
    updateWelcomeMessage(); // ✅ Ensure it runs on page load
};


// ✅ User Authentication Functions
const checkLoginStatus = () => {
    if (currentUser) {
        document.getElementById("authContainer").style.display = "none";
        document.getElementById("storeContainer").style.display = "block";
        showProducts();
        showCart();
    } else {
        document.getElementById("authContainer").style.display = "flex";
        document.getElementById("storeContainer").style.display = "none";
    }
};

const signup = () => {
    let name = document.getElementById("signupName").value.trim();
    let email = document.getElementById("signupEmail").value.trim();
    let password = document.getElementById("signupPassword").value.trim();

    if (!name || !email || !password || users[email]) {
        alert("Invalid input or email already exists!");
        return;
    }

    users[email] = { name, password, cart: {} }; // ✅ Store user name
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! Please login.");
    showLogin();
};


const login = () => {
    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value.trim();

    if (!users[email] || users[email].password !== password) {
        alert("Invalid email or password!");
        return;
    }

    currentUser = email;
    localStorage.setItem("currentUser", currentUser);
    updateWelcomeMessage(); // ✅ Ensure username updates after login
    checkLoginStatus();
};


const logout = () => {
    currentUser = null;
    localStorage.removeItem("currentUser");
    checkLoginStatus();
};

// Function to show the signup form
const showSignup = () => {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("signupBox").style.display = "block";
};

// Function to show the login form
const showLogin = () => {
    document.getElementById("signupBox").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
};
const updateWelcomeMessage = () => {
    let welcomeText = document.getElementById("welcomeUser");
    if (currentUser && users[currentUser]) {
        welcomeText.innerText = `Welcome, ${users[currentUser].name || "User"}`;
    } else {
        welcomeText.innerText = "Welcome, Guest";
    }
};
