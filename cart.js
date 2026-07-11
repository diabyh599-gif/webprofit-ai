let discount = 0;
let cart = JSON.parse(
localStorage.getItem("cart")
) || [];

function saveCart(){

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

localStorage.setItem(
"products",
JSON.stringify(products)
);

}

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

saveCart();

updateCart();
displayProducts();
updateStats();
}

function removeFromCart(index){

const product = cart[index];

product.stock++;

cart.splice(index,1);

saveCart();

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
<p>
${item.name}
-
${item.price.toLocaleString()} FCFA
</p>

<button onclick="removeFromCart(${index})">
❌
</button>

</div>
`;

});

cartItems.innerHTML = html;

cartCount.textContent =
cart.length;

const finalTotal =
total - (total * discount / 100);

cartTotal.textContent =
finalTotal.toLocaleString();
}

function orderWhatsApp(){

alert("Commande envoyée !");
}

updateCart();

function applyPromo(){

const code =
document.getElementById("promo-code")
.value
.toUpperCase();

const message =
document.getElementById("promo-message");

if(code === "BIENVENUE10"){

discount = 10;

message.innerHTML =
"✅ Réduction de 10% appliquée";

}
else if(code === "FETE20"){

discount = 20;

message.innerHTML =
"✅ Réduction de 20% appliquée";

}
else{

discount = 0;

message.innerHTML =
"❌ Code invalide";

}

updateCart();

}