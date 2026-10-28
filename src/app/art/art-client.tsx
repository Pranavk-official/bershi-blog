"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getImageProps } from "next/image";
import type { PageFlip } from "page-flip";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

import type { Wallpaper } from "@sections/wallpapers/config/wallpapers";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";

const ZOOMS = [1, 1.25, 1.5, 1.75, 2];

type Page = {
  key: string;
  side: "left" | "right";
  /** Pieces named in the caption while this page is open. */
  plates: Wallpaper[];
  /** "half": this page's side of a piece spread across both pages. */
  art?: { plate: Wallpaper; fit: "half" | "whole" };
  /** Page number, from 1. */
  n: number;
};

// The book is a run of open spreads (desktop and phone). A desktop piece runs
// across both pages; mobile pieces pair up, one per page.
function buildPages(wallpapers: Wallpaper[]): Page[] {
  const wide = wallpapers.filter((w) => w.aspect === "16x9");
  const tall = wallpapers.filter((w) => w.aspect === "9x16");
  const spreads: Wallpaper[][] = [
    ...wide.map((w) => [w]),
    ...Array.from({ length: Math.ceil(tall.length / 2) }, (_, i) => tall.slice(i * 2, i * 2 + 2)),
  ];
  return spreads
    .flatMap((plates, i): Omit<Page, "n">[] =>
      plates[0].aspect === "16x9"
        ? (["left", "right"] as const).map((side) => ({
            key: `${i}-${side}`,
            side,
            plates,
            art: { plate: plates[0], fit: "half" },
          }))
        : (["left", "right"] as const).map((side, j) => ({
            key: `${i}-${side}`,
            side,
            plates,
            art: plates[j] && { plate: plates[j], fit: "whole" },
          })),
    )
    .map((page, i) => ({ ...page, n: i + 1 }));
}

// `page` is the page size; the open spread is two pages side by side. `fit`
// sizes the book's wrapper so the whole spread fits the viewport. Phones get
// taller pages so the open book is as large as a narrow screen allows. On short
// screens the height term goes negative, so the book keeps a floor width.
// The desktop book is a photo of a blank open sketchbook (public/book/spread.webp).
// `page` is where each page's flat surface sits in it, in the photo's pixels;
// the spread is laid exactly over those two surfaces.
const PHOTO = { src: "/book/spread.webp", w: 1846, h: 852, page: { x: 76, y: 33, w: 849, h: 717 } };

