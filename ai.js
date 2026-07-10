function askAI(){

const question =
document.getElementById("ai-input")
.value
.toLowerCase();

const result =
document.getElementById("ai-result");

const budget =
parseInt(question.replace(/\D/g,""));

let selectedEvent = "";

if(question.includes("fête")){
selectedEvent = "fête";
}

if(question.includes("sortie")){
selectedEvent = "sortie";
}

let recommendations =
products;

if(budget){

recommendations =
recommendations.filter(product =>
product.price <= budget
);
}

if(selectedEvent){

recommendations =
recommendations.filter(product =>
product.event === selectedEvent
);
}

if(recommendations.length === 0){

result.innerHTML =
"🤖 Aucun produit trouvé pour cette demande.";

return;
}

let html =
"🤖 Je recommande :<br><br>";

recommendations.forEach(product=>{

html +=
`${product.name} - ${product.price.toLocaleString()} FCFA<br>`;

});

result.innerHTML = html;
}