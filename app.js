let favorites =
JSON.parse(
localStorage.getItem("favorites")
) || [];

function toggleFavorite(id){

if(favorites.includes(id)){

favorites =
favorites.filter(f => f !== id);

}else{

favorites.push(id);

}

localStorage.setItem(
"favorites",
JSON.stringify(favorites)
);

displayProducts();
updateFavoritesCount();
}

function displayProducts(list = products){

const container =
document.getElementById("product-grid");

let html = "";
list = [...list].sort(
(a,b) => b.sales - a.sales
);

list.forEach(product => {

const favorite =
favorites.includes(product.id);

html += `
<div class="product-card">

${product.sales >= 3 ?
'<div class="badge-top">🏆 Top Vente</div>'
: ''}

${product.isNew ? '<div class="badge-new">🆕 Nouveau</div>' : ''}

${product.isBestSeller ? '<div class="badge-best">🔥 Best Seller</div>' : ''}

<div class="discount-badge">
-20%
</div>

<img
src="${product.images[0]}"
alt="${product.name}"
onclick="showProduct(${product.id})"
style="cursor:pointer;">

<h3>${product.name}</h3>

<p>${product.category}</p>

<p class="rating">
⭐⭐⭐⭐⭐
(${product.reviews} avis)
</p>

<p>📦 Stock : ${product.stock}</p>

<p>${product.delivery}</p>

<p>🔥 Popularité : ${product.sales}</p>

<div class="price-box">

<span class="current-price">
${product.price.toLocaleString()} FCFA
</span>

<span class="old-price">
${product.oldPrice.toLocaleString()} FCFA
</span>

</div>

<button onclick="toggleFavorite(${product.id})">
${favorite ? "❤️ Favori" : "🤍 Favori"}
</button>

<button onclick="addToCart(${product.id})">
🛒 Ajouter au panier
</button>

<button onclick="buyNow(${product.id})">
⚡ Acheter maintenant
</button>

</div>
`;

});

container.innerHTML = html;
}

function searchProducts(){

const search =
document.getElementById("search-input")
.value
.toLowerCase();

const filtered =
products.filter(product =>
product.name.toLowerCase().includes(search)
);

displayProducts(filtered);
}

function updateStats(){

const totalSales =
products.reduce(
(sum,p)=>sum+p.sales,
0
);

const stats =
document.getElementById("sales-count");

if(stats){

stats.textContent =
totalSales;

}

}

displayProducts();
updateStats();

function filterProducts(category){

if(category === "all"){

displayProducts(products);

return;

}

const filtered =
products.filter(
product => product.category === category
);

displayProducts(filtered);

}

function showProduct(id){

const product =
products.find(
p => p.id === id
);

const modal =
document.getElementById("product-modal");

const body =
document.getElementById("modal-body");

let gallery = "";

product.images.forEach(img => {

gallery += `
<img
src="${img}"
class="gallery-image">
`;

});

let comments = "";

product.comments.forEach(comment => {

comments += `
<p class="review">
${comment}
</p>
`;

});

body.innerHTML = `

<div class="gallery">
${gallery}
</div>

<h2>${product.name}</h2>

<p>⭐ ${product.rating} (${product.reviews} avis)</p>

<p>📦 Stock : ${product.stock}</p>

<div class="delivery">
${product.delivery}
</div>

<p>${product.category}</p>

<h3>${product.price.toLocaleString()} FCFA</h3>

<p style="text-decoration:line-through;">
${product.oldPrice.toLocaleString()} FCFA
</p>

<button onclick="addToCart(${product.id})">
🛒 Ajouter au panier
</button>

<button onclick="deleteProduct(${product.id})">
🗑️ Supprimer
</button>

`;

modal.style.display = "flex";

}

function closeModal(){

document.getElementById(
"product-modal"
).style.display = "none";

}

function updateFavoritesCount(){

const element =
document.getElementById(
"favorite-count"
);

if(element){

element.textContent =
favorites.length;

}

}

function simulateVisitors(){

const visitors =
document.getElementById(
"visitor-count"
);

if(!visitors) return;

setInterval(()=>{

let current =
parseInt(visitors.textContent);

current +=
Math.floor(Math.random()*3);

visitors.textContent =
current;

},10000);

}

simulateVisitors();

