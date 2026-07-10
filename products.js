const savedProducts =
JSON.parse(
localStorage.getItem("products")
);
const products =
savedProducts || [
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
image: "https://i.ibb.co/0ykTzmM2/IMG-4374.jpg"
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
image: "https://i.ibb.co/5WVcQyYX/IMG-4378.jpg"
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
image: "https://i.ibb.co/M4gzDNK/IMG-4379.jpg"
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
image: "https://i.ibb.co/8n9Bxb4C/IMG-4376.jpg"
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
image: "https://i.ibb.co/MydF07fD/IMG-4377.jpg"
}
];