function askAI(){

const question =
document.getElementById("ai-input")
.value
.toLowerCase();

const result =
document.getElementById("ai-result");

const budget =
parseInt(question.replace(/\D/g,""));

if(!budget){

result.innerHTML =
"🤖 Indique ton budget. Exemple : J'ai 10000 FCFA";

return;
}

const recommendations =
products.filter(product =>
product.price <= budget
);

if(recommendations.length === 0){

result.innerHTML =
"🤖 Aucun produit disponible pour ce budget.";

return;
}

let html =
"🤖 Produits recommandés :<br><br>";

recommendations.forEach(product => {

html +=
`${product.name} - ${product.price.toLocaleString()} FCFA<br>`;

});

result.innerHTML = html;
}