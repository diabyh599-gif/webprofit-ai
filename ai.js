function askAI(){

const question =
document.getElementById("ai-input")
.value
.toLowerCase();

const result =
document.getElementById("ai-result");

const budget =
parseInt(question.replace(/\D/g,""));

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

if(budget){

recommendations =
recommendations.filter(
product => product.price <= budget
);

}

if(event){

recommendations =
recommendations.filter(
product => product.event === event
);

}

if(recommendations.length === 0){

result.innerHTML =
"🤖 Désolé, aucun produit ne correspond à votre budget ou à votre événement.";

return;

}

recommendations.sort(
(a,b)=>b.price-a.price
);

const best =
recommendations[0];

result.innerHTML = `
<div style="text-align:left">

<h3>🤖 Conseil WebProfit AI</h3>

<p>
Pour votre demande,
je recommande :
</p>

<p>
<strong>${best.name}</strong>
</p>

<p>
💰 Prix :
${best.price.toLocaleString()} FCFA
</p>

<p>
📦 Stock :
${best.stock}
</p>

<p>
🎉 Événement :
${best.event}
</p>

</div>
`;
}