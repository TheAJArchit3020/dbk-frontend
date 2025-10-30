import {
  PRODUCTS,
  getProductBySlug,
  getProductsByCategory,
} from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { Product, Category } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const Api = {
  // When backend is ready, replace with real fetch calls to `${BASE_URL}/...`
  async listCategories(): Promise<Category[]> {
    return CATEGORIES;
  },
  async listFeaturedProducts(): Promise<Product[]> {
    return PRODUCTS.slice(0, 8);
  },
  async listProductsByCategory(slug: string): Promise<Product[]> {
    return getProductsByCategory(slug);
  },
  async getProduct(slug: string): Promise<Product | undefined> {
    return getProductBySlug(slug);
  },
};
