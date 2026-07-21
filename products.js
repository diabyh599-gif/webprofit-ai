// ==========================================
// PRODUCTS.JS - VERSION CORRIGÉE
// ==========================================

// Récupérer les produits depuis localStorage ou utiliser les produits par défaut
const defaultProducts = [
    {
        id: 1,
        name: "Ensemble Élégant Premium",
        price: 7500,
        oldPrice: 9500,
        stock: 5,
        sales: 0,
        category: "Vêtements",
        event: "fête",
        rating: 4.8,
        reviews: 124,
        isNew: true,
        isBestSeller: true,
        comments: [
            "⭐⭐⭐⭐⭐ Très bonne qualité",
            "⭐⭐⭐⭐ Élégant et confortable",
            "⭐⭐⭐⭐⭐ Je recommande"
        ],
        delivery: "🚚 Livraison 2 à 3 jours",
        images: [
            "https://i.ibb.co/0ykTzmM2/IMG-4374.jpg",
            "https://picsum.photos/600/600?11",
            "https://picsum.photos/600/600?12"
        ]
    },
    {
        id: 2,
        name: "Nike Air Force One Blanche",
        price: 15000,
        oldPrice: 18000,
        stock: 3,
        sales: 0,
        category: "Chaussures",
        event: "sortie",
        rating: 4.9,
        reviews: 89,
        isNew: false,
        isBestSeller: true,
        comments: [
            "⭐⭐⭐⭐⭐ Très bonne qualité",
            "⭐⭐⭐⭐ Élégant et confortable",
            "⭐⭐⭐⭐⭐ Je recommande"
        ],
        delivery: "🚚 Livraison 2 à 3 jours",
        images: [
            "https://i.ibb.co/5WVcQyYX/IMG-4378.jpg",
            "https://picsum.photos/600/600?21",
            "https://picsum.photos/600/600?22"
        ]
    },
    {
        id: 3,
        name: "Samsung Galaxy Buds 3 Pro",
        price: 25000,
        oldPrice: 30000,
        stock: 4,
        sales: 0,
        category: "Électronique",
        event: "quotidien",
        rating: 4.7,
        reviews: 256,
        isNew: true,
        isBestSeller: false,
        comments: [
            "⭐⭐⭐⭐⭐ Très confortable",
            "⭐⭐⭐⭐ Livraison rapide",
            "⭐⭐⭐⭐⭐ Produit conforme"
        ],
        delivery: "🚚 Livraison 2 à 3 jours",
        images: [
            "https://i.ibb.co/M4gzDNK/IMG-4379.jpg",
            "https://picsum.photos/600/600?31",
            "https://picsum.photos/600/600?32"
        ]
    },
    {
        id: 4,
        name: "Montre POEDAGAR 885",
        price: 6500,
        oldPrice: 8500,
        stock: 6,
        sales: 0,
        category: "Accessoires",
        event: "fête",
        rating: 4.6,
        reviews: 178,
        isNew: false,
        isBestSeller: true,
        comments: [
            "⭐⭐⭐⭐⭐ Très confortable",
            "⭐⭐⭐⭐ Livraison rapide",
            "⭐⭐⭐⭐⭐ Produit conforme"
        ],
        delivery: "🚚 Livraison demain",
        images: [
            "https://i.ibb.co/8n9Bxb4C/IMG-4376.jpg",
            "https://picsum.photos/600/600?41",
            "https://picsum.photos/600/600?42"
        ]
    },
    {
        id: 5,
        name: "Sac pour Femme",
        price: 12000,
        oldPrice: 15000,
        stock: 4,
        sales: 0,
        category: "Accessoires",
        event: "sortie",
        rating: 4.8,
        reviews: 92,
        isNew: true,
        isBestSeller: false,
        comments: [
            "⭐⭐⭐⭐⭐ Très bonne qualité",
            "⭐⭐⭐⭐ Élégant et confortable",
            "⭐⭐⭐⭐⭐ Je recommande"
        ],
        delivery: "🚚 Livraison 2 à 3 jours",
        images: [
            "https://i.ibb.co/MydF07fD/IMG-4377.jpg",
            "https://picsum.photos/600/600?51",
            "https://picsum.photos/600/600?52"
        ]
    }
];

// Charger les produits depuis localStorage ou utiliser les produits par défaut
let products = [];

try {
    const saved = localStorage.getItem('products');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
            products = parsed;
            console.log('📦 Produits chargés depuis localStorage');
        } else {
            products = defaultProducts;
            localStorage.setItem('products', JSON.stringify(products));
            console.log('📦 Produits par défaut chargés');
        }
    } else {
        products = defaultProducts;
        localStorage.setItem('products', JSON.stringify(products));
        console.log('📦 Produits par défaut initialisés');
    }
} catch (e) {
    console.warn('⚠️ Erreur de chargement, utilisation des produits par défaut');
    products = defaultProducts;
    localStorage.setItem('products', JSON.stringify(products));
}

// ===== FONCTIONS =====

/**
 * Sauvegarde les produits dans localStorage
 */
