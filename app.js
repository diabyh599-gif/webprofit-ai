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

<img
src="${product.images[0]}"
alt="${product.name}"
onclick="showProduct(${product.id})"
style="cursor:pointer;">

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

<p>
⭐ ${product.rating}
(${product.reviews} avis)
</p>

<p>
📦 Stock :
${product.stock}
</p>

<p>
${product.category}
</p>

<h3>
${product.price.toLocaleString()} FCFA
</h3>

<p style="text-decoration:line-through;">
${product.oldPrice.toLocaleString()} FCFA
</p>

<button
onclick="addToCart(${product.id})">
🛒 Ajouter au panier
</button>

`;

modal.style.display = "flex";

}

function closeModal(){

document.getElementById(
"product-modal"
).style.display = "none";

}