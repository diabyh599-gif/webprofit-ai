const products = [
{
id:1,
name:"Habit Élégant",
price:7500,
category:"fête",
image:"https://picsum.photos/300/300?1"
},
{
id:2,
name:"Sneakers Premium",
price:15000,
category:"chaussure",
image:"https://picsum.photos/300/300?2"
},
{
id:3,
name:"Montre Premium",
price:6500,
category:"accessoire",
image:"https://picsum.photos/300/300?3"
}
];

let favorites = JSON.parse(
localStorage.getItem("favorites")
) || [];

function displayProducts(list = products){

const container =
document.getElementById("product-grid");

let html = "";

list.forEach(product => {

const isFavorite =
favorites.includes(product.id);

html += `
<div class="product-card">

<img src="${product.image}" alt="${product.name}">

<h3>${product.name}</h3>

<p>${product.category}</p>

<span>${product.price.toLocaleString()} FCFA</span>

<button onclick="toggleFavorite(${product.id})">
${isFavorite ? "❤️ Retirer" : "🤍 Favori"}
</button>

</div>
`;
});

container.innerHTML = html;
}

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

function askAI(){

const question =
document.getElementById("ai-input")
.value
.toLowerCase();

const result =
document.getElementById("ai-result");

if(question.includes("fête")){
result.innerHTML =
"🎉 Je recommande l'Habit Élégant.";
return;
}

if(question.includes("chaussure")){
result.innerHTML =
"👟 Je recommande les Sneakers Premium.";
return;
}

if(question.includes("montre")){
result.innerHTML =
"⌚ Je recommande la Montre Premium.";
return;
}

result.innerHTML =
"🤖 Je recherche le meilleur produit pour toi.";
}

displayProducts();