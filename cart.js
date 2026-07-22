// ==========================================
// CART.JS - VERSION UNIFIÉE ET STABLE
// ==========================================

// ===== VARIABLES GLOBALES =====
let discount = 0;
let cart = [];

// ===== FONCTIONS DE BASE =====

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
}

/**
 * Met à jour le badge du panier dans la navigation
 */
function updateCartBadge() {
    const cartData = getCart();
    const count = cartData.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
    
    const headerBadge = document.getElementById('header-cart-badge');
    if (headerBadge) {
        headerBadge.textContent = count;
        headerBadge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// ===== FONCTIONS PRINCIPALES =====

/**
 * Ajoute un produit au panier
 */
function addToCart(productId) {
    // Chercher le produit dans la liste globale
    let product = null;
    
    // Si les produits sont dans une variable globale 'products'
    if (typeof products !== 'undefined') {
        product = products.find(p => p.id === productId);
    }
    
    // Si pas trouvé, chercher dans savedProducts
    if (!product && typeof savedProducts !== 'undefined') {
        product = savedProducts.find(p => p.id === productId);
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
    const existing = cartData.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
        showToast(`✅ ${product.name} : quantité ${existing.quantity}`);
    } else {
        cartData.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.images ? product.images[0] : (product.image || 'https://via.placeholder.com/200'),
            quantity: 1,
            oldPrice: product.oldPrice || null,
            discount: product.discount || null
        });
        showToast(`✅ ${product.name} ajouté au panier !`);
    }
    
    // Mettre à jour le stock si disponible
    if (product.stock !== undefined) {
        product.stock--;
        if (typeof saveProducts === 'function') saveProducts();
    }
    
    saveCart(cartData);
    renderCart();
    updateCartBadge();
    if (typeof updateStats === 'function') updateStats();
}

/**
 * Supprime un produit du panier
 */
function removeFromCart(index) {
    const cartData = getCart();
    if (!cartData || !cartData[index]) return;
    
    const item = cartData[index];
    const name = item.name;
    
    // Restaurer le stock si possible
    if (typeof products !== 'undefined') {
        const product = products.find(p => p.id === item.id);
        if (product && product.stock !== undefined) {
            product.stock += (item.quantity || 1);
        }
    }
    
    cartData.splice(index, 1);
    saveCart(cartData);
    renderCart();
    updateCartBadge();
    showToast(`🗑️ "${name}" supprimé`);
}

/**
 * Met à jour la quantité d'un produit
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
    renderCart();
    updateCartBadge();
}

/**
 * Vide tout le panier
 */
function clearCart() {
    if (confirm('🛒 Vider tout le panier ?')) {
        saveCart([]);
        renderCart();
        updateCartBadge();
        showToast('🗑️ Panier vidé');
    }
}

// ===== AFFICHAGE =====

/**
 * Affiche le panier
 */
