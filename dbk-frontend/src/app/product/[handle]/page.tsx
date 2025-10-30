import Navbar from "@/components/Navbar";
import ProductScreen from "../../../components/product/ProductScreen";
import CategoriesFetcher from "@/components/CategoriesFetcher";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  return (
    <>
      <Navbar />
      <ProductScreen handle={handle} />
    </>
  );
}