// Each page surface's outline in the photo, traced from it once (as % of the
// page box): the dip into the spine at the top, the curve down into the gutter
// at the bottom, the rounded outer corners. The page-block edges stay outside,
// so the photo's own edges show around every page, turning ones included.
const PAGE_CLIP = {
  left: "polygon(0% 3.49%, 1.18% 2.79%, 2.36% 2.37%, 3.53% 1.81%, 4.71% 1.26%, 5.89% 0.98%, 7.07% 0.84%, 8.24% 0.84%, 9.42% 0.84%, 10.6% 0.84%, 11.78% 0.84%, 12.96% 0.7%, 14.13% 0.7%, 15.31% 0.7%, 16.49% 0.7%, 17.67% 0.7%, 18.85% 0.7%, 20.02% 0.56%, 21.2% 0.56%, 22.38% 0.56%, 23.56% 0.56%, 24.73% 0.56%, 25.91% 0.56%, 27.09% 0.42%, 28.27% 0.42%, 29.45% 0.42%, 30.62% 0.42%, 31.8% 0.42%, 32.98% 0.28%, 34.16% 0.28%, 35.34% 0.28%, 36.51% 0.14%, 37.69% 0.14%, 38.87% 0.14%, 40.05% 0.14%, 41.22% 0.14%, 42.4% 0%, 43.58% 0%, 44.76% 0%, 45.94% 0%, 47.11% 0%, 48.29% -0.14%, 49.47% -0.14%, 50.65% -0.14%, 51.83% -0.14%, 53% -0.28%, 54.18% -0.28%, 55.36% -0.28%, 56.54% -0.28%, 57.71% -0.28%, 58.89% -0.42%, 60.07% -0.42%, 61.25% -0.42%, 62.43% -0.42%, 63.6% -0.42%, 64.78% -0.56%, 65.96% -0.56%, 67.14% -0.56%, 68.32% -0.56%, 69.49% -0.56%, 70.67% -0.56%, 71.85% -0.56%, 73.03% -0.56%, 74.2% -0.56%, 75.38% -0.56%, 76.56% -0.56%, 77.74% -0.56%, 78.92% -0.56%, 80.09% -0.42%, 81.27% -0.42%, 82.45% -0.42%, 83.63% -0.28%, 84.81% -0.28%, 85.98% -0.14%, 87.16% -0.14%, 88.34% 0%, 89.52% 0%, 90.69% 0.14%, 91.87% 0.28%, 93.05% 0.56%, 94.23% 0.7%, 95.41% 0.98%, 96.58% 1.26%, 97.76% 1.53%, 98.94% 1.95%, 99.88% 2.23%, 100% 99.58%, 98.82% 99.58%, 97.64% 99.58%, 96.47% 99.58%, 95.29% 99.58%, 94.11% 99.58%, 92.93% 99.58%, 91.76% 99.58%, 90.58% 99.58%, 89.4% 99.58%, 88.22% 99.58%, 87.04% 99.58%, 85.87% 99.58%, 84.69% 99.58%, 83.51% 99.58%, 82.33% 99.58%, 81.15% 99.58%, 79.98% 99.58%, 78.8% 99.58%, 77.62% 99.58%, 76.44% 99.58%, 75.27% 99.58%, 74.09% 99.58%, 72.91% 99.58%, 71.73% 99.58%, 70.55% 99.58%, 69.38% 99.58%, 68.2% 99.58%, 67.02% 99.58%, 65.84% 99.58%, 64.66% 99.58%, 63.49% 99.58%, 62.31% 99.58%, 61.13% 99.58%, 59.95% 99.58%, 58.78% 99.58%, 57.6% 99.58%, 56.42% 99.58%, 55.24% 99.58%, 54.06% 99.58%, 52.89% 99.58%, 51.71% 99.58%, 50.53% 99.58%, 49.35% 99.58%, 48.17% 99.58%, 47% 99.58%, 45.82% 99.58%, 44.64% 99.58%, 43.46% 99.58%, 42.29% 99.58%, 41.11% 99.58%, 39.93% 99.58%, 38.75% 99.58%, 37.57% 99.58%, 36.4% 99.58%, 35.22% 99.58%, 34.04% 99.58%, 32.86% 99.58%, 31.68% 99.58%, 30.51% 99.58%, 29.33% 99.58%, 28.15% 99.58%, 26.97% 99.58%, 25.8% 99.58%, 24.62% 99.58%, 23.44% 99.58%, 22.26% 99.58%, 21.08% 99.58%, 19.91% 99.58%, 18.73% 99.58%, 17.55% 99.58%, 16.37% 99.58%, 15.19% 99.58%, 14.02% 99.58%, 12.84% 99.58%, 11.66% 99.58%, 10.48% 99.58%, 9.31% 99.58%, 8.13% 99.58%, 6.95% 99.58%, 5.77% 99.58%, 4.59% 99.58%, 3.42% 99.58%, 2.24% 99.58%, 1.06% 99.58%, 0.12% 99.58%)",
  right: "polygon(0% 2.37%, 1.18% 2.09%, 2.36% 1.67%, 3.53% 1.39%, 4.71% 1.12%, 5.89% 0.84%, 7.07% 0.7%, 8.24% 0.56%, 9.42% 0.42%, 10.6% 0.28%, 11.78% 0.14%, 12.96% 0.14%, 14.13% 0%, 15.31% 0%, 16.49% -0.14%, 17.67% -0.14%, 18.85% -0.14%, 20.02% -0.28%, 21.2% -0.28%, 22.38% -0.28%, 23.56% -0.28%, 24.73% -0.28%, 25.91% -0.28%, 27.09% -0.28%, 28.27% -0.28%, 29.45% -0.28%, 30.62% -0.28%, 31.8% -0.28%, 32.98% -0.28%, 34.16% -0.28%, 35.34% -0.14%, 36.51% -0.14%, 37.69% -0.14%, 38.87% -0.14%, 40.05% -0.14%, 41.22% -0.14%, 42.4% -0.14%, 43.58% -0.14%, 44.76% 0%, 45.94% 0%, 47.11% 0%, 48.29% 0%, 49.47% 0%, 50.65% 0.14%, 51.83% 0.14%, 53% 0.14%, 54.18% 0.14%, 55.36% 0.14%, 56.54% 0.28%, 57.71% 0.28%, 58.89% 0.28%, 60.07% 0.28%, 61.25% 0.42%, 62.43% 0.42%, 63.6% 0.42%, 64.78% 0.42%, 65.96% 0.56%, 67.14% 0.56%, 68.32% 0.56%, 69.49% 0.56%, 70.67% 0.56%, 71.85% 0.56%, 73.03% 0.7%, 74.2% 0.7%, 75.38% 0.7%, 76.56% 0.7%, 77.74% 0.84%, 78.92% 0.84%, 80.09% 0.84%, 81.27% 0.84%, 82.45% 0.84%, 83.63% 0.98%, 84.81% 0.98%, 85.98% 0.98%, 87.16% 0.98%, 88.34% 1.12%, 89.52% 1.12%, 90.69% 1.12%, 91.87% 1.12%, 93.05% 1.12%, 94.23% 1.26%, 95.41% 1.26%, 96.58% 1.53%, 97.76% 2.09%, 98.94% 2.65%, 99.88% 2.93%, 99.88% 99.58%, 98.94% 99.58%, 97.76% 99.58%, 96.58% 99.58%, 95.41% 99.58%, 94.23% 99.58%, 93.05% 99.58%, 91.87% 99.58%, 90.69% 99.58%, 89.52% 99.58%, 88.34% 99.58%, 87.16% 99.58%, 85.98% 99.58%, 84.81% 99.58%, 83.63% 99.58%, 82.45% 99.58%, 81.27% 99.58%, 80.09% 99.58%, 78.92% 99.58%, 77.74% 99.58%, 76.56% 99.58%, 75.38% 99.58%, 74.2% 99.58%, 73.03% 99.58%, 71.85% 99.58%, 70.67% 99.58%, 69.49% 99.58%, 68.32% 99.58%, 67.14% 99.58%, 65.96% 99.58%, 64.78% 99.58%, 63.6% 99.58%, 62.43% 99.58%, 61.25% 99.58%, 60.07% 99.58%, 58.89% 99.58%, 57.71% 99.58%, 56.54% 99.58%, 55.36% 99.58%, 54.18% 99.58%, 53% 99.58%, 51.83% 99.58%, 50.65% 99.58%, 49.47% 99.58%, 48.29% 99.58%, 47.11% 99.58%, 45.94% 99.58%, 44.76% 99.58%, 43.58% 99.58%, 42.4% 99.58%, 41.22% 99.58%, 40.05% 99.58%, 38.87% 99.58%, 37.69% 99.58%, 36.51% 99.58%, 35.34% 99.58%, 34.16% 99.58%, 32.98% 99.58%, 31.8% 99.58%, 30.62% 99.58%, 29.45% 99.58%, 28.27% 99.58%, 27.09% 99.58%, 25.91% 99.58%, 24.73% 99.58%, 23.56% 99.58%, 22.38% 99.58%, 21.2% 99.58%, 20.02% 99.58%, 18.85% 99.58%, 17.67% 99.58%, 16.49% 99.58%, 15.31% 99.58%, 14.13% 99.58%, 12.96% 99.58%, 11.78% 99.58%, 10.6% 99.58%, 9.42% 99.58%, 8.24% 99.58%, 7.07% 99.58%, 5.89% 99.58%, 4.71% 99.58%, 3.53% 99.58%, 2.36% 99.58%, 1.18% 99.58%, 0% 99.58%)",
};

