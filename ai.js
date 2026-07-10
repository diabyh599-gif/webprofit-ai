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
"🤖 Je cherche le meilleur produit pour toi.";
}