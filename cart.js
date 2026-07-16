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
products.find(
p => p.id === productId
);

if(!product){
return;
}

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

const product =
cart[index];

if(product){

product.stock++;

}

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

if(cartItems){

cartItems.innerHTML = html;

}

if(cartCount){

cartCount.textContent =
cart.length;

}

if(cart.length >= 3){

discount = 5;

const promoMessage =
document.getElementById(
"promo-message"
);

if(promoMessage){

promoMessage.innerHTML =
"🎉 Bonus fidélité : 5% appliqué";

}

}

const finalPrice =
total - (total * discount / 100);

if(cartTotal){

cartTotal.textContent =
finalPrice.toLocaleString();

}

}

function orderWhatsApp(){
let orders =
JSON.parse(
localStorage.getItem("orders")
) || [];

orders.push({
id: Date.now(),
date: new Date().toLocaleString(),
items: cart,
total: total
});

localStorage.setItem(
"orders",
JSON.stringify(orders)
);

let message =
"🛍️ Nouvelle commande WebProfit AI%0A%0A";

let total = 0;

cart.forEach(item => {

message +=
item.name +
" - " +
item.price +
" FCFA%0A";

total += item.price;

});

message +=
"%0A💰 Total : " +
total +
" FCFA";

window.open(
"https://wa.me/2250719949973?text=" +
message,
"_blank"
);

const tracking =
document.getElementById(
"tracking-status"
);

if(tracking){

tracking.innerHTML =
"🟡 Commande reçue";

setTimeout(()=>{

tracking.innerHTML =
"🔵 Préparation";

},3000);

setTimeout(()=>{

tracking.innerHTML =
"🟣 Expédiée";

},6000);

setTimeout(()=>{

tracking.innerHTML =
"🟢 Livrée";

},9000);

}

alert(
"Commande enregistrée !"
);

}

function applyPromo(){

const code =
document.getElementById(
"promo-code"
).value.toUpperCase();

const message =
document.getElementById(
"promo-message"
);

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

updateCart();