/**
 * This page's patch of the photo as its paper, clipped to the page surface's
 * real outline: the sheet *is* the photographed paper and keeps that shape
 * while it turns.
 */
const photoPaper = (left: boolean): React.CSSProperties => {
  const { w, h, page } = PHOTO;
  const x = left ? page.x : page.x + page.w;
  const size = `${(w / page.w) * 100}% ${(h / page.h) * 100}%`;
  const position = `${(x / (w - page.w)) * 100}% ${(page.y / (h - page.h)) * 100}%`;
  return {
    backgroundImage: `url(${PHOTO.src})`,
    backgroundSize: size,
    backgroundPosition: position,
    clipPath: PAGE_CLIP[left ? "left" : "right"],
  };
};

// page-flip's page size: the ratio of one page surface in the photo.
const PAGE_SIZE = { width: 600, height: Math.round((600 * PHOTO.page.h) / PHOTO.page.w) };

const layouts = {
  spread: {
    // Sizes the whole photo, page block and all.
    fit: `max(min(100%, 20rem), min(100%, 1180px, (100svh - 17rem) * ${PHOTO.w / PHOTO.h}))`,
  },
  // Phones get the same book, edge to edge, as on Meng To's sketchbook.
  phone: {
    fit: "100vw",
  },
};

const imageUrl = (w: Wallpaper, width: number) =>
  getImageProps({
    src: w.src,
    alt: "",
    width,
    height: Math.round(width * (w.aspect === "16x9" ? 9 / 16 : 16 / 9)),
  }).props.src;

