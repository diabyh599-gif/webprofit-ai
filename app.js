let favorites =
JSON.parse(
localStorage.getItem("favorites")
) || [];

function toggleFavorite(id){

if(favorites.includes(id)){

favorites =
favorites.filter(f => f !== id);

}else{

favorites.push(id);

}

localStorage.setItem(
"favorites",
JSON.stringify(favorites)
);

displayProducts();
updateFavoritesCount();
}

function displayProducts(list = products){

const container =
document.getElementById("product-grid");

let html = "";
list = [...list].sort(
(a,b) => b.sales - a.sales
);

list.forEach(product => {

const favorite =
favorites.includes(product.id);

html += `
<div class="product-card">

${product.sales >= 3 ?
'<div class="badge-top">🏆 Top Vente</div>'
: ''}

${product.isNew ? '<div class="badge-new">🆕 Nouveau</div>' : ''}

${product.isBestSeller ? '<div class="badge-best">🔥 Best Seller</div>' : ''}

<div class="discount-badge">
-20%
</div>

<img
src="${product.images[0]}"
alt="${product.name}"
onclick="showProduct(${product.id})"
style="cursor:pointer;">

<h3>${product.name}</h3>

<p>${product.category}</p>

<p class="rating">
⭐⭐⭐⭐⭐
(${product.reviews} avis)
</p>

<p>📦 Stock : ${product.stock}</p>

<p>${product.delivery}</p>

<p>🔥 Popularité : ${product.sales}</p>

<div class="price-box">

<span class="current-price">
${product.price.toLocaleString()} FCFA
</span>

<span class="old-price">
${product.oldPrice.toLocaleString()} FCFA
</span>

</div>

<button onclick="toggleFavorite(${product.id})">
${favorite ? "❤️ Favori" : "🤍 Favori"}
</button>

<button onclick="addToCart(${product.id})">
🛒 Ajouter au panier
</button>

<button onclick="buyNow(${product.id})">
⚡ Acheter maintenant
</button>

</div>
`;

});

container.innerHTML = html;
}

function searchProducts(){

const search =
document.getElementById("search-input")
.value
.toLowerCase();

const filtered =
products.filter(product =>
product.name.toLowerCase().includes(search)
);

displayProducts(filtered);
}

function updateStats(){

const totalSales =
products.reduce(
(sum,p)=>sum+p.sales,
0
);

const stats =
document.getElementById("sales-count");

if(stats){

stats.textContent =
totalSales;

}

}

displayProducts();
updateStats();

function filterProducts(category){

if(category === "all"){

displayProducts(products);

return;

}

const filtered =
products.filter(
product => product.category === category
);

displayProducts(filtered);

}

function showProduct(id){

const product =
products.find(
p => p.id === id
);

const modal =
document.getElementById("product-modal");

const body =
document.getElementById("modal-body");

let gallery = "";

product.images.forEach(img => {

gallery += `
<img
src="${img}"
class="gallery-image">
`;

});

let comments = "";

product.comments.forEach(comment => {

comments += `
<p class="review">
${comment}
</p>
`;

});

body.innerHTML = `

<div class="gallery">
${gallery}
</div>

<h2>${product.name}</h2>

<p>⭐ ${product.rating} (${product.reviews} avis)</p>

<p>📦 Stock : ${product.stock}</p>

<div class="delivery">
${product.delivery}
</div>

<p>${product.category}</p>

<h3>${product.price.toLocaleString()} FCFA</h3>

<p style="text-decoration:line-through;">
${product.oldPrice.toLocaleString()} FCFA
</p>

<button onclick="addToCart(${product.id})">
🛒 Ajouter au panier
</button>

<button onclick="deleteProduct(${product.id})">
🗑️ Supprimer
</button>

`;

modal.style.display = "flex";

}

function closeModal(){

document.getElementById(
"product-modal"
).style.display = "none";

}

function updateFavoritesCount(){

const element =
document.getElementById(
"favorite-count"
);

if(element){

element.textContent =
favorites.length;

}

}

