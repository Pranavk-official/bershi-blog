import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { siteConfig } from "@/config/site";

// Shared Open Graph card: the home hero's collage, rebuilt for a 1200×630
// share image. A flower doodle, the torn kraft note with the title, the
// smiley sticker, a taped print with the site's address written under it,
// and a lined-paper checklist under a star doodle.

export const ogSize = { width: 1200, height: 630 };

const ink = "#23201b";
const kraft = "#c9a27a";
const tape = "rgba(226,211,178,0.88)";
const site = siteConfig.url.replace(/^https?:\/\//, "");

// Same edge as the site's `torn` utility, as SVG points in a 100×100 box:
// Satori clips `clip-path` to the content's size, so the paper is a stretched
// background image instead.
const torn =
  "0,2 6,0 14,1.5 22,0 31,1.8 40,0.3 49,1.6 58,0 67,1.4 76,0.2 85,1.7 93,0 100,1.5 99,12 100,25 98.8,38 100,51 99,64 100,77 98.9,89 100,98 94,100 86,98.4 77,100 68,98.6 59,100 50,98.2 41,100 32,98.5 23,100 14,98.3 6,100 0,98.5 1,88 0,75 1.2,62 0,49 1,36 0,23 1.1,11";

const tornPaper = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="${torn}" fill="${kraft}"/></svg>`,
)}")`;

// No paper grain here: noise is random per pixel, which PNG can't compress.
// With it the card weighed 1.3 MB, past what WhatsApp and others will show in
// a link preview; without it each card is under 200 KB.

const file = (...p: string[]) => readFile(join(process.cwd(), ...p));
const dataUrl = async (path: string) =>
  `data:image/png;base64,${(await file("public", path)).toString("base64")}`;

const stroke = { fill: "none", stroke: ink, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Tape({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: "absolute", height: 34, backgroundColor: tape, ...style }} />;
}

type Print = { src: string; wide?: boolean; zoom?: number };

export async function ogCard({
  title,
  subtitle,
  print,
  list,
}: {
  /** Use "\n" to break lines. */
  title: string;
  subtitle?: string;
  /** A path under /public, taped on beside the note. */
  print?: Print;
  /** The lined-paper checklist; `active` gets the highlighter. */
  list?: { heading: string; items: string[]; active?: string };
}) {
  const [hand, mono, photo] = await Promise.all([
    file("src/app/_og/PatrickHand-Regular.ttf"),
    file("src/app/_og/CourierPrime-Regular.ttf"),
    print ? dataUrl(print.src) : undefined,
  ]);

  const lines = title.split("\n");
  const longest = Math.max(...lines.map((l) => l.length));
  const titleSize = longest > 30 ? 58 : longest > 18 ? 72 : 92;
  const printW = print?.wide ? 380 : 290;
  const printH = print?.wide ? 214 : 290;
  const zoom = print?.zoom ?? 1;
  // Satori doesn't grow `flex: 1` reliably, so the note takes what is left:
  // 1200 minus the side padding, the flower, the gaps and the other pieces.
  const pieces = [56, print && printW + 24, list && 232].filter(Boolean) as number[];
  const noteW = 1200 - 88 - pieces.reduce((a, w) => a + w, 0) - 30 * pieces.length;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 44px",
          gap: 30,
          backgroundColor: "#f3ece0",
          fontFamily: "Courier Prime",
          color: ink,
          position: "relative",
        }}
      >
        {/* Flower doodle, as beside the home hero. */}
        <svg width="56" height="150" viewBox="0 0 60 150" style={{ flexShrink: 0, marginTop: 40 }}>
          <g {...stroke}>
            <path d="M22 30c2 40-4 70 6 115M40 52c-6 18-12 34-12 60M28 145c-6-14-14-20-22-22M28 120c8-10 18-12 26-10" />
            <circle cx="22" cy="22" r="4" />
            <path d="M22 18c-4-10 8-10 4 0M26 21c10-4 10 8 0 4M24 26c4 10-8 10-4 0M18 23c-10 4-10-8 0-4M19 19c-6-6 2-10 3-2M25 19c6-6 10 2 2 3M25 25c6 6-2 10-3 2M19 25c-6 6-10-2-2-3" />
            <circle cx="42" cy="46" r="3" />
            <path d="M42 43c-3-8 6-8 3 0M45 46c8-3 8 6 0 3M42 49c3 8-6 8-3 0M39 46c-8 3-8-6 0-3" />
          </g>
        </svg>

        {/* Torn kraft note with the title. */}
        <div style={{ display: "flex", width: noteW, flexShrink: 0, position: "relative", transform: "rotate(-1.2deg)" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: noteW,
              padding: "58px 44px 50px",
              backgroundImage: tornPaper,
              backgroundSize: "100% 100%",
            }}
          >
            {lines.map((line) => (
              <div key={line} style={{ display: "flex", fontFamily: "Patrick Hand", fontSize: titleSize, lineHeight: 1.04 }}>
                {line}
              </div>
            ))}
            <svg width="200" height="12" viewBox="0 0 120 8" style={{ marginTop: 8 }}>
              <path {...stroke} strokeWidth={2.4} d="M2 5c14-4 22 2 36-1s24-3 38 0 26 1 42-2" />
            </svg>
            {subtitle && (
              <div style={{ display: "flex", marginTop: 22, fontSize: 22, lineHeight: 1.5 }}>{subtitle}</div>
            )}
          </div>
          <Tape style={{ top: -14, left: "34%", width: 150, transform: "rotate(-3deg)" }} />
          {/* Smiley sticker on the note's corner. */}
          <div
            style={{
              position: "absolute",
              top: -28,
              right: -22,
              width: 92,
              height: 92,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 9999,
              backgroundColor: "#f1b9ae",
              boxShadow: "0 5px 10px -4px rgba(60,45,25,0.4)",
              transform: "rotate(12deg)",
            }}
          >
            <svg width="76" height="76" viewBox="0 0 48 48">
              <g {...stroke} strokeWidth={1.8}>
                <circle cx="24" cy="24" r="21" />
                <path d="M17 18v4M28 21.5q3-3.5 6 0M13 28c5 9 17 9 22 0" />
              </g>
            </svg>
          </div>
        </div>

        {/* Taped print with the address written in its margin. */}
        {photo && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              position: "relative",
              padding: "12px 12px 0",
              backgroundColor: "#ffffff",
              boxShadow: "0 18px 28px -16px rgba(60,45,25,0.55)",
              transform: "rotate(2.5deg)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", width: printW, height: printH }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
              <img src={photo} alt="" width={printW * zoom} height={printH * zoom} style={{ objectFit: "cover", flexShrink: 0 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 14px", fontFamily: "Patrick Hand", fontSize: 28 }}>
              {site}
            </div>
            <Tape style={{ top: -15, left: "30%", width: 120, transform: "rotate(4deg)" }} />
          </div>
        )}

        {/* Star doodle over a lined-paper checklist. */}
        {list && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 232 }}>
            <svg width="40" height="40" viewBox="0 0 32 32" style={{ marginBottom: 14 }}>
              <path {...stroke} d="M16 3v26M4 10l24 12M28 9 5 23" />
            </svg>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                position: "relative",
                padding: "18px 22px 26px",
                backgroundColor: "#fbfaf6",
                boxShadow: "0 12px 20px -12px rgba(60,45,25,0.45)",
                transform: "rotate(3deg)",
                fontFamily: "Patrick Hand",
              }}
            >
              {/* Ruled lines. */}
              {Array.from({ length: list.items.length + 2 }, (_, i) => (
                <div
                  key={i}
                  style={{ position: "absolute", left: 0, right: 0, top: 50 + i * 38, height: 1.5, backgroundColor: "rgba(120,150,190,0.38)" }}
                />
              ))}
              <div style={{ display: "flex", fontSize: 30, textDecoration: "underline" }}>{list.heading}</div>
              {list.items.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, height: 38, fontSize: 26 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <rect x="1" y="1" width="16" height="16" fill="none" stroke={ink} strokeWidth="1.4" />
                    <path d="M4.5 9.5l3 3 6-7" fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <div
                    style={{
                      display: "flex",
                      padding: "0 4px",
                      backgroundColor: item === list.active ? "#f4dc7c" : "transparent",
                    }}
                  >
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Patrick Hand", data: hand, style: "normal", weight: 400 },
        { name: "Courier Prime", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