// Cold-press paper: fine grain plus coarser tooth, laid over the art too.
// Each sheet is its own GPU layer (transform-gpu) and avoids blend modes and
// filters: pages repaint every frame of a turn, so paint must stay cheap.
const PAPER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .42 0 0 0 0 .36 0 0 0 0 .27 0 0 0 .22 0'/%3E%3C/filter%3E%3Cfilter id='t'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.035' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .43 0 0 0 0 .32 0 0 0 .18 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23t)'/%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`;

const PAPER_INK = "#f8f3ea";

/** One sheet of paper. */
function Sheet({ page, width, photo = false }: { page: Page; width: number; photo?: boolean }) {
  const { art, side } = page;
  const left = side === "left";

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        !photo && "bg-[#f8f3ea]",
        // Own GPU layer for page-flip.
        "transform-gpu",
        left ? "rounded-l-[10px]" : "rounded-r-[10px]",
        "@container",
      )}
      style={photo ? photoPaper(left) : undefined}
    >
      {art?.fit === "half" && (
        // Each half holds a double-width copy of the piece, cover-fitted and
        // anchored at the outer edge, so the art runs across the spine at any
        // page shape.
        <div
          className={cn(
            "absolute top-[9%] bottom-[9%] overflow-hidden",
            // Ink the art into the paper: its light ground takes the paper's colour and tooth.
            photo && "mix-blend-multiply",
            left ? "right-0 left-[6%]" : "right-[6%] left-0",
          )}
          style={{
            // Soft outer edges so the piece sits in the paper like a wash.
            // On the photo book the fade is wider, so the ground dissolves into the page.
            maskImage: photo
              ? `linear-gradient(to bottom, transparent, #000 22%, #000 80%, transparent), linear-gradient(to ${left ? "right" : "left"}, transparent, #000 18%)`
              : `linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent), linear-gradient(to ${left ? "right" : "left"}, transparent, #000 5%)`,
            maskComposite: "intersect",
          }}
        >
          <div
            className={cn("absolute inset-y-0 w-[200%] bg-cover bg-center", left ? "left-0" : "right-0")}
            style={{ backgroundImage: `url(${imageUrl(art.plate, width)})` }}
          />
        </div>
      )}
      {art?.fit === "whole" && (
        <div
          className={cn(
            "absolute bg-contain bg-center bg-no-repeat",
            // On the photo book the box is the image's own shape, so the edge fades land on the art.
            photo ? "top-[8%] bottom-[8%] left-1/2 aspect-9/16 -translate-x-1/2 mix-blend-multiply" : "inset-[8%]",
          )}
          style={{
            backgroundImage: `url(${imageUrl(art.plate, width)})`,
            ...(photo && {
              // The tall pieces hold their figures low, so the empty ground above fades out.
              maskImage: "linear-gradient(to bottom, transparent 8%, #000 55%, #000 90%, transparent), linear-gradient(to right, transparent, #000 15%, #000 85%, transparent)",
              maskComposite: "intersect",
            }),
          }}
        />
      )}
      {/* Folio: a seal pressed at the outer foot of the page. */}
      <svg
        viewBox="0 0 100 100"
        aria-label={`Page ${page.n}`}
        role="img"
        className={cn(
          "absolute bottom-[4%] w-[max(22px,10cqw)] font-hand opacity-85",
          left ? "left-[6%] -rotate-3" : "right-[6%] rotate-2",
        )}
      >
        <path
          fill="#7a4a2e"
          d="M7 10Q5 5 11 5L47 4Q51 6 56 4L89 5Q95 5 95 11L96 49Q94 54 96 58L95 89Q95 95 89 95L53 96Q48 94 43 96L11 95Q5 95 5 89L4 53Q6 48 4 43Z"
        />
        <rect x="10" y="10" width="80" height="80" rx="2" fill="none" stroke={PAPER_INK} strokeWidth="4" />
        <text x="50" y="54" fill={PAPER_INK} fontSize="68" textAnchor="middle" dominantBaseline="central">
          {page.n}
        </text>
        {/* Worn spots where the ink didn't take. */}
        <g fill={PAPER_INK}>
          <circle cx="24" cy="80" r="2.2" />
          <circle cx="79" cy="20" r="1.6" />
          <circle cx="70" cy="84" r="1.2" />
          <circle cx="8" cy="30" r="1.4" />
          <path d="M93 66q-3 3-1 7l3-1z" />
        </g>
      </svg>
      {/* Paper tooth over everything, so the art reads as printed on it. The
          photo has its own tooth and gutter, so it gets a lighter touch. */}
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0", photo && "opacity-40")}
        style={{ backgroundImage: PAPER }}
      />
      {/* Crease: the sheet curves down into the spine, over the art. */}
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-y-0 w-[14%]", left ? "right-0" : "left-0", photo && "opacity-50")}
        style={{
          background: `linear-gradient(to ${left ? "left" : "right"}, rgb(40 28 12 / 0.38), rgb(40 28 12 / 0.16) 10%, rgb(255 255 255 / 0.10) 32%, rgb(40 28 12 / 0.04) 55%, transparent)`,
        }}
      />
    </div>
  );
}

