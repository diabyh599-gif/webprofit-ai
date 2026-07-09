const products = [
{
id:1,
name:"Habit Élégant",
price:7500,
category:"Fête"
},
{
id:2,
name:"Sneakers Premium",
price:15000,
category:"Casual"
},
{
id:3,
name:"Montre Premium",
price:6500,
category:"Accessoire"
}
];

function askAI() {

const input = document.getElementById("ai-input").value.toLowerCase();

const result = document.getElementById("ai-result");

if(input.includes("5000")){

result.innerHTML =
"🤖 Avec 5000 FCFA, je te recommande l'Habit Élégant.";

return;
}

if(input.includes("15000")){

result.innerHTML =
"🤖 Avec 15000 FCFA, les Sneakers Premium sont un excellent choix.";

return;
}

result.innerHTML =
"🤖 Je recherche le meilleur produit pour toi...";
}