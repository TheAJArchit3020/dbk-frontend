export type Category = {
  slug: string;
  name: string;
  image?: string;
  description?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string; // category slug
  rating?: number;
  description?: string;
  specs?: Record<string, string>;
};

export type CartItem = {
  productId: string;
  qty: number;
};

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
};
