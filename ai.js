function askAI(){

const question =
document.getElementById("ai-input")
.value
.toLowerCase();

const result =
document.getElementById("ai-result");

const budget =
parseInt(question.replace(/\D/g,""));

let recommendations =
products.filter(
product => product.stock > 0
);

if(budget){

recommendations =
recommendations.filter(
product => product.price <= budget
);
}

if(recommendations.length === 0){

result.innerHTML =
"🤖 Aucun produit disponible.";

return;
}

let html =
"🤖 Produits disponibles :<br><br>";

recommendations.forEach(product=>{

html +=
`${product.name} (${product.stock} en stock) - ${product.price.toLocaleString()} FCFA<br>`;
});

result.innerHTML = html;
}