/**
 * Sketchbook: the photographed book with the art laid on its pages, turned by
 * `page-flip`'s curl. page-flip moves and finally removes the nodes it owns,
 * so React renders the pages into a hidden template and the library gets clones.
 */
const MAX_TILT = 2.5; // degrees

// Ragged edge along the binding side of a torn-out page (deterministic, so it doesn't jitter).
const ragged = (side: "left" | "right") => {
  const teeth = Array.from({ length: 26 }, (_, i) => {
    const y = (i / 25) * 100;
    const depth = 1.2 + ((i * 37) % 7) * 0.45; // 1.2–3.9% of the page width
    return side === "left" ? `${100 - depth}% ${y}%` : `${depth}% ${y}%`;
  });
  return side === "left"
    ? `polygon(0 0, ${teeth.join(", ")}, 0 100%)`
    : `polygon(${teeth.join(", ")}, 100% 100%, 100% 0)`;
};

/** The page coming out of the book, and the blank page it leaves behind while it goes. */
function TornPage({
  tear,
  progress,
  left,
  right,
  width,
  onDone,
}: {
  tear: Tear;
  progress: number;
  left: Page;
  right: Page;
  width: number;
  onDone: () => void;
}) {
  const sides = tear.region === "spread" ? (["left", "right"] as const) : [tear.region];
  // Which way it peels: away from the spine, and up or down with the pull.
  const away = tear.region === "left" ? -1 : 1;
  const fly = tear.phase === "fly";
  const back = tear.phase === "back";
  const p = back ? 0 : progress;
  const x = fly ? tear.dx * 2.2 + away * 400 : tear.dx * 0.55;
  const y = fly ? tear.dy * 2.2 - 260 : tear.dy * 0.55;
  const tilt = fly ? away * 22 : away * p * 9 + tear.dx * 0.02;
  const box = (side: "left" | "right") => (side === "left" ? "left-0" : "left-1/2");
  const spanWidth = tear.region === "spread" ? "w-full" : "w-1/2";

  return (
    <>
      {/* The blank page under the one being torn out. */}
      {sides.map((side) => (
        <div
          key={side}
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-y-0 z-10 w-1/2", box(side))}
          style={{ ...photoPaper(side === "left"), opacity: back ? 0 : 1, transition: "opacity 300ms" }}
        />
      ))}
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-y-0 z-30 flex", spanWidth, tear.region === "right" ? "left-1/2" : "left-0")}
        style={{
          transform: `translate(${x}px, ${y}px) rotate(${tilt}deg) scale(${1 + p * 0.03})`,
          transformOrigin: tear.region === "left" ? "0% 50%" : tear.region === "right" ? "100% 50%" : "50% 100%",
          transition: tear.phase === "drag" ? "none" : `transform ${fly ? 650 : 350}ms cubic-bezier(0.3, 0.6, 0.25, 1), opacity ${fly ? 650 : 0}ms`,
          opacity: fly ? 0 : 1,
          filter: `drop-shadow(0 ${4 + p * 14}px ${6 + p * 16}px rgb(40 28 10 / ${0.15 + p * 0.25}))`,
        }}
        onTransitionEnd={(e) => e.propertyName === "transform" && onDone()}
      >
        {sides.map((side) => (
          <div
            key={side}
            className="relative h-full flex-1"
            // A single page tears along the binding; a spread comes out whole.
            style={{ clipPath: tear.region === "spread" ? undefined : ragged(side) }}
          >
            <Sheet page={side === "left" ? left : right} width={width} photo />
          </div>
        ))}
      </div>
    </>
  );
}

