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

const budget =
parseInt(
question.replace(/\D/g,"")
);

let event = "";

if(question.includes("fête")){
event = "fête";
}

if(question.includes("sortie")){
event = "sortie";
}

let recommendations =
products.filter(
product => product.stock > 0
);

if(event){

recommendations =
recommendations.filter(
product => product.event === event
);

}

recommendations.sort(
(a,b)=>b.rating-a.rating
);

let selected = [];
let total = 0;

recommendations.forEach(product => {

if(
budget &&
total + product.price <= budget
){

selected.push(product);

total += product.price;

}

});

if(selected.length === 0){

result.innerHTML =
"🤖 Aucun produit trouvé.";

return;
}

let html = `
<h3>🤖 Conseil WebProfit AI</h3>
`;

selected.forEach(product => {

html += `
<div class="ai-product">

<img
src="${product.images[0]}"
onclick="showProduct(${product.id})">

<h4>${product.name}</h4>

<p>
💰 ${product.price.toLocaleString()} FCFA
</p>

</div>
`;
});

html += `
<hr>

<p>
💰 Total :
${total.toLocaleString()} FCFA
</p>
`;

if(budget){

html += `
<p>
💵 Reste :
${(budget-total).toLocaleString()} FCFA
</p>
`;
}

result.innerHTML = html;
}