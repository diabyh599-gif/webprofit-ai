let favorites = [];

function toggleFavorite(id){

if(favorites.includes(id)){

favorites =
favorites.filter(f => f !== id);

}else{

favorites.push(id);

}

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

<img src="${product.image}" alt="${product.name}">

<h3>${product.name}</h3>

<p>${product.category}</p>

<p>📦 Stock : ${product.stock}</p>

<p>🔥 Popularité : ${product.sales}</p>

<span>${product.price.toLocaleString()} FCFA</span>

<button onclick="toggleFavorite(${product.id})">
${favorite ? "❤️" : "🤍"}
</button>

<button onclick="addToCart(${product.id})">
🛒 Ajouter
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

document.getElementById("sales-count")
.textContent =
totalSales;
}

displayProducts();