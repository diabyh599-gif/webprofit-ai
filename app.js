const products = [
{
id: 1,
name: "Habit Élégant",
price: 7500,
category: "fête"
},
{
id: 2,
name: "Sneakers Premium",
price: 15000,
category: "chaussure"
},
{
id: 3,
name: "Montre Premium",
price: 6500,
category: "accessoire"
}
];

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
"🤖 Je recommande : <br><br>" +
response.join("<br>");

return;

}

if(question.includes("5000")){

result.innerHTML =
"🤖 Ton budget est un peu limité. Essaie d'augmenter ton budget pour avoir plus de choix.";

return;

}

if(question.includes("15000")){

result.innerHTML =
"🤖 Avec 15 000 FCFA, tu peux acheter les Sneakers Premium.";

return;

}

result.innerHTML =
"🤖 Aucun produit trouvé pour cette demande.";
}