function renderCart() {
    const cartData = getCart();
    const container = document.getElementById('cart-items');
    const countDisplay = document.getElementById('cart-count');
    const totalDisplay = document.getElementById('cart-total');
    const countHeader = document.getElementById('cart-items-count-header');
    const countSection = document.getElementById('cart-items-count');
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const discountRow = document.getElementById('discount-row');
    const totalEl = document.getElementById('cart-total');
    const totalBtnEl = document.getElementById('cart-total-btn');
    const shippingMessage = document.getElementById('shipping-message');

    if (!container) return;

    // Panier vide
    if (!cartData || cartData.length === 0) {
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
        return;
    }

    // Calcul des totaux
    let subtotal = 0;
    let discountTotal = 0;
    let html = '';
    const FREE_SHIPPING_THRESHOLD = 7500;

    cartData.forEach((item, index) => {
        const price = item.price || 0;
        const qty = item.quantity || 1;
        const total = price * qty;
        subtotal += total;

        html += `
            <div class="cart-item" data-index="${index}">
                <img src="${item.image || 'https://via.placeholder.com/70'}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/70'" />
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-meta">
                        <span class="cart-item-price">${formatPrice(total)} FCFA</span>
                        ${item.oldPrice ? `<span class="cart-item-old-price">${formatPrice(item.oldPrice)} FCFA</span>` : ''}
                        ${item.discount ? `<span class="cart-item-discount">${item.discount}</span>` : ''}
                    </div>
                    <div class="cart-item-meta">
                        <span class="cart-item-stock">✅ Disponible</span>
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

    // Appliquer la réduction si code promo
    const finalTotal = subtotal - (subtotal * discount / 100);

    // Mise à jour des affichages
    updateCounts(cartData.length);
    updateTotals(subtotal, subtotal * discount / 100, finalTotal);
    updateProgressBar(subtotal);

    // Total dans le bouton
    if (totalBtnEl) totalBtnEl.textContent = `${formatPrice(finalTotal)} FCFA`;
}

/**
 * Met à jour les compteurs
 */
function updateCounts(count) {
    const countHeader = document.getElementById('cart-items-count-header');
    const countSection = document.getElementById('cart-items-count');
    const cartCount = document.getElementById('cart-count');

    const text = `${count} article${count > 1 ? 's' : ''}`;
    if (countHeader) countHeader.textContent = text;
    if (countSection) countSection.textContent = count;
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
    const cartTotal = document.getElementById('cart-total');

    if (subtotalEl) subtotalEl.textContent = `${formatPrice(subtotal)} FCFA`;
    
    if (discountAmount > 0) {
        if (discountRow) discountRow.style.display = 'flex';
        if (discountEl) discountEl.textContent = `- ${formatPrice(discountAmount)} FCFA`;
    } else {
        if (discountRow) discountRow.style.display = 'none';
    }

    if (totalEl) totalEl.textContent = `${formatPrice(total)} FCFA`;
    if (cartTotal) cartTotal.textContent = formatPrice(total);
}

/**
 * Met à jour la barre de livraison
 */
function updateProgressBar(subtotal) {
    const progress = document.getElementById('shipping-progress');
    const message = document.getElementById('shipping-message');
    const FREE_SHIPPING_THRESHOLD = 7500;

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

// ===== CODE PROMO =====

/**
 * Applique un code promo
 */
function applyPromo() {
    const code = document.getElementById('promo-code')?.value?.toUpperCase() || '';
    const message = document.getElementById('promo-message');
    const discountDisplay = document.getElementById('cart-discount');

    if (code === 'BIENVENUE10') {
        discount = 10;
        if (message) message.innerHTML = '✅ Réduction de 10% appliquée';
        if (discountDisplay) discountDisplay.textContent = '-10%';
    } else if (code === 'FETE20') {
        discount = 20;
        if (message) message.innerHTML = '✅ Réduction de 20% appliquée';
        if (discountDisplay) discountDisplay.textContent = '-20%';
    } else {
        discount = 0;
        if (message) message.innerHTML = '❌ Code invalide';
        if (discountDisplay) discountDisplay.textContent = '0%';
    }

    renderCart();
}

// ===== COMMANDE WHATSAPP =====

/**
 * Envoie la commande par WhatsApp
 */
function orderWhatsApp() {
    const customerName = document.getElementById('customer-name')?.value || '';
    const customerPhone = document.getElementById('customer-phone')?.value || '';
    const customerAddress = document.getElementById('customer-address')?.value || '';

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
        message += `📦 ${item.name} x${qty} - ${price * qty} FCFA%0A`;
        total += price * qty;
    });

    // Appliquer réduction
    const finalTotal = total - (total * discount / 100);
    message += '%0A💰 Total : ' + finalTotal + ' FCFA';

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

    window.open(
        'https://wa.me/2250719949973?text=' + message,
        '_blank'
    );

    // Simuler le suivi de commande
    const tracking = document.getElementById('tracking-status');
    if (tracking) {
        tracking.innerHTML = '🟡 Commande reçue';
        setTimeout(() => tracking.innerHTML = '🔵 Préparation', 3000);
        setTimeout(() => tracking.innerHTML = '🟣 Expédiée', 6000);
        setTimeout(() => tracking.innerHTML = '🟢 Livrée', 9000);
    }

    showToast('✅ Commande enregistrée !');
}

// ===== UTILITAIRES =====

/**
 * Formate un prix
 */
function formatPrice(price) {
    return Math.round(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Affiche une notification
 */
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

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2500);
}

// ===== NAVIGATION =====

/**
 * Navigation vers une section (à utiliser avec le HTML)
 */
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
    }
    
    // Mettre à jour la navigation active
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navMap = { 'home': 0, 'categories': 1, 'cart': 2, 'favorites': 3, 'account': 4 };
    const idx = navMap[section] || 0;
    document.querySelectorAll('.nav-item')[idx]?.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


/**
 * Affiche les produits enregistrés
 */
function renderSavedProducts() {
    const container = document.getElementById('saved-products-grid');
    if (!container) return;

    container.innerHTML = savedProducts.map(p => `
        <div class="saved-product-card" onclick="addToCart('${p.id}')">
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
 * Affiche les produits récents
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
 * Affiche les suggestions
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

// ===== INITIALISATION =====

/**
 * Initialisation du panier
 */
function initCart() {
    // Récupérer le panier depuis localStorage
    cart = getCart();
    
    // Afficher le panier
    renderCart();
    renderSavedProducts();
    renderRecentProducts();
    renderSuggestions();
    updateCartBadge();
}

// Initialiser au chargement
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

// ===== ALIAS POUR COMPATIBILITÉ =====
// Garder les anciens noms pour ne pas casser le code existant
const updateCart = renderCart;
const addToCartFromSaved = addToCart;

console.log('🛒 Cart.js chargé avec succès !');