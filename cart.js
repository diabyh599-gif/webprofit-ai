let cart = [];

function addToCart(productId){

const product = products.find(
p => p.id === productId
);

cart.push(product);

updateCart();
}

function removeFromCart(index){

cart.splice(index, 1);

updateCart();
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

cartCount.textContent = cart.length;

cartTotal.textContent =
total.toLocaleString();
}

function orderWhatsApp(){

if(cart.length === 0){

alert("Panier vide");

return;
}

let message =
"🛍️ Nouvelle commande WebProfit AI%0A%0A";

let total = 0;

cart.forEach(item=>{

message +=
item.name +
" - " +
item.price +
" FCFA%0A";

total += item.price;

});

message +=
"%0ATotal : " +
total +
" FCFA";

window.open(
"https://wa.me/2250719949973?text=" +
message,
"_blank"
);
}