function saveProducts() {
    try {
        localStorage.setItem('products', JSON.stringify(products));
        console.log('✅ Produits sauvegardés');
    } catch (e) {
        console.warn('⚠️ Erreur de sauvegarde:', e);
    }
}

/**
 * Récupère un produit par son ID
 */
function getProductById(id) {
    return products.find(p => p.id == id);
}

/**
 * Affiche les produits dans la grille
 */
function displayProducts(filteredProducts) {
    const grid = document.getElementById('product-grid');
    if (!grid) {
        console.warn('⚠️ #product-grid introuvable');
        return;
    }

    const list = filteredProducts || products;
    
    if (list.length === 0) {
        grid.innerHTML = `
            <div style="text-align:center;padding:40px;color:#888;grid-column:1/-1;">
                <span style="font-size:2rem;">🔍</span>
                <p>Aucun produit trouvé</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = list.map((product, index) => {
        // Déterminer le badge
        let badge = '';
        if (product.isNew && product.isBestSeller) {
            badge = '<span class="badge" style="background:#22c55e;">🆕 Nouveau</span><span class="badge" style="background:#f97316;margin-left:4px;">🔥 Best Seller</span>';
        } else if (product.isNew) {
            badge = '<span class="badge" style="background:#22c55e;">🆕 Nouveau</span>';
        } else if (product.isBestSeller) {
            badge = '<span class="badge" style="background:#f97316;">🔥 Best Seller</span>';
        }

        // Calcul du pourcentage de réduction
        let discountPercent = '';
        if (product.oldPrice && product.oldPrice > product.price) {
            const percent = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
            discountPercent = `<span class="badge" style="background:#ef4444;">-${percent}%</span>`;
        }

        const imageUrl = product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/200';

        return `
            <div class="product-card" onclick="showProductDetail(${product.id})">
                <div class="badge-wrap" style="position:relative;">
                    <div style="position:absolute;top:8px;left:8px;display:flex;flex-wrap:wrap;gap:4px;z-index:2;">
                        ${badge}
                        ${discountPercent}
                    </div>
                    <img src="${imageUrl}" alt="${product.name}" 
                         onerror="this.src='https://via.placeholder.com/200'" 
                         style="width:100%;height:180px;object-fit:cover;border-radius:12px 12px 0 0;background:#f0f0f0;" />
                </div>
                <div class="product-info" style="padding:12px;">
                    <div class="product-name" style="font-weight:600;font-size:0.95rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;height:2.6rem;">
                        ${product.name}
                    </div>
                    <div class="product-category" style="font-size:0.75rem;color:#888;margin:4px 0 6px;">
                        ${product.category}
                    </div>
                    <div class="price-row" style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">
                        <span class="current-price" style="font-weight:700;color:#f97316;font-size:1.1rem;">
                            ${product.price.toLocaleString()} FCFA
                        </span>
                        ${product.oldPrice ? `<span class="old-price" style="font-size:0.8rem;color:#aaa;text-decoration:line-through;">${product.oldPrice.toLocaleString()} FCFA</span>` : ''}
                    </div>
                    ${product.stock !== undefined ? `<div style="font-size:0.7rem;color:#22c55e;font-weight:600;margin-top:4px;">📦 Stock : ${product.stock}</div>` : ''}
                    <button onclick="event.stopPropagation(); addToCart(${product.id})" 
                            style="margin-top:10px;width:100%;padding:10px;background:#f97316;color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;transition:0.2s;">
                        🛒 Ajouter au panier
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Filtre les produits par catégorie
 */
function filterProducts(category) {
    if (category === 'all' || !category) {
        displayProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        displayProducts(filtered);
    }
    
    // Mettre à jour les catégories actives
    document.querySelectorAll('.category-item').forEach(el => {
        el.classList.remove('active');
        if (el.textContent.trim() === category || el.textContent.trim() === 'Tous') {
            el.classList.add('active');
        }
    });
}

/**
 * Recherche des produits
 */
function searchProducts() {
    const input = document.getElementById('search-input');
    if (!input) return;
    
    const query = input.value.toLowerCase().trim();
    if (!query) {
        displayProducts(products);
        return;
    }
    
    const results = products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    displayProducts(results);
}

/**
 * Met à jour les statistiques
 */
function updateStats() {
    const totalProducts = products.length;
    const totalSales = products.reduce((sum, p) => sum + (p.sales || 0), 0);
    const outOfStock = products.filter(p => p.stock <= 0).length;
    const revenue = products.reduce((sum, p) => sum + (p.price * (p.sales || 0)), 0);
    
    document.getElementById('admin-products-count').textContent = totalProducts;
    document.getElementById('admin-sales-count').textContent = totalSales;
    document.getElementById('admin-out-stock').textContent = outOfStock;
    document.getElementById('admin-revenue').textContent = revenue.toLocaleString();
}

// ===== INITIALISATION =====

// Afficher les produits au chargement
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        displayProducts(products);
        updateStats();
        console.log('✅ Products.js chargé - ' + products.length + ' produits');
    }, 200);
});

console.log('📦 products.js chargé avec ' + products.length + ' produits');