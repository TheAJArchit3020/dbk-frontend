"use client";

import { useEffect, useMemo, useState } from "react";
import { sdk } from "@/lib/sdk";
import type { HttpTypes } from "@medusajs/types";
import ProductGallery from "./ProductGallery";
import VariantSelector from "./VariantSelector";
import PriceBlock from "./PriceBlock";
import AddToCartButton from "./AddToCart";
import RelatedProducts from "./RelatedProducts";
import ProductReviews from "./ProductReviews";

type Props = { handle: string };
function toAbsoluteMediaUrl(url?: string | null) {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url; // already absolute
  const base =
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/+$/, "") ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL?.replace(/\/+$/, "") ||
    "";
  return base ? `${base}${url}` : url; // if no base, keep as-is
}
export default function ProductScreen({ handle }: Props) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<HttpTypes.StoreProduct | null>(null);
  const [productCategory, setProductCategory] = useState<string | any>("");
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [cartId, setCartId] = useState<string | null>(null);

  // load (or create) cart id (client)
  useEffect(() => {
    const key = "medusa_cart_id";
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (stored) setCartId(stored);
    else {
      sdk.store.cart.create().then(({ cart }) => {
        localStorage.setItem(key, cart.id);
        setCartId(cart.id);
      });
    }
  }, []);

  // fetch product by handle (with variant prices)
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      const { products } = await sdk.store.product.list({
        handle,
        // include prices, categories, and metadata (for video_url)
        fields: "*variants.calculated_price,categories.*,*metadata",
        cart_id: cartId || undefined,
      });
      if (!cancelled) {
        const p = products[0] ?? null;
        setProduct(p);
        setProductCategory(p?.categories?.[0]?.name);
        setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [handle, cartId]);

  // find selected variant once all options chosen
  const selectedVariant = useMemo(() => {
    if (!product?.variants || !product?.options?.length) return undefined;
    if (Object.keys(selectedOptions).length !== product.options.length)
      return undefined;

    return product.variants.find((variant) =>
      variant.options?.every(
        (optVal) => selectedOptions[optVal.option_id!] === optVal.value
      )
    );
  }, [selectedOptions, product]);

  // related: pick first category, load siblings
  const primaryCategoryId = product?.categories?.[0]?.id;
  const [related, setRelated] = useState<HttpTypes.StoreProduct[]>([]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!primaryCategoryId) {
        setRelated([]);
        return;
      }
      const { products: siblings } = await sdk.store.product.list({
        category_id: [primaryCategoryId],
        limit: 8,
        fields: "*variants.calculated_price,categories.*",
        cart_id: cartId || undefined,
      });
      if (!cancelled) {
        setRelated((siblings || []).filter((p) => p.id !== product?.id));
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [primaryCategoryId, product?.id, cartId]);

  if (loading)
    return <div className="p-6 text-sm text-text-mutable">Loading…</div>;
  if (!product)
    return (
      <div className="p-6 text-sm text-text-mutable">Product not found.</div>
    );

  const videoUrlAbs = toAbsoluteMediaUrl((product.metadata as any)?.video_url);
  console.log(videoUrlAbs);
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: gallery */}
        <ProductGallery images={product.images || []} videoUrl={videoUrlAbs} />

        {/* Right: details */}
        <div>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-semibold text-text">
              {product.title}
            </h1>
            <div>{productCategory}</div>
          </div>

          <div className="mt-2">
            <PriceBlock product={product} selectedVariant={selectedVariant} />
          </div>

          {(product.options?.length || 0) > 0 && (
            <div className="mt-4">
              <VariantSelector
                product={product}
                selectedOptions={selectedOptions}
                onChange={setSelectedOptions}
              />
            </div>
          )}

          <div className="mt-6">
            <AddToCartButton
              productId={product.id}
              variantId={selectedVariant?.id}
              disabled={!selectedVariant || !cartId}
              cartId={cartId}
            />
          </div>

          {product.description && (
            <div className="mt-6 prose prose-sm max-w-none text-text">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          )}
        </div>
      </div>
      <div className="mt-12">
        <ProductReviews productId={product.id} />
      </div>
      {/* Related */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-text mb-4">
          You may also like
        </h2>
        <RelatedProducts products={related} />
      </div>
    </div>
  );
}
