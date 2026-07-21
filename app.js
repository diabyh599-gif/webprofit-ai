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
function showProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) {
        showToast('❌ Produit introuvable');
        return;
    }

    const modal = document.getElementById("product-modal");
    const body = document.getElementById("modal-body");
    if (!modal || !body) return;

    // Galerie
    let gallery = "";
    if (product.images && product.images.length > 0) {
        product.images.forEach(img => {
            gallery += `<img src="${img}" class="gallery-image" onerror="this.src='https://via.placeholder.com/200'" style="width:120px;height:120px;object-fit:cover;border-radius:10px;flex-shrink:0;">`;
        });
    }

    // Commentaires
    let comments = "";
    if (product.comments && product.comments.length > 0) {
        product.comments.forEach(comment => {
            comments += `<p class="review" style="background:#f8fafc;padding:10px;border-radius:10px;margin-bottom:8px;border-left:4px solid #f97316;">${comment}</p>`;
        });
    }

    body.innerHTML = `
        <div class="gallery" style="display:flex;gap:10px;overflow-x:auto;margin-bottom:15px;padding-bottom:5px;">
            ${gallery}
        </div>
        <h2 style="margin-bottom:6px;">${product.name}</h2>
        <p style="margin:4px 0;">⭐ ${product.rating || 5} (${product.reviews || 0} avis)</p>
        <p style="margin:4px 0;">📦 Stock : ${product.stock}</p>
        <div class="delivery" style="background:#dcfce7;color:#166534;padding:4px 12px;border-radius:20px;display:inline-block;font-weight:bold;margin:4px 0;">
            ${product.delivery || '🚚 Livraison 2-3 jours'}
        </div>
        <p style="margin:4px 0;color:#888;">${product.category}</p>
        <h3 style="color:#f97316;font-size:1.4rem;margin:8px 0;">
            ${product.price.toLocaleString()} FCFA
        </h3>
        ${product.oldPrice ? `<p style="text-decoration:line-through;color:#aaa;margin:4px 0;">${product.oldPrice.toLocaleString()} FCFA</p>` : ''}
        <button onclick="addToCart(${product.id})" style="width:100%;padding:12px;background:#f97316;color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;margin:4px 0;">
            🛒 Ajouter au panier
        </button>
        <button onclick="deleteProduct(${product.id})" style="width:100%;padding:12px;background:#ef4444;color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;margin:4px 0;">
            🗑️ Supprimer
        </button>
        ${comments}
    `;

    modal.style.display = "flex";
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