type Tear = {
  plate: Wallpaper;
  /** Which part of the spread comes out: one page, or both for a piece across the spread. */
  region: "left" | "right" | "spread";
  dx: number;
  dy: number;
  phase: "drag" | "fly" | "back";
};

const download = (w: Wallpaper) => {
  const a = document.createElement("a");
  a.href = w.src;
  a.download = "";
  a.click();
};

export function ArtBook({ wallpapers }: { wallpapers: Wallpaper[] }) {
  const spreadPages = useMemo(() => buildPages(wallpapers), [wallpapers]);
  const leftOf = (s: number) => spreadPages[s * 2];
  const template = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const book = useRef<PageFlip | null>(null);
  const pagesBox = useRef<HTMLDivElement>(null);
  const [tear, setTear] = useState<Tear | null>(null);
  const tearStart = useRef<{ x: number; y: number; w: number } | null>(null);
  // A page-flip drag in progress, so pulling it off the book can tear the page out.
  const press = useRef<{ x: number; y: number; side: "left" | "right"; page: number } | null>(null);

  const [current, setCurrent] = useState(0);
  const tiltRef = useRef<HTMLDivElement>(null);
  const pressed = useRef(false);

  // The book leans a little toward a fine pointer, like a sketchbook picked up off the desk.
  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el || e.pointerType !== "mouse" || pressed.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    const y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    el.style.setProperty("--ry", `${(x * MAX_TILT).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-y * MAX_TILT * 0.8).toFixed(2)}deg`);
  };
  const untilt = () => {
    tiltRef.current?.style.setProperty("--ry", "0deg");
    tiltRef.current?.style.setProperty("--rx", "0deg");
  };
  const [zoom, setZoom] = useState(0);
  // null until mounted: the layout depends on the viewport.
  const [phone, setPhone] = useState<boolean | null>(null);

  useEffect(() => {
    // Landscape phones too: wide but short.
    const query = window.matchMedia("(max-width: 640px), (pointer: coarse) and (max-height: 500px)");
    const sync = () => setPhone(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const layout = phone ? layouts.phone : layouts.spread;

  // Build the page-flip book once the layout is known, and again if it changes.
  useEffect(() => {
    if (phone === null) return;
    let flip: PageFlip | undefined;
    let cancelled = false;
    setCurrent(0);

    import("page-flip").then(({ PageFlip }) => {
      if (cancelled || !template.current || !stage.current) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      flip = new PageFlip(stage.current, {
        ...PAGE_SIZE,
        size: "stretch",
        minWidth: 100,
        maxWidth: 3000,
        minHeight: 80,
        maxHeight: 2600,
        // Always an open spread, on phones too: desktop pieces run across both pages.
        usePortrait: false,
        showCover: false,
        maxShadowOpacity: 0.35,
        flippingTime: reduce ? 1 : 900,
        // Vertical swipes still scroll the page on touch screens.
        mobileScrollSupport: true,
        // No corner fold on hover; pages turn on drag, tap, the arrows or the keys.
        showPageCorners: false,
      });
      flip.loadFromHTML(Array.from(template.current.children, (node) => node.cloneNode(true)) as HTMLElement[]);
      // page-flip reports a page index; the rest of the page works in spreads.
      flip.on("flip", (e) => setCurrent(Math.floor((e.data as number) / 2)));
      book.current = flip;
    });

    return () => {
      cancelled = true;
      flip?.destroy();
      book.current = null;
    };
  }, [phone]);

  // Book zoom resizes the container; page-flip re-lays itself out on update().
  useEffect(() => {
    book.current?.update();
  }, [zoom]);

  // Arrow keys turn the page, unless focus is in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowRight") book.current?.flipNext();
      else if (e.key === "ArrowLeft") book.current?.flipPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // `current` is the open spread.
  const plates = leftOf(current)?.plates ?? [];
  const firstPage = current * 2 + 1;

  // Tearing a page out: turn a page as usual, but drag it well off the top or
  // bottom of the book and it gives way, like paper pulled too hard.
  const tearProgress = (t: Tear) => Math.min(1, Math.hypot(t.dx, t.dy) / ((tearStart.current?.w ?? 600) * 0.3));

  const startPress = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = pagesBox.current?.getBoundingClientRect();
    if (tear || !box || !book.current) return;
    press.current = {
      x: e.clientX,
      y: e.clientY,
      side: e.clientX < box.left + box.width / 2 ? "left" : "right",
      page: book.current.getCurrentPageIndex(),
    };
  };

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const start = tearStart.current;
      if (tear?.phase === "drag" && start) return setTear({ ...tear, dx: e.clientX - start.x, dy: e.clientY - start.y });
      const p = press.current;
      const box = pagesBox.current?.getBoundingClientRect();
      const flip = book.current;
      if (!p || !box || !flip || tear) return;
      const offBook = e.clientY > box.bottom + box.height * 0.12 || e.clientY < box.top - box.height * 0.12;
      if (!offBook) return;
      const plate = plates[0]?.aspect === "16x9" ? plates[0] : plates[p.side === "left" ? 0 : 1];
      if (!plate) return; // a blank page just keeps turning
      // Let go of page-flip's drag where it started, so it settles back on the spread.
      const block = stage.current?.querySelector(".stf__block")?.getBoundingClientRect();
      if (block) flip.userStop({ x: p.x - block.left, y: p.y - block.top });
      flip.turnToPage(p.page);
      setCurrent(Math.floor(p.page / 2));
      press.current = null;
      tearStart.current = { x: p.x, y: p.y, w: box.width };
      setTear({ plate, region: plate.aspect === "16x9" ? "spread" : p.side, dx: e.clientX - p.x, dy: e.clientY - p.y, phase: "drag" });
    };
    const up = () => {
      press.current = null;
      endTear();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  });

  const endTear = () => {
    if (tear?.phase !== "drag") return;
    if (tearProgress(tear) < 0.55) return setTear({ ...tear, phase: "back" });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      download(tear.plate);
      return setTear(null);
    }
    setTear({ ...tear, phase: "fly" });
  };
  const onTearEnd = () => {
    if (tear?.phase === "fly") download(tear.plate);
    if (tear?.phase !== "drag") setTear(null);
  };

  return (
    <div className="flex min-h-[calc(100svh-7rem)] flex-col items-center justify-center pb-8">
      <div className="flex w-full items-center justify-center gap-2 sm:mt-10 sm:gap-6">
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => book.current?.flipPrev()}
          className={cn("relative z-10 shrink-0 text-muted-foreground/60 transition-colors hover:text-foreground", phone && "hidden")}
        >
          <ChevronLeft className="size-9" strokeWidth={0.8} />
        </button>

        <div
          className={cn("min-w-0 flex-1 [perspective:1750px]", ZOOMS[zoom] > 1 && "overflow-x-auto")}
          onPointerMove={tilt}
          onPointerLeave={untilt}
          // Hold still while a page is dragged, so page-flip's pointer maths stay exact.
          onPointerDown={() => {
            pressed.current = true;
            untilt();
          }}
          onPointerUp={() => (pressed.current = false)}
        >
          <div
            ref={tiltRef}
            className="relative isolate mx-auto transition-transform duration-500 ease-out [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] motion-reduce:transition-none"
            style={{
              width: `calc(${layout.fit} * ${ZOOMS[zoom]})`,
              // Full-bleed on phones: break out of the page's side padding.
              ...(phone ? { marginInline: "calc(50% - 50vw)" } : {}),
            }}
          >
            {/* Soft shadow pooled on the desk under the book. */}
            <div
              aria-hidden="true"
              className="absolute -z-10 inset-x-[5%] top-[25%] -bottom-[4%] bg-[radial-gradient(50%_50%_at_50%_58%,rgb(58_44_26/0.34),rgb(58_44_26/0.19)_40%,transparent_74%)]"
            />
            <div
              aria-hidden="true"
              className="absolute -z-10 inset-x-[9%] top-[62%] -bottom-[2%] bg-[radial-gradient(50%_44%_at_50%_42%,rgb(44_32_14/0.4),rgb(44_32_14/0.17)_48%,transparent_78%)]"
            />
            {/* Hairline contact shadow where the page block meets the desk. */}
            <div
              aria-hidden="true"
              className="absolute -z-10 inset-x-[3%] -bottom-[3%] h-[6%] bg-[radial-gradient(50%_50%_at_50%_30%,rgb(40_28_10/0.3),transparent_76%)] blur-[3px]"
            />
            {/* The photographed book, with the spread laid over its two page surfaces. */}
            <div className="relative" style={{ aspectRatio: `${PHOTO.w} / ${PHOTO.h}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- fixed decorative backdrop, already sized */}
                <img src={PHOTO.src} alt="" aria-hidden="true" draggable={false} className="absolute inset-0 size-full select-none" />
                <div
                  ref={pagesBox}
                  onPointerDown={startPress}
                  className="absolute"
                  style={{
                    left: `${(PHOTO.page.x / PHOTO.w) * 100}%`,
                    top: `${(PHOTO.page.y / PHOTO.h) * 100}%`,
                    width: `${((PHOTO.page.w * 2) / PHOTO.w) * 100}%`,
                  }}
                >
                  {/* Keyed so a layout switch gets a fresh node page-flip hasn't touched. */}
                  <div key={phone ? "phone" : "spread"} ref={stage} />

                  {tear && (
                    <TornPage
                      tear={tear}
                      progress={tearProgress(tear)}
                      left={spreadPages[current * 2]}
                      right={spreadPages[current * 2 + 1]}
                      width={phone ? 1080 : 2048}
                      onDone={onTearEnd}
                    />
                  )}
                </div>
              </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Next page"
          onClick={() => book.current?.flipNext()}
          className={cn("relative z-10 shrink-0 text-muted-foreground/60 transition-colors hover:text-foreground", phone && "hidden")}
        >
          <ChevronRight className="size-9" strokeWidth={0.8} />
        </button>
      </div>

      <p className="mt-7 text-center text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
        Pages {firstPage}–{firstPage + 1} of {spreadPages.length}
      </p>
      <p aria-live="polite" className="mt-3 min-h-5 text-center text-[13px] tracking-[0.3em] uppercase">
        {plates.map((p) => p.title).join(" / ")}
      </p>
      <p className="mt-1 flex min-h-4 gap-4 text-xs text-muted-foreground">
        {plates.map((p) => (
          <a key={p.id} href={p.src} download className="underline underline-offset-4 hover:text-foreground">
            Download {plates.length > 1 && p.title} · {p.resolution}
          </a>
        ))}
      </p>

      <div className="mt-5 flex items-center gap-1 rounded-full border bg-card px-2 py-1 shadow-sm pointer-coarse:hidden">
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          aria-label="Zoom out"
          disabled={zoom === 0}
          onClick={() => setZoom((z) => z - 1)}
        >
          <ZoomOut />
        </Button>
        <span className="w-12 text-center text-xs text-muted-foreground">{ZOOMS[zoom] * 100}%</span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          aria-label="Zoom in"
          disabled={zoom === ZOOMS.length - 1}
          onClick={() => setZoom((z) => z + 1)}
        >
          <ZoomIn />
        </Button>
      </div>

      <p className="mt-4 text-center text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
        {phone ? "Swipe or tap to turn · drag a page off the book to tear it out" : "Drag, click or use ← → to turn · drag a page off the book to tear it out"}
      </p>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Book inspired by{" "}
        <a
          href="https://github.com/MengTo/sketchbook"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Meng To&apos;s Sketchbook
        </a>
      </p>
      <p className="mt-2 text-center text-[10.5px] tracking-[0.2em] text-muted-foreground/75 uppercase">
        Original artwork / Desktop &amp; mobile wallpapers / Free for personal use
      </p>

      {/* Page template, cloned into the book on mount. */}
      <div ref={template} hidden>
        {phone !== null &&
          spreadPages.map((p) => (
            <div key={p.key}>
              <Sheet page={p} width={phone ? 1080 : 2048} photo />
            </div>
          ))}
      </div>

    </div>
  );
}