function startCountdown(){

let totalSeconds = 24 * 60 * 60;

const countdown =
document.getElementById("countdown");

if(!countdown) return;

setInterval(()=>{

let hours =
Math.floor(totalSeconds / 3600);

let minutes =
Math.floor((totalSeconds % 3600) / 60);

let seconds =
totalSeconds % 60;

countdown.textContent =
`${hours}h ${minutes}m ${seconds}s`;

if(totalSeconds > 0){

totalSeconds--;

}else{

totalSeconds = 24 * 60 * 60;

}

},1000);

}

updateFavoritesCount();


startCountdown();

function addProduct(){

const name =
document.getElementById("admin-name").value;

const price =
Number(
document.getElementById("admin-price").value
);

const category =
document.getElementById("admin-category").value;

const image =
document.getElementById("admin-image")
.value
.trim();
if(!name || !price || !category){

alert("Remplissez tous les champs");

return;

}

const newProduct = {

id: Date.now(),

name: name,

price: price,

oldPrice: price,

stock: 10,

sales: 0,

category: category,

event: "quotidien",

rating: 5,

reviews: 0,

isNew: true,

isBestSeller: false,

comments: [],

delivery: "🚚 Livraison 2 à 3 jours",

images: [image]

};

products.push(newProduct);

localStorage.setItem(
"products",
JSON.stringify(products)
);

displayProducts();

alert("Produit ajouté");

}

function deleteProduct(id){

const confirmDelete =
confirm(
"Voulez-vous supprimer ce produit ?"
);

if(!confirmDelete){
return;
}

const index =
products.findIndex(
product => product.id === id
);

if(index !== -1){

products.splice(index,1);

localStorage.setItem(
"products",
JSON.stringify(products)
);

displayProducts();

alert("Produit supprimé");

}

}

function editProduct(id){

const product =
products.find(p => p.id === id);

const newPrice = prompt(
"Nouveau prix",
product.price
);

if(newPrice === null) return;

product.price = Number(newPrice);

localStorage.setItem(
"products",
JSON.stringify(products)
);

displayProducts();

showProduct(id);

alert("Produit modifié");

}

function openAdmin(){

const password =
prompt("Mot de passe Admin");

if(password === "1234"){

document.getElementById(
"admin-panel"
).style.display = "block";

}else{

alert("Accès refusé");

}

}

function updateAdminStats(){

const productsCount =
products.length;

const salesCount =
products.reduce(
(sum,p)=>sum+p.sales,
0
);

const revenue =
products.reduce(
(sum,p)=>sum+(p.sales*p.price),
0
);

const outStock =
products.filter(
p => p.stock <= 0
).length;

document.getElementById(
"admin-products-count"
).textContent = productsCount;

document.getElementById(
"admin-sales-count"
).textContent = salesCount;

document.getElementById(
"admin-revenue"
).textContent = revenue.toLocaleString();

document.getElementById(
"admin-out-stock"
).textContent = outStock;

}

updateAdminStats();

function displayOrders(){

const orders =
JSON.parse(
localStorage.getItem("orders")
) || [];

const container =
document.getElementById("admin-orders");

if(!container) return;

if(orders.length === 0){

container.innerHTML =
"Aucune commande";

return;

}

let html = "";

orders.forEach(order => {

html += `
<div class="order-card">

<p>
🆔 ${order.id}
</p>

<p>
📅 ${order.date}
</p>

<p>
💰 ${order.total} FCFA
</p>

</div>
`;

});

container.innerHTML = html;

}

displayOrders();

console.log("cart.js chargé");

function buyNow(id){

addToCart(id);

document.querySelector(
".cart-box"
).scrollIntoView({

behavior:"smooth"

});

}

function registerUser(){

const email =
document.getElementById("login-email").value;

const password =
document.getElementById("login-password").value;

if(!email || !password){

alert("Remplissez tous les champs");
return;

}

localStorage.setItem(
"userEmail",
email
);

localStorage.setItem(
"userPassword",
password
);

alert("Compte créé avec succès");

}

function loginUser(){

const email =
document.getElementById("login-email").value;

const password =
document.getElementById("login-password").value;

const savedEmail =
localStorage.getItem("userEmail");

const savedPassword =
localStorage.getItem("userPassword");

if(
email === savedEmail &&
password === savedPassword
){

localStorage.setItem(
"currentUser",
email
);

document.getElementById(
"login-status"
).textContent =
"✅ Connecté : " + email;

alert("Connexion réussie");

}else{

alert("Email ou mot de passe incorrect");

}

}

document.addEventListener(
"DOMContentLoaded",
function(){

const currentUser =
localStorage.getItem(
"currentUser"
);

if(currentUser){

document.getElementById(
"login-status"
).textContent =
"✅ Connecté : " + currentUser;

}

}
);