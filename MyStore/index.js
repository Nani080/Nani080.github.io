let products = []

fetch("products.json")
  .then((response) => response.json()) 
  .then((data) => (showProducts(data))) 
  

const cart = {};
const addToCart = (id) => {
  if (!cart[id]) cart[id] = 1;
  showCart();
};
const increment = (id) => {
  cart[id] = cart[id] + 1;
  showCart();
};
const decrement = (id) => {
  cart[id] = cart[id] - 1;
  showCart();
};

const displayCart = () => {
  cartBox.style.display = "block";
  productBox.style.display = "none";
};

const hideCart = () => {
  cartBox.style.display = "none";
  productBox.style.display = "block";
};

const deleteCart = (id) => {
  delete cart[id];
  showCart();
};

const showTotal = () => {
  let total = products.reduce((sum, value) => {
    return sum + value.price * (cart[value.id] ?? 0);
  }, 0);
  order.innerHTML = total;
};

const showCart = () => {
  let count = Object.keys(cart).length;
  items.innerHTML = count;
  showTotal();
  let str = "";
  products.map((value) => {
    if (cart[value.id]) {
      str += `<div>
      Product ID:${value.id}, Product Name:${value.name}, Price${value.price}-
      <button onclick='decrement(${value.id})'>-</button>
      ${cart[value.id]}
      <button onclick='increment(${value.id})'>+</button>
      -${value.price * cart[value.id]}
      -<button onclick='deleteCart(${value.id})'>Delete</button>
      </div>`;
    }
  });
  divCart.innerHTML = str;
};
const showProducts = (data) => {
  products = data
  let str = "<div class='row'>";
  products.map((value) => {
    str += `
    <div class='box'>
    <img src='${value.url}' size='auto'>
    <h3>${value.name}</h3>
    <p>${value.desc}</p>
    <h4>${value.price}</h4>
    <button onclick='addToCart(${value.id})'>Add to Cart</button>
    </div>
    `;
  });
  divProducts.innerHTML = str;
};