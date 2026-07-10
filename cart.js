let cart = [];

function addToCart(productId){

const product =
products.find(p => p.id === productId);

if(product.stock <= 0){
alert("Produit épuisé");
return;
}

product.stock--;
product.sales++;

cart.push(product);

updateCart();
displayProducts();
updateStats();
}

function removeFromCart(index){

const product = cart[index];

product.stock++;

cart.splice(index,1);

updateCart();
displayProducts();
updateStats();
}

function updateCart(){

const cartItems =
document.getElementById("cart-items");

const cartCount =
document.getElementById("cart-count");

const cartTotal =
document.getElementById("cart-total");

let html = "";
let total = 0;

cart.forEach((item,index)=>{

total += item.price;

html += `
<div class="cart-item">
<p>${item.name} - ${item.price.toLocaleString()} FCFA</p>
<button onclick="removeFromCart(${index})">❌</button>
</div>
`;

});

cartItems.innerHTML = html;
cartCount.textContent = cart.length;
cartTotal.textContent = total.toLocaleString();
}