function simulateVisitors(){

const visitors =
document.getElementById(
"visitor-count"
);

if(!visitors) return;

setInterval(()=>{

let current =
parseInt(visitors.textContent);

current +=
Math.floor(Math.random()*3);

visitors.textContent =
current;

},10000);

}

simulateVisitors();

function startCountdown(){

let totalSeconds = 24 * 60 * 60;

const countdown =
document.getElementById("countdown");

if(!countdown) return;

setInterval(()=>{

let hours =
Math.floor(totalSeconds / 3600);

let minutes =
Math.floor((totalSeconds % 3600) / 60);

let seconds =
totalSeconds % 60;

countdown.textContent =
`${hours}h ${minutes}m ${seconds}s`;

if(totalSeconds > 0){

totalSeconds--;

}else{

totalSeconds = 24 * 60 * 60;

}

},1000);

}

updateFavoritesCount();


startCountdown();

function addProduct(){

const name =
document.getElementById("admin-name").value;

const price =
Number(
document.getElementById("admin-price").value
);

const category =
document.getElementById("admin-category").value;

const image =
document.getElementById("admin-image")
.value
.trim();
if(!name || !price || !category){

alert("Remplissez tous les champs");

return;

}

const newProduct = {

id: Date.now(),

name: name,

price: price,

oldPrice: price,

stock: 10,

sales: 0,

category: category,

event: "quotidien",

rating: 5,

reviews: 0,

isNew: true,

isBestSeller: false,

comments: [],

delivery: "🚚 Livraison 2 à 3 jours",

images: [image]

};

products.push(newProduct);

localStorage.setItem(
"products",
JSON.stringify(products)
);

displayProducts();

alert("Produit ajouté");

}

function deleteProduct(id){

const confirmDelete =
confirm(
"Voulez-vous supprimer ce produit ?"
);

if(!confirmDelete){
return;
}

const index =
products.findIndex(
product => product.id === id
);

if(index !== -1){

products.splice(index,1);

localStorage.setItem(
"products",
JSON.stringify(products)
);

displayProducts();

alert("Produit supprimé");

}

}

function editProduct(id){

const product =
products.find(p => p.id === id);

const newPrice = prompt(
"Nouveau prix",
product.price
);

if(newPrice === null) return;

product.price = Number(newPrice);

localStorage.setItem(
"products",
JSON.stringify(products)
);

displayProducts();

showProduct(id);

alert("Produit modifié");

}

function openAdmin(){

const password =
prompt("Mot de passe Admin");

if(password === "45886736"){

document.getElementById(
"admin-panel"
).style.display = "block";

}else{

alert("Accès refusé");

}

}

function updateAdminStats(){

const productsCount =
products.length;

const salesCount =
products.reduce(
(sum,p)=>sum+p.sales,
0
);

const revenue =
products.reduce(
(sum,p)=>sum+(p.sales*p.price),
0
);

const outStock =
products.filter(
p => p.stock <= 0
).length;

document.getElementById(
"admin-products-count"
).textContent = productsCount;

document.getElementById(
"admin-sales-count"
).textContent = salesCount;

document.getElementById(
"admin-revenue"
).textContent = revenue.toLocaleString();

document.getElementById(
"admin-out-stock"
).textContent = outStock;

}

updateAdminStats();

function displayOrders(){

const orders =
JSON.parse(
localStorage.getItem("orders")
) || [];

const container =
document.getElementById("admin-orders");

if(!container) return;

if(orders.length === 0){

container.innerHTML =
"Aucune commande";

return;

}

let html = "";

orders.forEach(order => {

html += `
<div class="order-card">

<p>
🆔 ${order.id}
</p>

<p>
📅 ${order.date}
</p>

<p>
💰 ${order.total} FCFA
</p>

</div>
`;

});

container.innerHTML = html;

}

displayOrders();

console.log("cart.js chargé");

function buyNow(id){

addToCart(id);

document.querySelector(
".cart-box"
).scrollIntoView({

behavior:"smooth"

});

}

