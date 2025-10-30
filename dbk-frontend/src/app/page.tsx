import CartDrawer from "@/components/cart/CartDrawer";
import CategoriesFetcher from "@/components/CategoriesFetcher";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/product/ProductCard";
import BannerSection from "@/components/sections/Banner";
import TopPicks from "@/components/sections/TopPicks";
import TrendingNow from "@/components/sections/TrendingNow";
import VideoCardsSection from "@/components/sections/VideoCardsSection";
import Image from "next/image";

export default function Home() {
  const products = [
    {
      href: "/product/linen-set",
      images: [
        "/images/products/linen1.webp",
        "/images/products/linen2.jpeg",
        "/images/products/linen3.jpg",
      ],
      title: "Handwoven Linen Saree – Coral Bloom",
      price: 2199,
      compareAtPrice: 2999,
    },
    {
      href: "/product/linen-set",
      images: [
        "/images/products/linen1.webp",
        "/images/products/linen2.jpeg",
        "/images/products/linen3.jpg",
      ],
      title: "Handwoven Linen Saree – Coral Bloom",
      price: 2199,
      compareAtPrice: 2999,
    },
    {
      href: "/product/linen-set",
      images: [
        "/images/products/linen1.webp",
        "/images/products/linen2.jpeg",
        "/images/products/linen3.jpg",
      ],
      title: "Handwoven Linen Saree – Coral Bloom",
      price: 2199,
      compareAtPrice: 2999,
    },
    {
      href: "/product/linen-set",
      images: [
        "/images/products/linen1.webp",
        "/images/products/linen2.jpeg",
        "/images/products/linen3.jpg",
      ],
      title: "Handwoven Linen Saree – Coral Bloom",
      price: 2199,
      compareAtPrice: 2999,
    },
    {
      href: "/product/linen-set",
      images: [
        "/images/products/linen1.webp",
        "/images/products/linen2.jpeg",
        "/images/products/linen3.jpg",
      ],
      title: "Handwoven Linen Saree – Coral Bloom",
      price: 2199,
      compareAtPrice: 2999,
    },
    {
      href: "/product/linen-set",
      images: [
        "/images/products/linen1.webp",
        "/images/products/linen2.jpeg",
        "/images/products/linen3.jpg",
      ],
      title: "Handwoven Linen Saree – Coral Bloom",
      price: 2199,
      compareAtPrice: 2999,
    },
  ];

  const banners = [
    {
      src: "/images/banners/sareebanner1.jpg",
      alt: "Festive Saree Drops",
      href: "/collections/festive",
    },
    {
      src: "/images/banners/sareebanner2.webp",
      alt: "New Linen Arrivals",
      href: "/collections/linen",
    },
  ];

  const videos = [
    {
      id: 1,
      href: "/product/linen-coral",
      videoSrc: "/videos/Burger.mov",
      poster: "/images/products/linen1.webp",
      title: "Handwoven Linen Saree – Coral Bloom",
      price: 2199,
      compareAtPrice: 2999,
    },
    {
      id: 2,
      href: "/product/kalamkari-indigo",
      videoSrc: "/videos/Burger.mov",
      poster: "/images/products/linen2.jpeg",
      title: "Kalamkari Cotton Saree – Indigo Garden",
      price: 1799,
      compareAtPrice: 2999,
    },
    {
      id: 3,
      href: "/product/banarasi-gold",
      videoSrc: "/videos/Burger.mov",
      poster: "/images/products/linen3.jpg",
      title: "Banarasi Silk Saree – Golden Hour",
      price: 1799,
      compareAtPrice: 2999,
    },
    {
      id: 4,
      href: "/product/banarasi-gold",
      videoSrc: "/videos/Burger.mov",
      poster: "/images/products/linen3.jpg",
      title: "Banarasi Silk Saree – Golden Hour",
      price: 1799,
      compareAtPrice: 2999,
    },
    {
      id: 5,
      href: "/product/banarasi-gold",
      videoSrc: "/videos/Burger.mov",
      poster: "/images/products/linen3.jpg",
      title: "Banarasi Silk Saree – Golden Hour",
      price: 1799,
      compareAtPrice: 2999,
    },
    {
      id: 6,
      href: "/product/banarasi-gold",
      videoSrc: "/videos/test.mp4",
      poster: "/images/products/linen3.jpg",
      title: "Banarasi Silk Saree – Golden Hour",
      price: 1799,
      compareAtPrice: 2999,
    },
  ];
  return (
    <div className="items-center justify-items-center min-h-screen">
      <Navbar />

      <BannerSection
        // intervalMs={4000}
        // fadeMs={800}
        // aspectClassName="pt-[45%] md:pt-[32%]" // taller? tweak if needed
        className="mb-8"
      />
      <VideoCardsSection
        title="Trending Videos"
        videos={videos}
        className="mb-10"
      />
      <TrendingNow collectionHandle="trending-now" />
      <TopPicks collectionHandle="top-picks" />
      <Footer />
    </div>
  );
}
