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
}

function displayProducts(list = products){

const container =
document.getElementById("product-grid");

let html = "";

list.forEach(product => {

const favorite =
favorites.includes(product.id);

html += `
<div class="product-card">

${product.isNew ? '<div class="badge-new">🆕 Nouveau</div>' : ''}

${product.isBestSeller ? '<div class="badge-best">🔥 Best Seller</div>' : ''}

<img src="${product.image}" alt="${product.name}">

<h3>${product.name}</h3>

<p>${product.category}</p>

<p>⭐ ${product.rating} (${product.reviews} avis)</p>

<p>📦 Stock : ${product.stock}</p>

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