function registerUser(){

const email =
document.getElementById("login-email").value;

const password =
document.getElementById("login-password").value;

if(!email || !password){

alert("Remplissez tous les champs");
return;

}

localStorage.setItem(
"userEmail",
email
);

localStorage.setItem(
"userPassword",
password
);

alert("Compte créé avec succès");

}

function loginUser(){

const email =
document.getElementById("login-email").value;

const password =
document.getElementById("login-password").value;

const savedEmail =
localStorage.getItem("userEmail");

const savedPassword =
localStorage.getItem("userPassword");

if(
email === savedEmail &&
password === savedPassword
){

localStorage.setItem(
"currentUser",
email
);

document.getElementById(
"login-status"
).textContent =
"✅ Connecté : " + email;

alert("Connexion réussie");

}else{

alert("Email ou mot de passe incorrect");

}

}

// ==========================================
// NOUVELLES FONCTIONS POUR LE COMPTE
// ==========================================

/**
 * Met à jour l'interface du compte utilisateur
 * Affiche le nom, l'email, le crédit et le statut de connexion
 */
function updateAccountUI() {
    const name = document.getElementById('account-name');
    const email = document.getElementById('account-email');
    const credit = document.getElementById('account-credit');
    const status = document.getElementById('login-status');
    const authForm = document.getElementById('auth-form');
    const profileEmoji = document.getElementById('profile-emoji');
    const loginStatus = document.getElementById('login-status');
    const authLabel = document.getElementById('auth-label');

    // Récupérer l'utilisateur stocké dans localStorage
    const stored = localStorage.getItem('user');
    
    if (stored) {
        try {
            const user = JSON.parse(stored);
            const displayName = user.email?.split('@')[0] || 'Utilisateur';
            
            if (name) name.textContent = displayName;
            if (email) email.textContent = user.email || 'Connecté';
            if (credit) credit.textContent = '10 000 FCFA'; // Valeur simulée
            if (profileEmoji) profileEmoji.textContent = '😎';
            if (loginStatus) loginStatus.textContent = '✅ Connecté avec succès';
            if (authForm) authForm.style.display = 'none';
            if (authLabel) authLabel.textContent = 'Se déconnecter';
            
            // Stocker le nom pour l'utiliser ailleurs
            localStorage.setItem('userName', displayName);
            
        } catch (e) {
            console.warn('Erreur de lecture du profil:', e);
            resetAccountUI();
        }
    } else {
        resetAccountUI();
    }
}

/**
 * Réinitialise l'UI du compte quand l'utilisateur est déconnecté
 */
function resetAccountUI() {
    const name = document.getElementById('account-name');
    const email = document.getElementById('account-email');
    const credit = document.getElementById('account-credit');
    const profileEmoji = document.getElementById('profile-emoji');
    const loginStatus = document.getElementById('login-status');
    const authForm = document.getElementById('auth-form');
    const authLabel = document.getElementById('auth-label');

    if (name) name.textContent = 'Invité';
    if (email) email.textContent = 'Non connecté';
    if (credit) credit.textContent = '0 FCFA';
    if (profileEmoji) profileEmoji.textContent = '👤';
    if (loginStatus) loginStatus.textContent = '❌ Non connecté';
    if (authForm) authForm.style.display = 'block';
    if (authLabel) authLabel.textContent = 'Se connecter';
}

/**
 * Navigation vers une section (menu du compte)
 * @param {string} section - Nom de la section à afficher
 */
