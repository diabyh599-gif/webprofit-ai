// ==========================================
// CART.JS - VERSION FIREBASE (PRO)
// ==========================================

// ===== VARIABLES GLOBALES =====
let discount = 0;
let cart = [];
const FREE_SHIPPING_THRESHOLD = 7500;

// ==========================================
// FONCTIONS DE BASE
// ==========================================

/**
 * Récupère le panier depuis localStorage
 */
function getCart() {
    try {
        const data = localStorage.getItem('cart');
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

/**
 * Sauvegarde le panier dans localStorage
 */
function saveCart(cartData) {
    localStorage.setItem('cart', JSON.stringify(cartData));
    cart = cartData;
    updateCartBadge();
    renderCart();
}

/**
 * Met à jour le badge du panier
 */
function updateCartBadge() {
    const cartData = getCart();
    const count = cartData.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    document.querySelectorAll('#cart-badge, #header-cart-badge, .nav-badge').forEach(el => {
        if (el) {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        }
    });
}

// ==========================================
// FONCTIONS PRINCIPALES
// ==========================================

/**
 * Ajoute un produit au panier
 */
function addToCart(productId) {
    // Chercher le produit
    let product = null;
    
    if (typeof products !== 'undefined' && products) {
        product = products.find(p => p.id == productId);
    }
    
    if (!product && typeof savedProducts !== 'undefined') {
        product = savedProducts.find(p => p.id == productId);
    }
    
    if (!product) {
        showToast('❌ Produit introuvable');
        return;
    }
    
    // Vérifier le stock
    if (product.stock !== undefined && product.stock <= 0) {
        showToast('❌ Produit épuisé');
        return;
    }

    const cartData = getCart();
    const existing = cartData.find(item => item.id == productId);
    
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
        showToast(`✅ ${product.name} : quantité ${existing.quantity}`);
    } else {
        cartData.push({
            id: productId,
            name: product.name,
            price: product.price || 0,
            image: product.images ? product.images[0] : (product.image || 'https://via.placeholder.com/200'),
            quantity: 1,
            oldPrice: product.oldPrice || null,
            discount: product.discount || null,
            delivery: product.delivery || '🚚 Livraison 2-3 jours'
        });
        showToast(`✅ ${product.name} ajouté !`);
    }
    
    // Mettre à jour le stock
    if (product.stock !== undefined) {
        product.stock--;
        if (typeof saveProducts === 'function') saveProducts();
        if (typeof updateStats === 'function') updateStats();
    }
    
    saveCart(cartData);
    updateCartBadge();
}

/**
 * Supprime un produit du panier
 */
function removeFromCart(index) {
    const cartData = getCart();
    if (!cartData || !cartData[index]) return;
    
    const item = cartData[index];
    const name = item.name;
    
    // Restaurer le stock
    if (typeof products !== 'undefined' && products) {
        const product = products.find(p => p.id == item.id);
        if (product && product.stock !== undefined) {
            product.stock += (item.quantity || 1);
        }
    }
    
    cartData.splice(index, 1);
    saveCart(cartData);
    showToast(`🗑️ "${name}" supprimé`);
}

/**
 * Met à jour la quantité
 */
function updateQuantity(index, delta) {
    const cartData = getCart();
    if (!cartData || !cartData[index]) return;

    const newQty = (cartData[index].quantity || 1) + delta;
    
    if (newQty <= 0) {
        removeFromCart(index);
        return;
    }
    
    cartData[index].quantity = newQty;
    saveCart(cartData);
}

/**
 * Vide le panier
 */
function clearCart() {
    if (confirm('🛒 Vider tout le panier ?')) {
        saveCart([]);
        showToast('🗑️ Panier vidé');
    }
}

// ==========================================
// AFFICHAGE DU PANIER
// ==========================================

function renderCart() {
    const cartData = getCart();
    const container = document.getElementById('cart-items');
    if (!container) return;

    // Panier vide
    if (!cartData || cartData.length === 0) {
        container.innerHTML = `
            <div class="empty-cart" style="text-align:center;padding:40px 20px;background:white;border-radius:16px;">
                <span style="font-size:3rem;">🛒</span>
                <p style="font-weight:600;margin:8px 0;">Votre panier est vide</p>
                <small style="color:#888;">Parcourez nos catégories et découvrez nos meilleures offres !</small>
                <button onclick="showSection('home')" style="padding:12px 30px;background:#f97316;color:white;border:none;border-radius:12px;font-weight:700;cursor:pointer;margin-top:12px;">
                    Commencez vos achats
                </button>
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

    cartData.forEach((item, index) => {
        const price = item.price || 0;
        const qty = item.quantity || 1;
        const total = price * qty;
        subtotal += total;

        // Réduction si > 3 articles (simulée)
        if (qty > 3 && !item._discountApplied) {
            const itemDiscount = total * 0.1;
            discountTotal += itemDiscount;
            item._discountApplied = true;
            item._discount = itemDiscount;
        }

        html += `
            <div class="cart-item" data-index="${index}" style="background:white;border-radius:14px;padding:14px;display:flex;gap:14px;margin-bottom:10px;box-shadow:0 2px 8px rgba(0,0,0,0.05);align-items:center;">
                <img src="${item.image || 'https://via.placeholder.com/70'}" alt="${item.name}" 
                     style="width:70px;height:70px;border-radius:10px;object-fit:cover;flex-shrink:0;background:#f0f0f0;"
                     onerror="this.src='https://via.placeholder.com/70'">
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:600;font-size:0.9rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                        ${item.name}
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:4px;">
                        <span style="font-weight:700;color:#f97316;font-size:0.95rem;">${formatPrice(total)} FCFA</span>
                        ${item.oldPrice ? `<span style="font-size:0.75rem;color:#aaa;text-decoration:line-through;">${formatPrice(item.oldPrice)} FCFA</span>` : ''}
                        ${item.discount ? `<span style="background:#ef4444;color:white;padding:2px 8px;border-radius:12px;font-size:0.6rem;font-weight:700;">${item.discount}</span>` : ''}
                        ${item._discount ? `<span style="background:#22c55e;color:white;padding:2px 8px;border-radius:12px;font-size:0.6rem;font-weight:700;">-10%</span>` : ''}
                    </div>
                    <div style="display:flex;align-items:center;gap:6px;margin-top:6px;">
                        <button onclick="updateQuantity(${index}, -1)" 
                                style="width:30px;height:30px;border-radius:50%;border:1px solid #ddd;background:white;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                            −
                        </button>
                        <span style="font-weight:600;min-width:24px;text-align:center;">${qty}</span>
                        <button onclick="updateQuantity(${index}, 1)" 
                                style="width:30px;height:30px;border-radius:50%;border:1px solid #ddd;background:white;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                            +
                        </button>
                        <button onclick="removeFromCart(${index})" 
                                style="background:none;border:none;color:#ef4444;cursor:pointer;font-weight:600;font-size:0.75rem;padding:4px 8px;">
                            🗑️ Supprimer
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Mise à jour des affichages
    const finalTotal = subtotal - discountTotal - (subtotal * discount / 100);
    updateCounts(cartData.length);
    updateTotals(subtotal, discountTotal + (subtotal * discount / 100), finalTotal);
    updateProgressBar(subtotal);
    updateCheckoutBtn(finalTotal);
}

/**
 * Met à jour les compteurs
 */
function updateCounts(count) {
    document.querySelectorAll('#cart-items-count-header, #cart-items-count').forEach(el => {
        if (el) {
            const text = `${count} article${count > 1 ? 's' : ''}`;
            if (el.id === 'cart-items-count') {
                el.textContent = count;
            } else {
                el.textContent = text;
            }
        }
    });
    
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.textContent = count;
}

/**
 * Met à jour les totaux
 */
function updateTotals(subtotal, discountAmount, total) {
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const discountRow = document.getElementById('discount-row');
    const totalEl = document.getElementById('cart-total');

    if (subtotalEl) subtotalEl.textContent = `${formatPrice(subtotal)} FCFA`;
    
    if (discountAmount > 0) {
        if (discountRow) discountRow.style.display = 'flex';
        if (discountEl) discountEl.textContent = `- ${formatPrice(discountAmount)} FCFA`;
    } else {
        if (discountRow) discountRow.style.display = 'none';
    }

    if (totalEl) totalEl.textContent = `${formatPrice(total)} FCFA`;
}

/**
 * Met à jour la barre de livraison
 */
function updateProgressBar(subtotal) {
    const progress = document.getElementById('shipping-progress');
    const message = document.getElementById('shipping-message');

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
 * Met à jour le bouton Commander
 */
function updateCheckoutBtn(total) {
    const btn = document.getElementById('cart-total-btn');
    if (btn) btn.textContent = `${formatPrice(total)} FCFA`;
}

// ==========================================
// CODE PROMO
// ==========================================

function applyPromo() {
    const code = document.getElementById('promo-code')?.value?.toUpperCase() || '';
    const message = document.getElementById('promo-message');

    if (code === 'BIENVENUE10') {
        discount = 10;
        if (message) message.innerHTML = '✅ Réduction de 10% appliquée';
    } else if (code === 'FETE20') {
        discount = 20;
        if (message) message.innerHTML = '✅ Réduction de 20% appliquée';
    } else {
        discount = 0;
        if (message) message.innerHTML = '❌ Code invalide';
    }

    renderCart();
}

// ==========================================
// COMMANDE WHATSAPP
// ==========================================

function orderWhatsApp() {
    const customerName = document.getElementById('customer-name')?.value?.trim() || '';
    const customerPhone = document.getElementById('customer-phone')?.value?.trim() || '';
    const customerAddress = document.getElementById('customer-address')?.value?.trim() || '';

    if (!customerName || !customerPhone || !customerAddress) {
        showToast('⚠️ Remplissez toutes vos informations');
        return;
    }

    const cartData = getCart();
    if (cartData.length === 0) {
        showToast('🛒 Panier vide');
        return;
    }

    let total = 0;
    let message = '🛍️ Nouvelle commande WebProfit AI%0A%0A';
    message += '👤 Client : ' + customerName + '%0A';
    message += '📞 Téléphone : ' + customerPhone + '%0A';
    message += '📍 Adresse : ' + customerAddress + '%0A%0A';

    cartData.forEach(item => {
        const qty = item.quantity || 1;
        const price = item.price || 0;
        message += `📦 ${item.name} x${qty} - ${formatPrice(price * qty)} FCFA%0A`;
        total += price * qty;
    });

    const finalTotal = total - (total * discount / 100);
    message += '%0A💰 Total : ' + formatPrice(finalTotal) + ' FCFA';

    // Sauvegarder la commande
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
        id: Date.now(),
        date: new Date().toLocaleString(),
        customerName,
        customerPhone,
        customerAddress,
        items: cartData,
        total: finalTotal,
        discount: discount
    });
    localStorage.setItem('orders', JSON.stringify(orders));

    window.open('https://wa.me/2250719949973?text=' + message, '_blank');
    showToast('✅ Commande enregistrée !');
}

// ==========================================
// PRODUITS ENREGISTRÉS, RÉCENTS ET SUGGESTIONS
// ==========================================

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

function renderSavedProducts() {
    const container = document.getElementById('saved-products-grid');
    if (!container) return;

    container.innerHTML = savedProducts.map(p => `
        <div class="saved-product-card" onclick="addToCart('${p.id}')" style="background:white;border-radius:12px;padding:10px;box-shadow:0 2px 6px rgba(0,0,0,0.05);cursor:pointer;">
            <img src="${p.image}" alt="${p.name}" style="width:100%;height:110px;object-fit:cover;border-radius:8px;background:#f0f0f0;" onerror="this.src='https://via.placeholder.com/200'">
            <div style="font-weight:600;font-size:0.75rem;margin-top:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;height:2.2rem;">${p.name}</div>
            <div style="display:flex;align-items:baseline;gap:6px;flex-wrap:wrap;margin-top:4px;">
                <span style="font-weight:700;color:#f97316;font-size:0.85rem;">${formatPrice(p.price)} FCFA</span>
                ${p.oldPrice ? `<span style="font-size:0.65rem;color:#aaa;text-decoration:line-through;">${formatPrice(p.oldPrice)} FCFA</span>` : ''}
            </div>
            <button class="buy-btn" style="width:100%;padding:6px;background:#f97316;color:white;border:none;border-radius:8px;font-weight:600;font-size:0.7rem;margin-top:8px;cursor:pointer;">Acheter</button>
        </div>
    `).join('');
}

function renderRecentProducts() {
    const container = document.getElementById('recent-products-grid');
    if (!container) return;

    container.innerHTML = recentProducts.map(p => `
        <div class="recent-product-card" onclick="showProduct(${p.id})" style="background:white;border-radius:12px;padding:10px;box-shadow:0 2px 6px rgba(0,0,0,0.05);cursor:pointer;">
            <img src="${p.image}" alt="${p.name}" style="width:100%;height:110px;object-fit:cover;border-radius:8px;background:#f0f0f0;" onerror="this.src='https://via.placeholder.com/200'">
            <div style="font-weight:600;font-size:0.75rem;margin-top:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;height:2.2rem;">${p.name}</div>
            <div style="display:flex;align-items:baseline;gap:6px;flex-wrap:wrap;margin-top:4px;">
                <span style="font-weight:700;color:#f97316;font-size:0.85rem;">${formatPrice(p.price)} FCFA</span>
                ${p.oldPrice ? `<span style="font-size:0.65rem;color:#aaa;text-decoration:line-through;">${formatPrice(p.oldPrice)} FCFA</span>` : ''}
            </div>
        </div>
    `).join('');
}

function renderSuggestions() {
    const container = document.getElementById('suggestions-grid');
    if (!container) return;

    container.innerHTML = suggestions.map(p => `
        <div class="suggestion-card" onclick="showProduct(${p.id})" style="background:white;border-radius:12px;padding:10px;box-shadow:0 2px 6px rgba(0,0,0,0.05);cursor:pointer;">
            <img src="${p.image}" alt="${p.name}" style="width:100%;height:110px;object-fit:cover;border-radius:8px;background:#f0f0f0;" onerror="this.src='https://via.placeholder.com/200'">
            <div style="font-weight:600;font-size:0.75rem;margin-top:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;height:2.2rem;">${p.name}</div>
            <div style="display:flex;align-items:baseline;gap:6px;flex-wrap:wrap;margin-top:4px;">
                <span style="font-weight:700;color:#f97316;font-size:0.85rem;">${formatPrice(p.price)} FCFA</span>
                ${p.oldPrice ? `<span style="font-size:0.65rem;color:#aaa;text-decoration:line-through;">${formatPrice(p.oldPrice)} FCFA</span>` : ''}
            </div>
        </div>
    `).join('');
}

// ==========================================
// UTILITAIRES
// ==========================================

function formatPrice(price) {
    return Math.round(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function showToast(message) {
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

    toast.textContent = message;
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

// ==========================================
// NAVIGATION
// ==========================================

function showSection(section) {
    // Cacher toutes les sections
    document.querySelectorAll('.page-section, #cart-section, #checkout-section, #account-section, .cart-container, .ai-box, .account-box')
        .forEach(el => {
            if (el) el.style.display = 'none';
        });
    
    // Afficher la section demandée
    if (section === 'home') {
        document.querySelector('.flash-banner')?.style.setProperty('display', 'block');
        document.querySelector('.categories-section')?.style.setProperty('display', 'block');
        document.querySelector('.featured-section')?.style.setProperty('display', 'block');
        document.querySelector('.ai-section')?.style.setProperty('display', 'block');
        document.querySelector('.products')?.style.setProperty('display', 'block');
    } else if (section === 'cart') {
        document.querySelector('#cart-section')?.style.setProperty('display', 'block');
        renderCart();
    } else if (section === 'account') {
        document.querySelector('#account-section')?.style.setProperty('display', 'block');
        if (typeof updateAccountUI === 'function') updateAccountUI();
    } else if (section === 'favorites') {
        showToast('❤️ Tes favoris arrivent bientôt !');
        return;
    }
    
    // Mettre à jour la navigation active
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navMap = { 'home': 0, 'categories': 1, 'cart': 2, 'favorites': 3, 'account': 4 };
    const idx = navMap[section] || 0;
    document.querySelectorAll('.nav-item')[idx]?.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// INITIALISATION
// ==========================================

function initCart() {
    cart = getCart();
    renderCart();
    renderSavedProducts();
    renderRecentProducts();
    renderSuggestions();
    updateCartBadge();
    console.log('🛒 Panier initialisé');
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initCart, 300);
});

// Mise à jour automatique du badge
setInterval(function() {
    const cartData = getCart();
    const count = cartData.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.querySelectorAll('.cart-badge, #cart-badge, #header-cart-badge, .nav-badge').forEach(el => {
        if (el) {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        }
    });
}, 1000);

// Alias pour compatibilité
const updateCart = renderCart;
const addToCartFromSaved = addToCart;

console.log('🛒 Cart.js chargé avec succès !');