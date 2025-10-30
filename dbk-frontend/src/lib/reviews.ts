import { sdk } from "@/lib/sdk";

export type StoreProductReview = {
  id: string;
  title?: string | null;
  rating: number;
  content: string;
  first_name: string;
  last_name: string;
  created_at?: string;
};

const pubKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export async function fetchProductReviews(
  productId: string,
  page = 1,
  limit = 10
) {
  const offset = (page - 1) * limit;
  return sdk.client.fetch<{
    reviews: StoreProductReview[];
    average_rating: number;
    count: number;
    limit: number;
    offset: number;
  }>(`/store/products/${productId}/reviews`, {
    headers: { "x-publishable-api-key": pubKey },
    query: { limit, offset, order: "-created_at" },
    cache: "no-store",
  });
}

export async function submitReview(input: {
  product_id: string;
  title?: string;
  content: string;
  rating: number;
  first_name: string;
  last_name: string;
  // customer auth must be present (session/bearer cookie)
}) {
  return sdk.client.fetch(`/store/reviews`, {
    method: "POST",
    headers: { "x-publishable-api-key": pubKey },
    body: input,
    cache: "no-store",
  });
}
