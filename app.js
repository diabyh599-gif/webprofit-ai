function displayProducts(list = products){

const container =
document.getElementById("product-grid");

let html = "";

list.forEach(product => {

html += `
<div class="product-card">

<img src="${product.image}" alt="${product.name}">

<h3>${product.name}</h3>

<p>${product.category}</p>

<span>${product.price.toLocaleString()} FCFA</span>

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

displayProducts();