let discount = 0;

let cart = JSON.parse(
localStorage.getItem("cart")
) || [];

function saveCart(){

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

localStorage.setItem(
"products",
JSON.stringify(products)
);

}

function addToCart(productId){

const product =
products.find(
p => p.id === productId
);

if(!product){
return;
}

if(product.stock <= 0){

alert("Produit épuisé");

return;

}

product.stock--;
product.sales++;

cart.push(product);

saveCart();

updateCart();

displayProducts();

updateStats();

}

function removeFromCart(index){

const product =
cart[index];

if(product){

product.stock++;

}

cart.splice(index,1);

saveCart();

updateCart();

displayProducts();

updateStats();

}

function updateCart(){

const cartItems =
document.getElementById("cart-items");

const cartCount =
document.getElementById("cart-count");

const cartTotal =
document.getElementById("cart-total");

let html = "";

let total = 0;

cart.forEach((item,index)=>{

total += item.price;

html += `
<div class="cart-item">

<img
src="${item.images[0]}"
width="60"
height="60"
style="border-radius:10px;">

<p>
${item.name}
<br>
${item.price.toLocaleString()} FCFA
</p>

<div>

<button onclick="removeFromCart(${index})">
➖
</button>

<span>1</span>

<button onclick="addToCart(${item.id})">
➕
</button>

</div>

</div>
`;

});

if(cartItems){
cartItems.innerHTML = html;
}

if(cartCount){
cartCount.textContent = cart.length;
}

const finalPrice =
total - (total * discount / 100);

if(cartTotal){
cartTotal.textContent =
finalPrice.toLocaleString();
}

}

function orderWhatsApp(){

const customerName =
document.getElementById("customer-name").value;

const customerPhone =
document.getElementById("customer-phone").value;

const customerAddress =
document.getElementById("customer-address").value;

if(
!customerName ||
!customerPhone ||
!customerAddress
){

alert("Remplissez vos informations");
return;

}

if(cart.length === 0){

alert("Panier vide");
return;

}

let total = 0;

let message =
"🛍️ Nouvelle commande WebProfit AI%0A%0A";

message +=
"👤 Client : " +
customerName +
"%0A";

message +=
"📞 Téléphone : " +
customerPhone +
"%0A";

message +=
"📍 Adresse : " +
customerAddress +
"%0A%0A";

cart.forEach(item => {

message +=
item.name +
" - " +
item.price +
" FCFA%0A";

total += item.price;

});

message +=
"%0A💰 Total : " +
total +
" FCFA";

let orders =
JSON.parse(
localStorage.getItem("orders")
) || [];

orders.push({

id: Date.now(),
date: new Date().toLocaleString(),
customerName,
customerPhone,
customerAddress,
items: cart,
total

});

localStorage.setItem(
"orders",
JSON.stringify(orders)
);

window.open(
"https://wa.me/2250719949973?text=" +
encodeURIComponent(
decodeURIComponent(message)
),
"_blank"
);

const tracking =
document.getElementById(
"tracking-status"
);

if(tracking){

tracking.innerHTML =
"🟡 Commande reçue";

setTimeout(()=>{
tracking.innerHTML =
"🔵 Préparation";
},3000);

setTimeout(()=>{
tracking.innerHTML =
"🟣 Expédiée";
},6000);

setTimeout(()=>{
tracking.innerHTML =
"🟢 Livrée";
},9000);

}

alert("Commande enregistrée !");

}

function applyPromo(){

const code =
document.getElementById(
"promo-code"
).value.toUpperCase();

const message =
document.getElementById(
"promo-message"
);

if(code === "BIENVENUE10"){

discount = 10;

message.innerHTML =
"✅ Réduction de 10% appliquée";

}
else if(code === "FETE20"){

discount = 20;

message.innerHTML =
"✅ Réduction de 20% appliquée";

}
else{

discount = 0;

message.innerHTML =
"❌ Code invalide";

}

updateCart();

}