function navigateTo(section) {
    const messages = {
        'help': '🆘 Aide & Assistance - Contactez-nous par WhatsApp !',
        'account': '👤 Mon compte - Consultez vos informations',
        'orders': '📋 Mes Commandes - Suivez vos achats',
        'inbox': '📩 Boîte de réception - Vos messages',
        'reviews': '⭐ Notes et avis - Donnez votre avis',
        'favorites': '❤️ Favoris - Vos produits préférés',
        'followed': '👥 Vendeurs Suivis - Les vendeurs que vous suivez',
        'history': '🕐 Derniers produits vus - Votre historique',
        'payment': '💳 Paramètres de paiement - Gérez vos moyens de paiement',
        'address': '📍 Carnet d\'adresses - Vos adresses de livraison',
        'settings': '🔐 Gestion de compte - Sécurité et confidentialité',
        'notifications': '🔔 Préférences de notification - Gérez vos alertes',
        'privacy': '🔒 Politique de Confidentialité - Comment nous protégeons vos données'
    };

    const message = messages[section] || `📍 Page "${section}" - Fonctionnalité à venir !`;
    
    // Afficher une notification visuelle au lieu d'une alerte (plus propre)
    showToast(message);
}

/**
 * Ouvre le chat en direct (version améliorée)
 */
function openChat() {
    // Vérifier si l'utilisateur est connecté
    const user = localStorage.getItem('user');
    if (!user) {
        showToast('💬 Connectez-vous pour accéder au chat !');
        return;
    }
    showToast('💬 Chat en direct - Un conseiller va vous répondre !');
}

/**
 * Ouvre WhatsApp avec un message pré-rempli
 */
function openWhatsApp() {
    const user = localStorage.getItem('user');
    let name = 'Client';
    
    if (user) {
        try {
            const parsed = JSON.parse(user);
            name = parsed.email?.split('@')[0] || 'Client';
        } catch (e) {}
    }
    
    const message = `Bonjour WebProfit AI ! Je suis ${name} et je souhaite passer une commande.`;
    const phone = '22500000000'; // Remplace par ton numéro WhatsApp
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

/**
 * Affiche une notification temporaire (toast)
 * @param {string} message - Message à afficher
 */
function showToast(message) {
    // Vérifier si un toast existe déjà
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: #1a1a2e;
            color: white;
            padding: 14px 24px;
            border-radius: 16px;
            font-weight: 600;
            font-size: 0.95rem;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 9999;
            max-width: 90%;
            text-align: center;
            transition: opacity 0.3s, transform 0.3s;
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
            pointer-events: none;
            border: 1px solid rgba(255,255,255,0.1);
        `;
        document.body.appendChild(toast);
    }
    
    // Mettre à jour le message
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    
    // Cacher après 3 secondes
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 3000);
}

/**
 * Surcharge de la fonction logoutUser pour mettre à jour l'UI
 * (Garde l'ancienne fonction, on l'améliore)
 */
const originalLogout = window.logoutUser;
window.logoutUser = function() {
    if (typeof originalLogout === 'function') {
        originalLogout();
    }
    // Mettre à jour l'UI du compte
    setTimeout(resetAccountUI, 100);
    showToast('🚪 Déconnexion réussie');
};

/**
 * Surcharge de loginUser pour mettre à jour l'UI
 */
const originalLogin = window.loginUser;
window.loginUser = function() {
    if (typeof originalLogin === 'function') {
        originalLogin();
    }
    // Mettre à jour l'UI du compte après connexion
    setTimeout(updateAccountUI, 300);
};

/**
 * Surcharge de registerUser pour mettre à jour l'UI
 */
const originalRegister = window.registerUser;
window.registerUser = function() {
    if (typeof originalRegister === 'function') {
        originalRegister();
    }
    // Mettre à jour l'UI du compte après inscription
    setTimeout(updateAccountUI, 300);
};

// ==========================================
// INITIALISATION AUTOMATIQUE
// ==========================================

// Mettre à jour l'UI du compte au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateAccountUI, 500);
});

// Mettre à jour le badge du panier depuis le compte
setInterval(function() {
    const cartCount = document.getElementById('cart-count');
    const badge = document.getElementById('cart-badge');
    const headerBadge = document.getElementById('header-cart-badge');
    
    if (cartCount && badge) {
        const count = cartCount.textContent || '0';
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
    if (cartCount && headerBadge) {
        const count = cartCount.textContent || '0';
        headerBadge.textContent = count;
        headerBadge.style.display = count > 0 ? 'flex' : 'none';
    }
}, 500);