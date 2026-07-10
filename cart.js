let cart = [];

function addToCart(productId){

const product =
products.find(
p => p.id === productId
);

cart.push(product);

alert(product.name + " ajouté au panier");
}