export const products = [
  {
    id: "1",
    name: "Classic Leather Bag",
    category: "Bags",
    price: 120,
    description:
      "A soft handcrafted leather bag for everyday use, with a spacious interior and durable hardware.",
    image: "https://via.placeholder.com/520x380?text=Leather+Bag",
  },
  {
    id: "2",
    name: "Sport Sneakers",
    category: "Shoes",
    price: 85,
    description:
      "Lightweight sneakers built for comfort and style, perfect for city walks and gym sessions.",
    image: "https://via.placeholder.com/520x380?text=Sport+Sneakers",
  },
  {
    id: "3",
    name: "Minimal Wristwatch",
    category: "Accessories",
    price: 150,
    description:
      "A minimal watch with a clean dial and leather strap, designed for both casual and formal wear.",
    image: "https://via.placeholder.com/520x380?text=Wristwatch",
  },
  {
    id: "4",
    name: "Denim Jacket",
    category: "Clothing",
    price: 95,
    description:
      "Classic denim jacket with modern tailoring and comfortable stretch fabric.",
    image: "https://via.placeholder.com/520x380?text=Denim+Jacket",
  },
  {
    id: "5",
    name: "Travel Backpack",
    category: "Bags",
    price: 110,
    description:
      "A rugged travel backpack with multiple compartments, water-resistant fabric, and ergonomic straps.",
    image: "https://via.placeholder.com/520x380?text=Travel+Backpack",
  },
];

export const getProducts = () => products;

export const getProductById = (id) => products.find((product) => product.id === id);
