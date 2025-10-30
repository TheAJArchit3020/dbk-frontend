import { Product } from "@/lib/types";

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "classic-tee-men",
    name: "Classic Tee (Men)",
    price: 699,
    image: "/images/p-classic-tee.jpg",
    category: "men",
    rating: 4.4,
    description: "Soft cotton tee for everyday wear.",
  },
  {
    id: "p2",
    slug: "summer-dress",
    name: "Summer Dress",
    price: 1499,
    image: "/images/p-summer-dress.jpg",
    category: "women",
    rating: 4.6,
    description: "Lightweight, breathable, perfect for summer.",
  },
  {
    id: "p3",
    slug: "wireless-earbuds",
    name: "Wireless Earbuds",
    price: 2499,
    image: "/images/p-earbuds.jpg",
    category: "electronics",
    rating: 4.1,
    description: "Bluetooth 5.3, 24h battery, fast charge.",
  },
  {
    id: "p4",
    slug: "ceramic-mug",
    name: "Ceramic Mug",
    price: 399,
    image: "/images/p-mug.jpg",
    category: "home",
    rating: 4.8,
    description: "Dishwasher safe, matte finish.",
  },
];

export const featuredProducts = PRODUCTS.slice(0, 3);
export const getProductBySlug = (slug: string) =>
  PRODUCTS.find((p) => p.slug === slug);
export const getProductsByCategory = (slug: string) =>
  PRODUCTS.filter((p) => p.category === slug);