updateCart();

/* ==========================================
   PANIER ULTIME - VERSION 2.0
   ========================================== */

// Données simulées
const savedProducts = [
    { id: 's1', name: 'Montres Pour Femmes', price: 994, oldPrice: 4739, discount: '-79%', image: 'https://via.placeholder.com/200' },
    { id: 's2', name: 'Gandour Eau De Parf...', price: 3000, oldPrice: null, image: 'https://via.placeholder.com/200' },
    { id: 's3', name: 'HUAHU', price: 1950, oldPrice: 5850, discount: '-67%', image: 'https://via.placeholder.com/200' },
    { id: 's4', name: 'Sac à Dos', price: 3703, oldPrice: 10003, discount: '-63%', image: 'https://via.placeholder.com/200' },
    { id: 's5', name: 'VIC 20000mAh', price: 3211, oldPrice: 18850, discount: '-83%', image: 'https://via.placeholder.com/200' }
];

const recentProducts = [
    { id: 'r1', name: 'Aspirateur portable 3...', price: 13000, oldPrice: 25000, discount: '-48%', image: 'https://via.placeholder.com/200' },
    { id: 'r2', name: 'VIC 20000mAh Banq...', price: 3211, oldPrice: 18850, discount: '-83%', image: 'https://via.placeholder.com/200' }
];

const suggestions = [
    { id: 'g1', name: 'Guixia Air31 Éco...', price: 945, oldPrice: 3439, discount: '-73%', image: 'https://via.placeholder.com/200' },
    { id: 'g2', name: 'Guixia Air31 Éco...', price: 945, oldPrice: 3439, discount: '-73%', image: 'https://via.placeholder.com/200' },
    { id: 'g3', name: 'JNKACL', price: 1248, oldPrice: 3835, discount: '-67%', image: 'https://via.placeholder.com/200' }
];

const FREE_SHIPPING_THRESHOLD = 7500; // Seuil livraison gratuite

/* ===== FONCTIONS PRINCIPALES ===== */

/**
 * Rendu complet du panier
 */
function renderCart() {
    const cart = getCart();
    const container = document.getElementById('cart-items');
    const countHeader = document.getElementById('cart-items-count-header');
    const countSection = document.getElementById('cart-items-count');
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const discountRow = document.getElementById('discount-row');
    const shippingEl = document.getElementById('cart-shipping');
    const totalEl = document.getElementById('cart-total');
    const totalBtnEl = document.getElementById('cart-total-btn');

    if (!container) return;

    // Panier vide
    if (!cart || cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <span>🛒</span>
                <p>Votre panier est vide</p>
                <small>Parcourez nos catégories et découvrez nos meilleures offres !</small>
                <button onclick="showSection('home')">Commencez vos achats</button>
            </div>
        `;
        updateCounts(0);
        updateTotals(0, 0);
        updateProgressBar(0);
        updateCheckoutBtn(0);
        return;
    }

    // Calcul des totaux
    let subtotal = 0;
    let discountTotal = 0;
    let html = '';

    cart.forEach((item, index) => {
        const price = item.price || 0;
        const qty = item.quantity || 1;
        const total = price * qty;
        subtotal += total;

        // Appliquer une réduction simulée (10% si > 3 articles)
        if (qty > 3 && item.discount === undefined) {
            const itemDiscount = total * 0.1;
            discountTotal += itemDiscount;
            item._discount = itemDiscount;
        }

        html += `
            <div class="cart-item" data-index="${index}">
                <img src="${item.image || 'https://via.placeholder.com/70'}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/70'" />
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-meta">
                        <span class="cart-item-price">${formatPrice(total)} FCFA</span>
                        ${item.oldPrice ? `<span class="cart-item-old-price">${formatPrice(item.oldPrice)} FCFA</span>` : ''}
                        ${item.discount ? `<span class="cart-item-discount">${item.discount}</span>` : ''}
                        ${item._discount ? `<span class="cart-item-discount" style="background:#22c55e;">-10%</span>` : ''}
                    </div>
                    <div class="cart-item-meta">
                        <span class="cart-item-stock">✅ Disponible</span>
                        ${item.delivery ? `<span class="cart-item-delivery">🚚 ${item.delivery}</span>` : ''}
                    </div>
                    <div class="cart-item-actions">
                        <button class="qty-btn" onclick="updateQuantity(${index}, -1)">−</button>
                        <span class="qty">${qty}</span>
                        <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${index})">🗑️ Supprimer</button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Mise à jour des affichages
    const finalTotal = subtotal - discountTotal;
    updateCounts(cart.length);
    updateTotals(subtotal, discountTotal, finalTotal);
    updateProgressBar(subtotal);
    updateCheckoutBtn(finalTotal);

    // Mise à jour du badge
    updateCartBadge();
}

