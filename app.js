const products = [
{
id: 1,
name: "Habit Élégant",
price: 7500,
category: "fête",
image: "https://picsum.photos/300/300?1"
},
{
id: 2,
name: "Sneakers Premium",
price: 15000,
category: "chaussure",
image: "https://picsum.photos/300/300?2"
},
{
id: 3,
name: "Montre Premium",
price: 6500,
category: "accessoire",
image: "https://picsum.photos/300/300?3"
}
];

function displayProducts() {

const container =
document.getElementById("product-grid");

let html = "";

products.forEach(product => {

html += `
<div class="product-card">

<img src="${product.image}" alt="${product.name}">

<h3>${product.name}</h3>

<p>Catégorie : ${product.category}</p>

<span>${product.price.toLocaleString()} FCFA</span>

<button>🛒 Ajouter</button>

</div>
`;

});

container.innerHTML = html;

}

function askAI(){

const question =
document.getElementById("ai-input")
.value
.toLowerCase();

const result =
document.getElementById("ai-result");

if(question.trim() === ""){
result.innerHTML =
"🤖 Écris une demande.";
return;
}

let response = [];

products.forEach(product => {

if(question.includes(product.category)){
response.push(
`${product.name} - ${product.price.toLocaleString()} FCFA`
);
}

});

if(response.length > 0){

result.innerHTML =
"🤖 Je recommande :<br><br>" +
response.join("<br>");

return;

}

result.innerHTML =
"🤖 Aucun produit trouvé.";
}

displayProducts();