function askAI() {

const question = document
.getElementById("ai-input")
.value
.toLowerCase();

const result =
document.getElementById("ai-result");

if(question.trim() === ""){
    result.innerHTML =
    "🤖 Écris ton besoin pour recevoir un conseil.";
    return;
}

if(
question.includes("5000") ||
question.includes("5 000")
){
    result.innerHTML =
    "🤖 Avec 5 000 FCFA, je te conseille une tenue simple pour une fête. Ajoute un peu de budget pour avoir plus de choix.";
    return;
}

if(
question.includes("15000") ||
question.includes("15 000")
){
    result.innerHTML =
    "🤖 Avec 15 000 FCFA, les Sneakers Premium sont un excellent choix.";
    return;
}

if(question.includes("montre")){
    result.innerHTML =
    "⌚ Je te recommande la Montre Premium à 6 500 FCFA.";
    return;
}

if(question.includes("chaussure")
|| question.includes("sneakers")){
    result.innerHTML =
    "👟 Les Sneakers Premium sont parfaites pour toi.";
    return;
}

if(question.includes("fête")){
    result.innerHTML =
    "🎉 Pour une fête, je te conseille l'Habit Élégant.";
    return;
}

result.innerHTML =
"🤖 Je continue d'apprendre. Essaie avec un budget ou un type de produit.";
}