/**
 * Met à jour les compteurs
 */
function updateCounts(count) {
    const countHeader = document.getElementById('cart-items-count-header');
    const countSection = document.getElementById('cart-items-count');
    const savedCount = document.getElementById('saved-count');

    const text = `${count} article${count > 1 ? 's' : ''}`;
    if (countHeader) countHeader.textContent = text;
    if (countSection) countSection.textContent = count;
    if (savedCount) savedCount.textContent = savedProducts.length;
}

/**
 * Met à jour les totaux
 */
function updateTotals(subtotal, discount, total) {
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const discountRow = document.getElementById('discount-row');
    const totalEl = document.getElementById('cart-total');

    if (subtotalEl) subtotalEl.textContent = `${formatPrice(subtotal)} FCFA`;
    
    if (discount > 0) {
        if (discountRow) discountRow.style.display = 'flex';
        if (discountEl) discountEl.textContent = `- ${formatPrice(discount)} FCFA`;
    } else {
        if (discountRow) discountRow.style.display = 'none';
    }

    if (totalEl) totalEl.textContent = `${formatPrice(total || subtotal)} FCFA`;
}

/**
 * Met à jour la barre de livraison
 */
function updateProgressBar(subtotal) {
    const progress = document.getElementById('shipping-progress');
    const message = document.getElementById('shipping-message');
    const remainingEl = document.getElementById('remaining-amount');

    if (!progress || !message) return;

    const percent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
    progress.style.width = `${percent}%`;

    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        message.innerHTML = '🎉 <strong>Félicitations !</strong> Livraison gratuite !';
        message.className = 'progress-label done';
    } else {
        const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
        message.innerHTML = `🚚 Ajoutez <strong>${formatPrice(remaining)} FCFA</strong> pour la livraison gratuite`;
        message.className = 'progress-label';
    }
}

/**
 * Met à jour le bouton commander
 */
function updateCheckoutBtn(total) {
    const btn = document.getElementById('cart-total-btn');
    if (btn) btn.textContent = `${formatPrice(total)} FCFA`;
}

/**
 * Met à jour la quantité
 */
function updateQuantity(index, delta) {
    const cart = getCart();
    if (!cart || !cart[index]) return;

    const newQty = (cart[index].quantity || 1) + delta;
    if (newQty <= 0) {
        // Supprimer avec animation
        const item = cart[index];
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
        updateCartBadge();
        showToast(`🗑️ "${item.name}" supprimé`);
        return;
    }

    cart[index].quantity = newQty;
    saveCart(cart);
    renderCart();
    updateCartBadge();
}

/**
 * Supprime un article
 */
function removeFromCart(index) {
    const cart = getCart();
    if (!cart || !cart[index]) return;
    
    const item = cart[index];
    const name = item.name;
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
    updateCartBadge();
    showToast(`🗑️ "${name}" supprimé`);

    // Undo (annulation)
    setTimeout(() => {
        if (!cart.find(i => i.id === item.id)) {
            showToast('🔄 Cliquez pour annuler la suppression', true, () => {
                cart.push(item);
                saveCart(cart);
                renderCart();
                updateCartBadge();
                showToast(`✅ "${name}" réajouté`);
            });
        }
    }, 2000);
}

