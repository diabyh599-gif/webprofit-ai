// ==========================================
// APP.JS - VERSION CORRIGÉE
// ==========================================

// ===== FAVORIS =====
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayProducts();
    updateFavoritesCount();
}

function updateFavoritesCount() {
    const element = document.getElementById("favorite-count");
    if (element) {
        element.textContent = favorites.length;
    }
}

// ===== AFFICHAGE DES PRODUITS =====
function displayProducts(list = products) {
    const container = document.getElementById("product-grid");
    if (!container) return;

    // Trier par popularité
    list = [...list].sort((a, b) => (b.sales || 0) - (a.sales || 0));

    let html = "";
    list.forEach(product => {
        const favorite = favorites.includes(product.id);
        const imageUrl = product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/200';
        
        // Badges
        let badges = '';
        if (product.sales >= 3) badges += '<span class="badge-top">🏆 Top Vente</span> ';
        if (product.isNew) badges += '<span class="badge-new">🆕 Nouveau</span> ';
        if (product.isBestSeller) badges += '<span class="badge-best">🔥 Best Seller</span> ';
        
        // Réduction
        let discount = '';
        if (product.oldPrice && product.oldPrice > product.price) {
            const percent = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
            discount = `<span class="discount-badge">-${percent}%</span>`;
        }

        html += `
            <div class="product-card">
                <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:4px;">
                    ${badges}
                    ${discount}
                </div>
                <img src="${imageUrl}" alt="${product.name}" 
                     onclick="showProduct(${product.id})" 
                     onerror="this.src='https://via.placeholder.com/200'"
                     style="width:100%;height:180px;object-fit:cover;border-radius:10px;cursor:pointer;background:#f0f0f0;">
                <h3 style="margin:8px 0 4px;font-size:0.95rem;">${product.name}</h3>
                <p style="color:#888;font-size:0.8rem;margin:2px 0;">${product.category}</p>
                <p class="rating" style="font-size:0.8rem;color:#f59e0b;margin:2px 0;">
                    ⭐⭐⭐⭐⭐ (${product.reviews || 0} avis)
                </p>
                <p style="font-size:0.75rem;color:#22c55e;margin:2px 0;">📦 Stock : ${product.stock}</p>
                <p style="font-size:0.75rem;color:#555;margin:2px 0;">${product.delivery || '🚚 Livraison 2-3 jours'}</p>
                <p style="font-size:0.75rem;color:#f97316;margin:2px 0;">🔥 Popularité : ${product.sales || 0}</p>
                <div class="price-box" style="margin:6px 0;">
                    <span class="current-price" style="font-weight:700;color:#f97316;font-size:1.1rem;">
                        ${product.price.toLocaleString()} FCFA
                    </span>
                    ${product.oldPrice ? `<span class="old-price" style="font-size:0.8rem;color:#aaa;text-decoration:line-through;margin-left:8px;">${product.oldPrice.toLocaleString()} FCFA</span>` : ''}
                </div>
                <button onclick="toggleFavorite(${product.id})" style="width:100%;padding:8px;margin-bottom:4px;background:#f97316;color:white;border:none;border-radius:8px;font-weight:700;cursor:pointer;">
                    ${favorite ? "❤️ Favori" : "🤍 Favori"}
                </button>
                <button onclick="addToCart(${product.id})" style="width:100%;padding:8px;margin-bottom:4px;background:#f97316;color:white;border:none;border-radius:8px;font-weight:700;cursor:pointer;">
                    🛒 Ajouter au panier
                </button>
                <button onclick="buyNow(${product.id})" style="width:100%;padding:8px;background:#22c55e;color:white;border:none;border-radius:8px;font-weight:700;cursor:pointer;">
                    ⚡ Acheter maintenant
                </button>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ===== RECHERCHE =====
function searchProducts() {
    const search = document.getElementById("search-input");
    if (!search) return;
    
    const query = search.value.toLowerCase().trim();
    if (!query) {
        displayProducts(products);
        return;
    }
    
    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
    displayProducts(filtered);
}

// ===== FILTRES =====
function filterProducts(category) {
    if (category === "all") {
        displayProducts(products);
        return;
    }
    const filtered = products.filter(product => product.category === category);
    displayProducts(filtered);
}

// ===== STATISTIQUES =====
function updateStats() {
    const totalSales = products.reduce((sum, p) => sum + (p.sales || 0), 0);
    const stats = document.getElementById("sales-count");
    if (stats) stats.textContent = totalSales;
}

// ===== MODALE PRODUIT =====
/**
 * Affiche la page produit améliorée (version Pro)
 */
function showProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) {
        showToast('❌ Produit introuvable');
        return;
    }

    const modal = document.getElementById("product-modal");
    const body = document.getElementById("modal-body");
    if (!modal || !body) return;

    // Images par défaut
    const images = product.images && product.images.length > 0 ? product.images : ['https://via.placeholder.com/400'];
    
    // Calcul de la réduction
    let discountPercent = 0;
    if (product.oldPrice && product.oldPrice > product.price) {
        discountPercent = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
    }

    // Barre de stock
    const stockPercent = Math.min((product.stock / 10) * 100, 100);
    const stockColor = product.stock > 5 ? '#22c55e' : product.stock > 2 ? '#f59e0b' : '#ef4444';
    const stockLabel = product.stock > 5 ? '✅ En stock' : product.stock > 2 ? '⚠️ Plus que ' + product.stock : '⚠️ Rupture imminente';

    // Galerie images avec miniatures
    let galleryThumbs = images.map((img, i) => `
        <img src="${img}" onclick="changeProductImage(${i})" 
             class="gallery-thumb" 
             style="width:60px;height:60px;object-fit:cover;border-radius:8px;cursor:pointer;border:2px solid ${i === 0 ? '#f97316' : 'transparent'};"
             onerror="this.src='https://via.placeholder.com/60'">
    `).join('');

    // Avis
    let reviewsHtml = '';
    if (product.comments && product.comments.length > 0) {
        reviewsHtml = product.comments.map(c => `
            <div style="background:#f8fafc;padding:12px;border-radius:10px;margin-bottom:8px;border-left:4px solid #f97316;">
                <span style="font-size:0.85rem;">${c}</span>
            </div>
        `).join('');
    } else {
        reviewsHtml = `<p style="color:#888;font-size:0.9rem;">Soyez le premier à donner votre avis !</p>`;
    }

    body.innerHTML = `
    <div style="position:relative;">
        <!-- En-tête avec badge de réduction -->
        ${discountPercent > 0 ? `
            <div style="position:absolute;top:0;right:0;background:#ef4444;color:white;padding:8px 16px;border-radius:0 0 0 16px;font-weight:700;font-size:1.1rem;z-index:5;">
                -${discountPercent}%
            </div>
        ` : ''}
        
        <!-- Galerie principale -->
        <div style="border-radius:16px;overflow:hidden;background:#f5f5f5;margin-bottom:12px;">
            <img id="main-product-image" src="${images[0]}" 
                 style="width:100%;height:280px;object-fit:contain;background:#f5f5f5;transition:0.3s;"
                 onerror="this.src='https://via.placeholder.com/400'">
        </div>
        
        <!-- Miniatures -->
        <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:8px;margin-bottom:16px;">
            ${galleryThumbs}
        </div>

        <!-- Nom et marque -->
        <div style="margin-bottom:12px;">
            <h2 style="font-size:1.3rem;font-weight:700;margin:0 0 4px 0;">${product.name}</h2>
            <p style="color:#888;font-size:0.85rem;margin:0;">
                📦 Catégorie : ${product.category || 'Générique'} 
                <span style="margin-left:12px;">⭐ ${product.rating || 4.5} (${product.reviews || 0} avis)</span>
            </p>
        </div>

        <!-- PRIX -->
        <div style="background:linear-gradient(135deg,#fff7ed,#ffedd5);border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;">
                <span style="font-size:1.8rem;font-weight:800;color:#f97316;">
                    ${product.price.toLocaleString()} FCFA
                </span>
                ${product.oldPrice ? `
                    <span style="font-size:1rem;color:#aaa;text-decoration:line-through;">
                        ${product.oldPrice.toLocaleString()} FCFA
                    </span>
                ` : ''}
                ${discountPercent > 0 ? `
                    <span style="background:#ef4444;color:white;padding:4px 12px;border-radius:20px;font-weight:700;font-size:0.8rem;">
                        Économisez ${Math.round((product.oldPrice - product.price)).toLocaleString()} FCFA
                    </span>
                ` : ''}
            </div>
            <p style="margin:4px 0 0 0;font-size:0.85rem;color:#888;">
                ${product.delivery || '🚚 Livraison 2 à 3 jours'}
            </p>
        </div>

        <!-- Stock avec barre -->
        <div style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:4px;">
                <span style="font-weight:600;color:${stockColor};">${stockLabel}</span>
                <span style="color:#888;">${product.stock} restant${product.stock > 1 ? 's' : ''}</span>
            </div>
            <div style="width:100%;height:6px;background:#f0f0f0;border-radius:10px;overflow:hidden;">
                <div style="width:${stockPercent}%;height:100%;background:${stockColor};border-radius:10px;transition:width 0.5s;"></div>
            </div>
        </div>

        <!-- Boutons d'achat -->
        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px;">
            <button onclick="addToCart(${product.id})" 
                    style="width:100%;padding:16px;background:#f97316;color:white;border:none;border-radius:12px;font-weight:700;font-size:1.1rem;cursor:pointer;transition:0.2s;display:flex;justify-content:center;align-items:center;gap:8px;">
                🛒 Ajouter au panier
            </button>
            <button onclick="buyNow(${product.id})" 
                    style="width:100%;padding:16px;background:#22c55e;color:white;border:none;border-radius:12px;font-weight:700;font-size:1.1rem;cursor:pointer;transition:0.2s;display:flex;justify-content:center;align-items:center;gap:8px;">
                ⚡ Acheter maintenant
            </button>
        </div>

        <!-- Infos livraison -->
        <div style="background:#f8fafc;border-radius:12px;padding:14px 16px;margin-bottom:16px;">
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
                <span style="display:flex;align-items:center;gap:6px;font-size:0.85rem;color:#555;">
                    📍 Livraison à domicile
                </span>
                <span style="display:flex;align-items:center;gap:6px;font-size:0.85rem;color:#555;">
                    📦 Retour 10 jours
                </span>
                <span style="display:flex;align-items:center;gap:6px;font-size:0.85rem;color:#555;">
                    🔒 Paiement sécurisé
                </span>
            </div>
        </div>

        <!-- Détails du produit -->
        <div style="margin-bottom:16px;">
            <h3 style="font-size:1rem;margin-bottom:8px;">📋 Détails du produit</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <div style="background:#f8fafc;padding:10px 12px;border-radius:10px;">
                    <div style="font-size:0.75rem;color:#888;">Catégorie</div>
                    <div style="font-weight:600;font-size:0.95rem;">${product.category}</div>
                </div>
                <div style="background:#f8fafc;padding:10px 12px;border-radius:10px;">
                    <div style="font-size:0.75rem;color:#888;">Stock</div>
                    <div style="font-weight:600;font-size:0.95rem;">${product.stock} unités</div>
                </div>
                <div style="background:#f8fafc;padding:10px 12px;border-radius:10px;">
                    <div style="font-size:0.75rem;color:#888;">Note</div>
                    <div style="font-weight:600;font-size:0.95rem;">⭐ ${product.rating || 4.5}/5</div>
                </div>
                <div style="background:#f8fafc;padding:10px 12px;border-radius:10px;">
                    <div style="font-size:0.75rem;color:#888;">Ventes</div>
                    <div style="font-weight:600;font-size:0.95rem;">${product.sales || 0}</div>
                </div>
            </div>
        </div>

        <!-- Avis -->
        <div style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <h3 style="font-size:1rem;margin:0;">⭐ Avis clients</h3>
                <span style="font-size:0.85rem;color:#f97316;font-weight:600;">${product.reviews || 0} avis</span>
            </div>
            <div style="max-height:200px;overflow-y:auto;padding-right:4px;">
                ${reviewsHtml}
            </div>
        </div>

        <!-- Supprimer (admin) -->
        <button onclick="deleteProduct(${product.id})" 
                style="width:100%;padding:12px;background:#ef4444;color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;margin:4px 0;">
            🗑️ Supprimer le produit
        </button>

        <!-- Bouton signaler -->
        <button onclick="reportProduct(${product.id})" 
                style="background:none;border:none;color:#888;font-size:0.8rem;cursor:pointer;padding:8px;text-decoration:underline;width:100%;">
            🚨 Signaler un problème
        </button>
    </div>
    `;

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

/**
 * Change l'image principale au clic sur une miniature
 */
function changeProductImage(index) {
    const mainImg = document.getElementById('main-product-image');
    if (!mainImg) return;
    
    const thumbs = document.querySelectorAll('.gallery-thumb');
    if (!thumbs || thumbs.length === 0) return;
    
    const newSrc = thumbs[index]?.src;
    if (newSrc) {
        mainImg.src = newSrc;
        mainImg.style.opacity = '0.5';
        setTimeout(() => { mainImg.style.opacity = '1'; }, 150);
    }
    
    thumbs.forEach((thumb, i) => {
        thumb.style.border = i === index ? '2px solid #f97316' : '2px solid transparent';
    });
}

/**
 * Signaler un produit
 */
function reportProduct(id) {
    const reason = prompt('🚨 Signaler un problème avec ce produit :\n\n1 - Produit contrefait\n2 - Prix incorrect\n3 - Image trompeuse\n4 - Description erronée\n5 - Autre');
    if (reason) {
        showToast('✅ Signalement envoyé ! Nous allons vérifier.');
        const reports = JSON.parse(localStorage.getItem('reports') || '[]');
        reports.push({ productId: id, reason, date: new Date().toISOString() });
        localStorage.setItem('reports', JSON.stringify(reports));
    }
}

/**
 * Ferme la modale
 */
function closeModal() {
    const modal = document.getElementById("product-modal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function closeModal() {
    const modal = document.getElementById("product-modal");
    if (modal) modal.style.display = "none";
}

// ===== SIMULATION VISITEURS =====
function simulateVisitors() {
    const visitors = document.getElementById("visitor-count");
    if (!visitors) return;
    setInterval(() => {
        let current = parseInt(visitors.textContent) || 127;
        current += Math.floor(Math.random() * 3);
        visitors.textContent = current;
    }, 10000);
}
simulateVisitors();

// ===== COUNTDOWN =====
function startCountdown() {
    let totalSeconds = 24 * 60 * 60;
    const countdown = document.getElementById("countdown");
    if (!countdown) return;

    setInterval(() => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        countdown.textContent = `${hours}h ${minutes}m ${seconds}s`;
        if (totalSeconds > 0) {
            totalSeconds--;
        } else {
            totalSeconds = 24 * 60 * 60;
        }
    }, 1000);
}
startCountdown();

// ===== ADMIN =====
function addProduct() {
    const name = document.getElementById("admin-name")?.value;
    const price = Number(document.getElementById("admin-price")?.value);
    const category = document.getElementById("admin-category")?.value;
    const image = document.getElementById("admin-image")?.value?.trim();

    if (!name || !price || !category) {
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
        images: [image || 'https://via.placeholder.com/200']
    };

    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
    updateAdminStats();
    showToast('✅ Produit ajouté');
}

function deleteProduct(id) {
    if (!confirm("Voulez-vous supprimer ce produit ?")) return;
    
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();
        updateAdminStats();
        closeModal();
        showToast('🗑️ Produit supprimé');
    }
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newPrice = prompt("Nouveau prix", product.price);
    if (newPrice === null) return;
    
    product.price = Number(newPrice);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
    showProduct(id);
    showToast('✅ Prix modifié');
}

function openAdmin() {
    const password = prompt("Mot de passe Admin");
    if (password === "45886736") {
        document.getElementById("admin-panel").style.display = "block";
        updateAdminStats();
        displayOrders();
    } else if (password !== null) {
        alert("Accès refusé");
    }
}

function updateAdminStats() {
    const productsCount = products.length;
    const salesCount = products.reduce((sum, p) => sum + (p.sales || 0), 0);
    const revenue = products.reduce((sum, p) => sum + ((p.sales || 0) * p.price), 0);
    const outStock = products.filter(p => p.stock <= 0).length;

    document.getElementById("admin-products-count").textContent = productsCount;
    document.getElementById("admin-sales-count").textContent = salesCount;
    document.getElementById("admin-revenue").textContent = revenue.toLocaleString();
    document.getElementById("admin-out-stock").textContent = outStock;
}

function displayOrders() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const container = document.getElementById("admin-orders");
    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = "Aucune commande";
        return;
    }

    let html = "";
    orders.forEach(order => {
        html += `
            <div style="background:#f8fafc;padding:12px;border-radius:10px;margin-bottom:8px;border-left:4px solid #f97316;">
                <p>🆔 ${order.id}</p>
                <p>📅 ${order.date}</p>
                <p>💰 ${order.total?.toLocaleString() || 0} FCFA</p>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ===== ACHAT RAPIDE =====
function buyNow(id) {
    addToCart(id);
    // Scroller vers le panier
    const cartBox = document.querySelector(".cart-box");
    if (cartBox) {
        cartBox.scrollIntoView({ behavior: "smooth" });
    }
}

// ===== AUTHENTIFICATION =====
function registerUser() {
    const email = document.getElementById("login-email")?.value;
    const password = document.getElementById("login-password")?.value;

    if (!email || !password) {
        alert("Remplissez tous les champs");
        return;
    }

    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);
    localStorage.setItem("user", JSON.stringify({ email, password }));
    alert("✅ Compte créé avec succès");
    updateAccountUI();
}

function loginUser() {
    const email = document.getElementById("login-email")?.value;
    const password = document.getElementById("login-password")?.value;
    const savedEmail = localStorage.getItem("userEmail");
    const savedPassword = localStorage.getItem("userPassword");

    if (email === savedEmail && password === savedPassword) {
        localStorage.setItem("currentUser", email);
        localStorage.setItem("user", JSON.stringify({ email, password }));
        const status = document.getElementById("login-status");
        if (status) status.textContent = "✅ Connecté : " + email;
        alert("✅ Connexion réussie");
        updateAccountUI();
    } else {
        alert("❌ Email ou mot de passe incorrect");
    }
}

function logoutUser() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user");
    const status = document.getElementById("login-status");
    if (status) status.textContent = "❌ Non connecté";
    resetAccountUI();
    showToast('🚪 Déconnexion réussie');
}

// ==========================================
// NOUVELLES FONCTIONS POUR LE COMPTE
// ==========================================

function updateAccountUI() {
    const name = document.getElementById('account-name');
    const email = document.getElementById('account-email');
    const credit = document.getElementById('account-credit');
    const status = document.getElementById('login-status');
    const authForm = document.getElementById('auth-form');
    const profileEmoji = document.getElementById('profile-emoji');
    const authLabel = document.getElementById('auth-label');

    const stored = localStorage.getItem('user');
    
    if (stored) {
        try {
            const user = JSON.parse(stored);
            const displayName = user.email?.split('@')[0] || 'Utilisateur';
            
            if (name) name.textContent = displayName;
            if (email) email.textContent = user.email || 'Connecté';
            if (credit) credit.textContent = '10 000 FCFA';
            if (profileEmoji) profileEmoji.textContent = '😎';
            if (status) status.textContent = '✅ Connecté avec succès';
            if (authForm) authForm.style.display = 'none';
            if (authLabel) authLabel.textContent = 'Se déconnecter';
            
            localStorage.setItem('userName', displayName);
        } catch (e) {
            console.warn('Erreur de lecture du profil:', e);
            resetAccountUI();
        }
    } else {
        resetAccountUI();
    }
}

function resetAccountUI() {
    const name = document.getElementById('account-name');
    const email = document.getElementById('account-email');
    const credit = document.getElementById('account-credit');
    const profileEmoji = document.getElementById('profile-emoji');
    const status = document.getElementById('login-status');
    const authForm = document.getElementById('auth-form');
    const authLabel = document.getElementById('auth-label');

    if (name) name.textContent = 'Invité';
    if (email) email.textContent = 'Non connecté';
    if (credit) credit.textContent = '0 FCFA';
    if (profileEmoji) profileEmoji.textContent = '👤';
    if (status) status.textContent = '❌ Non connecté';
    if (authForm) authForm.style.display = 'block';
    if (authLabel) authLabel.textContent = 'Se connecter';
}

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
    showToast(messages[section] || `📍 Page "${section}" - Fonctionnalité à venir !`);
}

function openChat() {
    const user = localStorage.getItem('user');
    if (!user) {
        showToast('💬 Connectez-vous pour accéder au chat !');
        return;
    }
    showToast('💬 Chat en direct - Un conseiller va vous répondre !');
}

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
    const phone = '2250719949973';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
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
// INITIALISATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    updateStats();
    updateFavoritesCount();
    updateAdminStats();
    displayOrders();
    updateAccountUI();
    console.log('✅ app.js chargé avec succès');
});

console.log('📱 app.js chargé');