"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import type { HttpTypes } from "@medusajs/types";
import { useMemo, useState } from "react";

// Lightbox (no SSR)
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";

type Props = {
  images: HttpTypes.StoreProductImage[];
  /** Optional product video URL from product.metadata.video_url */
  videoUrl?: string | null;
};

type MediaItem =
  | { kind: "video"; url: string }
  | { kind: "image"; url: string; id?: string };

export default function ProductGallery({ images, videoUrl }: Props) {
  // media list: video first (if any), then images
  const media = useMemo<MediaItem[]>(() => {
    const list: MediaItem[] = [];
    if (videoUrl) list.push({ kind: "video", url: videoUrl });
    for (const img of images || []) {
      if (img?.url) list.push({ kind: "image", url: img.url, id: img.id });
    }
    return list;
  }, [images, videoUrl]);

  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  if (!media.length) {
    return (
      <div
        className="rounded-xl bg-bg border border-border"
        style={{ aspectRatio: "9 / 16" }}
      />
    );
  }

  const activeItem = media[active];

  // Lightbox slides (image + optional video)
  const slides = media.map((m) =>
    m.kind === "image"
      ? { src: m.url }
      : {
          type: "video",
          // The Video plugin expects "sources"
          sources: [{ src: m.url, type: "video/mp4" }], // change type if not mp4
          // poster: "/path/to/poster.jpg", // optional
        }
  );

  return (
    <>
      {/* Layout: left column thumbnails, right main viewer */}
      <div className="grid grid-cols-[88px_1fr] gap-3">
        {/* LEFT: vertical thumbs */}
        <div className="flex flex-col gap-2 pr-1">
          {media.map((m, i) => {
            const isActive = i === active;
            return (
              <button
                key={(m.kind === "image" ? m.id : `video-${i}`) || i}
                onClick={() => setActive(i)}
                className={`relative w-[88px] rounded-lg border ${
                  isActive ? "border-primary" : "border-border"
                }`}
                style={{ aspectRatio: "9 / 16" }}
                aria-label={
                  m.kind === "video" ? "Product video" : `Preview ${i + 1}`
                }
              >
                {m.kind === "video" ? (
                  <div className="absolute inset-0 grid place-items-center text-xs text-white bg-black/60 rounded-lg">
                    ▶
                  </div>
                ) : (
                  <Image
                    src={m.url}
                    alt="product thumbnail"
                    fill
                    className="object-cover"
                    sizes="88px"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* RIGHT: 9:16 main viewer; click opens Lightbox */}
        <div
          className="relative overflow-hidden rounded-xl border border-border bg-bg cursor-zoom-in"
          style={{ aspectRatio: "9 / 16" }}
          onClick={() => setOpen(true)}
          role="button"
          aria-label="Open product viewer"
        >
          {activeItem.kind === "video" ? (
            <video
              key={activeItem.url}
              src={activeItem.url}
              className="h-full w-full object-cover"
              controls
              playsInline
            />
          ) : (
            <Image
              src={activeItem.url}
              alt="product image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          )}
        </div>
      </div>

      {/* Lightbox modal */}
      {typeof window !== "undefined" && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={slides}
          index={active}
          // Keep gallery index in sync with thumbs
          on={{ view: ({ index }) => setActive(index) }}
          // Behavior
          carousel={{ finite: true }}
          animation={{ fade: 250 }}
          controller={{ closeOnBackdropClick: true }}
          render={{}} // default UI is good
          plugins={[Zoom, Thumbnails, Video, Fullscreen]}
          // Zoom plugin config: single-click toggles zoom; drag to pan
          zoom={{
            maxZoomPixelRatio: 2.5,
            zoomInMultiplier: 1.4,
            doubleTapDelay: 250, // double-click/ double-tap also zooms
            // By default: click zooms, click again resets; drag pans when zoomed
            // You can tweak more options if needed
          }}
          thumbnails={{
            position: "bottom",
            width: 100,
            height: 100 * (9 / 16),
            border: 1,
          }}
        />
      )}
    </>
  );
}