/**
 * Vide le panier
 */
function clearCart() {
    if (confirm('🛒 Vider tout le panier ?')) {
        saveCart([]);
        renderCart();
        updateCartBadge();
        showToast('🗑️ Panier vidé');
    }
}

/**
 * Rendu des produits enregistrés
 */
function renderSavedProducts() {
    const container = document.getElementById('saved-products-grid');
    const count = document.getElementById('saved-count');
    if (!container) return;

    if (count) count.textContent = savedProducts.length;

    container.innerHTML = savedProducts.map(p => `
        <div class="saved-product-card" onclick="addToCartFromSaved('${p.id}')">
            <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/200'" />
            <div class="product-name">${p.name}</div>
            <div class="price-row">
                <span class="current-price">${formatPrice(p.price)} FCFA</span>
                ${p.oldPrice ? `<span class="old-price">${formatPrice(p.oldPrice)} FCFA</span>` : ''}
            </div>
            <button class="buy-btn">Acheter</button>
        </div>
    `).join('');
}

/**
 * Rendu des produits récents
 */
function renderRecentProducts() {
    const container = document.getElementById('recent-products-grid');
    if (!container) return;

    container.innerHTML = recentProducts.map(p => `
        <div class="recent-product-card" onclick="showProductDetail('${p.id}')">
            <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/200'" />
            <div class="product-name">${p.name}</div>
            <div class="price-row">
                <span class="current-price">${formatPrice(p.price)} FCFA</span>
                ${p.oldPrice ? `<span class="old-price">${formatPrice(p.oldPrice)} FCFA</span>` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * Rendu des suggestions
 */
function renderSuggestions() {
    const container = document.getElementById('suggestions-grid');
    if (!container) return;

    container.innerHTML = suggestions.map(p => `
        <div class="suggestion-card" onclick="showProductDetail('${p.id}')">
            <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/200'" />
            <div class="product-name">${p.name}</div>
            <div class="price-row">
                <span class="current-price">${formatPrice(p.price)} FCFA</span>
                ${p.oldPrice ? `<span class="old-price">${formatPrice(p.oldPrice)} FCFA</span>` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * Ajoute un produit enregistré au panier
 */
function addToCartFromSaved(productId) {
    const product = savedProducts.find(p => p.id === productId);
    if (!product) return;

    const cart = getCart();
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    saveCart(cart);
    renderCart();
    updateCartBadge();
    showToast('✅ Produit ajouté au panier !');
}

/**
 * Formatte un prix
 */
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Toast avec undo
 */
function showToast(message, withUndo = false, undoCallback = null) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
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
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: none;
            border: 1px solid rgba(255,255,255,0.1);
        `;
        document.body.appendChild(toast);
    }

    if (withUndo && undoCallback) {
        toast.innerHTML = `${message} <span style="color:#f97316;margin-left:12px;cursor:pointer;pointer-events:auto;" onclick="this.parentElement.style.opacity='0';undoCallback()">↩️ Annuler</span>`;
        // Stocker le callback
        window._undoCallback = undoCallback;
    } else {
        toast.textContent = message;
    }

    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.pointerEvents = 'auto';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        toast.style.pointerEvents = 'none';
    }, 3000);
}

/**
 * Initialisation
 */
function initCart() {
    renderCart();
    renderSavedProducts();
    renderRecentProducts();
    renderSuggestions();
}

// Appel au chargement
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initCart, 300);
});

// Mise à jour auto du badge
setInterval(function() {
    const cart = getCart();
    const count = cart ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
    const badge = document.getElementById('cart-badge');
    const headerBadge = document.getElementById('header-cart-badge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
    if (headerBadge) {
        headerBadge.textContent = count;
        headerBadge.style.display = count > 0 ? 'flex' : 'none';
    }
}, 500);