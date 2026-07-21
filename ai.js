// ==========================================
// AI.JS - CONSEILLER INTELLIGENT
// ==========================================

/**
 * Conseil IA - Analyse la demande de l'utilisateur et propose des produits
 */
function askAI() {
    const input = document.getElementById("ai-input");
    const result = document.getElementById("ai-result");
    
    if (!input || !result) {
        console.warn("⚠️ Éléments AI introuvables");
        return;
    }

    const question = input.value.toLowerCase().trim();
    
    // 1. Vérifier si la question est vide
    if (question === "") {
        result.innerHTML = `
            <div style="padding:16px;background:#fef3c7;border-radius:12px;border-left:4px solid #f59e0b;">
                🤖 <strong>Écris une demande</strong><br>
                <span style="font-size:0.85rem;color:#888;">Ex: "J'ai 5000 FCFA pour une fête"</span>
            </div>
        `;
        return;
    }

    // 2. Extraire le budget de la question
    const budgetMatch = question.match(/\d+/g);
    let budget = null;
    if (budgetMatch) {
        // Prendre le premier nombre trouvé
        budget = parseInt(budgetMatch[0]);
    }

    // 3. Détecter l'événement/occasion
    let event = "";
    const eventKeywords = {
        "fête": "fête",
        "anniversaire": "fête",
        "soirée": "fête",
        "sortie": "sortie",
        "voyage": "voyage",
        "travail": "travail",
        "sport": "sport",
        "quotidien": "quotidien"
    };

    for (const [key, value] of Object.entries(eventKeywords)) {
        if (question.includes(key)) {
            event = value;
            break;
        }
    }

    // 4. Détecter la catégorie
    let category = "";
    const categoryKeywords = {
        "vêtement": "Vêtements",
        "tenue": "Vêtements",
        "chemise": "Vêtements",
        "pantalon": "Vêtements",
        "robe": "Vêtements",
        "chaussure": "Chaussures",
        "basket": "Chaussures",
        "chaussure": "Chaussures",
        "accessoire": "Accessoires",
        "montre": "Accessoires",
        "sac": "Accessoires",
        "bijou": "Accessoires",
        "téléphone": "Électronique",
        "samsung": "Électronique",
        "apple": "Électronique",
        "écouteur": "Électronique",
        "casque": "Électronique",
        "galaxy": "Électronique"
    };

    for (const [key, value] of Object.entries(categoryKeywords)) {
        if (question.includes(key)) {
            category = value;
            break;
        }
    }

    console.log('🔍 Analyse AI:', { question, budget, event, category });

    // 5. Filtrer les produits
    let recommendations = products.filter(product => product.stock > 0);

    // Filtrer par catégorie si détectée
    if (category) {
        recommendations = recommendations.filter(product => product.category === category);
    }

    // Filtrer par événement si détecté
    if (event) {
        const eventFiltered = recommendations.filter(product => product.event === event);
        if (eventFiltered.length > 0) {
            recommendations = eventFiltered;
        }
    }

    // 6. Trier par popularité et note
    recommendations.sort((a, b) => {
        // D'abord par popularité (ventes)
        if ((b.sales || 0) !== (a.sales || 0)) {
            return (b.sales || 0) - (a.sales || 0);
        }
        // Puis par note
        return (b.rating || 0) - (a.rating || 0);
    });

    // 7. Sélectionner les produits dans le budget
    let selected = [];
    let total = 0;

    if (budget && budget > 0) {
        // Avec budget : sélectionner les meilleurs produits dans le budget
        for (const product of recommendations) {
            if (total + product.price <= budget) {
                selected.push(product);
                total += product.price;
            }
        }
    } else {
        // Sans budget : prendre les 3 meilleurs produits
        selected = recommendations.slice(0, 3);
        total = selected.reduce((sum, p) => sum + p.price, 0);
    }

    // 8. Afficher les résultats
    if (selected.length === 0) {
        let suggestion = "🤖 Aucun produit trouvé pour votre demande.";
        
        // Suggestions d'amélioration
        if (budget && budget < 1000) {
            suggestion += " 💡 Essayez d'augmenter votre budget.";
        } else if (category) {
            suggestion += " 💡 Essayez une autre catégorie.";
        } else {
            suggestion += " 💡 Décrivez plus précisément votre besoin.";
        }

        result.innerHTML = `
            <div style="padding:16px;background:#fef2f2;border-radius:12px;border-left:4px solid #ef4444;">
                ${suggestion}
            </div>
        `;
        return;
    }

    // 9. Construire l'affichage des résultats
    let html = `
        <div style="padding:16px;background:#f0fdf4;border-radius:12px;border-left:4px solid #22c55e;margin-bottom:12px;">
            <h3 style="margin:0 0 6px 0;">🤖 Conseil WebProfit AI</h3>
            <p style="margin:0;font-size:0.9rem;color:#555;">
                ${selected.length} produit${selected.length > 1 ? 's' : ''} recommandé${selected.length > 1 ? 's' : ''}
                ${budget ? `pour un budget de ${budget.toLocaleString()} FCFA` : ''}
            </p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
    `;

    selected.forEach(product => {
        const imageUrl = product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/150';
        html += `
            <div style="background:white;border-radius:12px;padding:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);cursor:pointer;transition:0.2s;" 
                 onclick="showProduct(${product.id})">
                <img src="${imageUrl}" alt="${product.name}" 
                     onerror="this.src='https://via.placeholder.com/150'"
                     style="width:100%;height:120px;object-fit:cover;border-radius:8px;background:#f0f0f0;">
                <h4 style="margin:8px 0 4px;font-size:0.85rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;height:2.4rem;">
                    ${product.name}
                </h4>
                <p style="margin:4px 0;font-weight:700;color:#f97316;font-size:0.95rem;">
                    ${product.price.toLocaleString()} FCFA
                </p>
                <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">
                    <span style="font-size:0.65rem;background:#f0f0f0;padding:2px 8px;border-radius:12px;">⭐ ${product.rating || 5}</span>
                    ${product.stock > 0 ? `<span style="font-size:0.65rem;background:#dcfce7;color:#166534;padding:2px 8px;border-radius:12px;">✅ Stock</span>` : ''}
                </div>
                <button onclick="event.stopPropagation(); addToCart(${product.id})" 
                        style="width:100%;padding:6px;margin-top:8px;background:#f97316;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:0.75rem;">
                    🛒 Ajouter
                </button>
            </div>
        `;
    });

    html += `
        </div>
        <div style="margin-top:12px;padding:12px;background:#f8fafc;border-radius:10px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">
            <span style="font-weight:600;">💰 Total : ${total.toLocaleString()} FCFA</span>
            ${budget ? `<span style="color:${budget - total >= 0 ? '#22c55e' : '#ef4444'};font-weight:600;">
                💵 Reste : ${(budget - total).toLocaleString()} FCFA
            </span>` : ''}
            <button onclick="addAllToCart()" 
                    style="padding:8px 16px;background:#22c55e;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">
                🛒 Tout ajouter
            </button>
        </div>
    `;

    result.innerHTML = html;

    // Sauvegarder la dernière sélection pour "Tout ajouter"
    window._lastAISelection = selected;
}

/**
 * Ajoute tous les produits recommandés par l'IA au panier
 */
function addAllToCart() {
    const selected = window._lastAISelection || [];
    if (selected.length === 0) {
        showToast('❌ Aucun produit à ajouter');
        return;
    }

    let count = 0;
    selected.forEach(product => {
        // Vérifier si le produit existe déjà dans le panier
        const cart = getCart();
        const existing = cart.find(item => item.id === product.id);
        if (!existing) {
            addToCart(product.id);
            count++;
        }
    });

    showToast(`✅ ${count} produit${count > 1 ? 's' : ''} ajouté${count > 1 ? 's' : ''} au panier !`);
}

/**
 * Suggestions rapides pour l'IA
 */
function quickSuggestion(text) {
    const input = document.getElementById("ai-input");
    if (input) {
        input.value = text;
        askAI();
    }
}

console.log('🤖 ai.js chargé');