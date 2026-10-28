"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getImageProps } from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import type { PageFlip } from "page-flip";

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
const layouts = {
  spread: {
    page: { width: 600, height: 520 },
    fit: `max(min(100%, 20rem), min(100%, 900px, (100svh - 24rem) * ${1200 / 520}))`,
  },
  phone: {
    page: { width: 360, height: 500 },
    fit: `max(min(100%, 20rem), min(100%, (100svh - 22rem) * ${720 / 500}))`,
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
// filters: page-flip re-clips pages every frame, so paint must stay cheap.
const PAPER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .42 0 0 0 0 .36 0 0 0 0 .27 0 0 0 .22 0'/%3E%3C/filter%3E%3Cfilter id='t'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.035' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .43 0 0 0 0 .32 0 0 0 .18 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23t)'/%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`;

const PAPER_INK = "#f8f3ea";

/** One sheet of paper. */
function Sheet({ page, width, layer = true }: { page: Page; width: number; layer?: boolean }) {
  const { art, side } = page;
  const left = side === "left";

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-[#f8f3ea]",
        // Own GPU layer for page-flip; off inside PhoneBook's 3D leaf, where a
        // nested layer defeats backface-visibility in Chrome.
        layer && "transform-gpu",
        left ? "rounded-l-[10px]" : "rounded-r-[10px]",
        "@container",
      )}
    >
      {art?.fit === "half" && (
        // Each half holds a double-width copy of the piece, cover-fitted and
        // anchored at the outer edge, so the art runs across the spine at any
        // page shape.
        <div
          className={cn(
            "absolute top-[9%] bottom-[9%] overflow-hidden",
            left ? "right-0 left-[6%]" : "right-[6%] left-0",
          )}
          style={{
            // Soft outer edges so the piece sits in the paper like a wash.
            maskImage: `linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent), linear-gradient(to ${left ? "right" : "left"}, transparent, #000 5%)`,
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
          className="absolute inset-[8%] bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl(art.plate, width)})` }}
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
      {/* Paper tooth over everything, so the art reads as printed on it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: PAPER }}
      />
      {/* Crease: the sheet curves down into the spine, over the art. */}
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-y-0 w-[14%]", left ? "right-0" : "left-0")}
        style={{
          background: `linear-gradient(to ${left ? "left" : "right"}, rgb(40 28 12 / 0.38), rgb(40 28 12 / 0.16) 10%, rgb(255 255 255 / 0.10) 32%, rgb(40 28 12 / 0.04) 55%, transparent)`,
        }}
      />
    </div>
  );
}

const TURN_MS = 620;

/**
 * Phone book: the same open spreads as desktop, turned with a CSS 3D hinge
 * (page-flip's turns stutter on phones). The leaf is the right page of the
 * lower spread; its back is the next spread's left page, so it lands on the
 * left like a real leaf. Drag to turn (it follows the finger), or tap the
 * right / left half.
 */
function PhoneBook({ pages, onChange }: { pages: Page[]; onChange: (spread: number) => void }) {
  const spreadCount = pages.length / 2;
  const leftOf = (s: number) => pages[s * 2];
  const rightOf = (s: number) => pages[s * 2 + 1];
  const [spread, setSpread] = useState(0);
  // dir 1 = forward, -1 = back. p is how far the turn has gone, 0 → 1.
  const [turn, setTurn] = useState<{ dir: 1 | -1; p: number; dragging: boolean } | null>(null);
  const drag = useRef<{ x: number; t: number; w: number; dx: number } | null>(null);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const canTurn = (dir: 1 | -1) => !turn && spread + dir >= 0 && spread + dir < spreadCount;

  const finish = (dir: 1 | -1, done: boolean) => {
    if (done) {
      setSpread(spread + dir);
      onChange(spread + dir);
    }
    setTurn(null);
  };

  const settle = (dir: 1 | -1, done: boolean) => {
    if (reduce.current) return finish(dir, done);
    setTurn({ dir, p: done ? 1 : 0, dragging: false });
  };

  const tapTurn = (dir: 1 | -1) => {
    if (!canTurn(dir)) return;
    // Mount the leaf at rest, then animate it on the next frame.
    setTurn({ dir, p: 0, dragging: true });
    requestAnimationFrame(() => requestAnimationFrame(() => settle(dir, true)));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (turn) return;
    drag.current = { x: e.clientX, t: e.timeStamp, w: e.currentTarget.offsetWidth, dx: 0 };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    d.dx = e.clientX - d.x;
    const dir: 1 | -1 = d.dx < 0 ? 1 : -1;
    if (!turn) {
      if (Math.abs(d.dx) < 8 || !canTurn(dir)) return;
      e.currentTarget.setPointerCapture(e.pointerId);
    } else if (!turn.dragging || turn.dir !== dir) return;
    // A full-width drag carries the leaf all the way over.
    setTurn({ dir, p: Math.min(1, Math.abs(d.dx) / d.w), dragging: true });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (turn?.dragging) {
      // Commit past a third of the way, or on a quick flick.
      const speed = Math.abs(d.dx) / Math.max(1, e.timeStamp - d.t);
      settle(turn.dir, turn.p > 0.33 || speed > 0.5);
    } else if (Math.abs(d.dx) < 8) {
      const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
      tapTurn(x > d.w / 2 ? 1 : -1);
    }
  };

  // The leaf hinges between spreads `a` and `a + 1`: front = right page of
  // `a`, back = left page of `a + 1`. Beneath it: left of `a`, right of `a + 1`.
  const a = turn?.dir === -1 ? spread - 1 : spread;
  // 0° lying on the right, -180° turned over onto the left.
  const angle = turn ? -180 * (turn.dir === 1 ? turn.p : 1 - turn.p) : 0;
  const lift = Math.sin((-angle / 180) * Math.PI);
  const ease = turn?.dragging ? "none" : `transform ${TURN_MS}ms cubic-bezier(0.3, 0.6, 0.25, 1)`;

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="relative flex w-full touch-pan-y select-none [perspective:2200px]"
      style={{ aspectRatio: `${2 * layouts.phone.page.width} / ${layouts.phone.page.height}` }}
    >
      <div className="relative h-full flex-1">
        <Sheet page={leftOf(turn ? a : spread)} width={1080} />
        {/* Shade on the left page as the leaf comes down onto it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_left,rgb(40_28_12/0.4),transparent_75%)]"
          style={{ opacity: turn && angle < -90 ? lift * 0.7 : 0 }}
        />
      </div>
      <div className="relative h-full flex-1">
        <Sheet page={rightOf(turn ? a + 1 : spread)} width={1080} />
        {/* Shadow the lifted leaf casts on the right page. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(40_28_12/0.4),transparent_75%)]"
          style={{ opacity: turn && angle > -90 ? lift * 0.7 : 0 }}
        />

        {turn && (
          <div
            className="absolute inset-0 origin-left [transform-style:preserve-3d]"
            style={{ transform: `rotateY(${angle}deg)`, transition: ease }}
            onTransitionEnd={(e) => e.propertyName === "transform" && finish(turn.dir, turn.p === 1)}
          >
            <div className="absolute inset-0 [backface-visibility:hidden]">
              <Sheet page={rightOf(a)} width={1080} layer={false} />
              {/* Light falls off as the leaf rises. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_left,rgb(40_28_12/0.3),transparent)]"
                style={{ opacity: lift }}
              />
            </div>
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <Sheet page={leftOf(a + 1)} width={1080} layer={false} />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(40_28_12/0.3),transparent)]"
                style={{ opacity: lift }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Sketchbook. Desktop is an open spread turned by `page-flip`, which moves
 * and finally removes the nodes it owns, so React renders those pages into a
 * hidden template and the library gets clones. Phones get PhoneBook.
 */
export function ArtBook({ wallpapers }: { wallpapers: Wallpaper[] }) {
  const spreadPages = useMemo(() => buildPages(wallpapers), [wallpapers]);
  const leftOf = (s: number) => spreadPages[s * 2];
  const template = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const book = useRef<PageFlip | null>(null);

  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState(0);
  // null until mounted: the layout depends on the viewport.
  const [phone, setPhone] = useState<boolean | null>(null);

  useEffect(() => {
    // Landscape phones too: wide but short, and page-flip stutters on phones.
    const query = window.matchMedia("(max-width: 640px), (pointer: coarse) and (max-height: 500px)");
    const sync = () => setPhone(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const layout = phone ? layouts.phone : layouts.spread;

  // Build the page-flip spread on larger screens.
  useEffect(() => {
    if (phone !== false) return;
    let flip: PageFlip | undefined;
    let cancelled = false;
    setCurrent(0);

    import("page-flip").then(({ PageFlip }) => {
      if (cancelled || !template.current || !stage.current) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      flip = new PageFlip(stage.current, {
        ...layouts.spread.page,
        size: "stretch",
        minWidth: 150,
        maxWidth: 3000,
        minHeight: 130,
        maxHeight: 2600,
        // Always an open spread: desktop pieces run across both pages.
        usePortrait: false,
        showCover: false,
        maxShadowOpacity: 0.35,
        flippingTime: reduce ? 1 : 900,
        mobileScrollSupport: true,
        // No corner fold on hover; pages turn on drag, tap or the arrows.
        showPageCorners: false,
      });
      flip.loadFromHTML(
        Array.from(template.current.children, (node) => node.cloneNode(true)) as HTMLElement[],
      );
      flip.on("flip", (e) => setCurrent(e.data));
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

  // `current` is a page index on desktop (page-flip) and a spread on phones.
  const plates = (phone ? leftOf(current) : spreadPages[current])?.plates ?? [];
  const firstPage = (phone ? current * 2 : current - (current % 2)) + 1;

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

        <div className={cn("min-w-0 flex-1", ZOOMS[zoom] > 1 && "overflow-x-auto")}>
          {/* page-flip forces the stage to width:100%, so size this wrapper. */}
          <div
            className="relative isolate mx-auto"
            style={{ width: `calc(${layout.fit} * ${ZOOMS[zoom]})` }}
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
            {phone ? (
              <PhoneBook pages={spreadPages} onChange={setCurrent} />
            ) : (
              // Keyed so a layout switch gets a fresh node page-flip hasn't touched.
              <div key="spread" ref={stage} />
            )}
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

      <p className="mt-4 text-center text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
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
        {phone ? "Swipe or tap the page edge to turn" : "Drag the page to turn"}
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
        {phone === false &&
          spreadPages.map((p) => (
            <div key={p.key}>
              <Sheet page={p} width={2048} />
            </div>
          ))}
      </div>
    </div>
  );
}
