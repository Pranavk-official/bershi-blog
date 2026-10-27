import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { siteConfig } from "@/config/site";

// Shared Open Graph card in the site's scrapbook look: kraft paper desk, a
// taped kraft note with the title, and an optional photo print beside it.

export const ogSize = { width: 1200, height: 630 };

const ink = "#23201b";
const muted = "#6e6557";

const file = (...p: string[]) => readFile(join(process.cwd(), ...p));
const dataUrl = async (path: string, type = "image/png") =>
  `data:${type};base64,${(await file("public", path)).toString("base64")}`;

type Print = { src: string; wide?: boolean; zoom?: number };

export async function ogCard({
  kicker,
  title,
  subtitle,
  print,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  /** A path under /public, shown as a taped print beside the note. */
  print?: Print;
}) {
  const [hand, mono, photo] = await Promise.all([
    file("src/app/_og/PatrickHand-Regular.ttf"),
    file("src/app/_og/CourierPrime-Regular.ttf"),
    print ? dataUrl(print.src) : undefined,
  ]);
  const titleSize = title.length > 48 ? 64 : title.length > 26 ? 80 : 104;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 70px",
          gap: 56,
          backgroundColor: "#f3ece0",
          fontFamily: "Courier Prime",
          color: ink,
          position: "relative",
        }}
      >
        {/* Kraft note with the title. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            position: "relative",
            transform: "rotate(-1.5deg)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "64px 56px 56px",
              backgroundColor: "#c9a27a",
              boxShadow: "0 18px 30px -16px rgba(60,45,25,0.45)",
            }}
          >
            {kicker && (
              <div style={{ display: "flex", fontSize: 24, color: "#4a3b2a", marginBottom: 12 }}>
                {kicker}
              </div>
            )}
            <div
              style={{
                display: "flex",
                fontFamily: "Patrick Hand",
                fontSize: titleSize,
                lineHeight: 1.02,
              }}
            >
              {title}
            </div>
            <svg width="220" height="14" viewBox="0 0 120 8" style={{ marginTop: 10 }}>
              <path
                d="M2 5c14-4 22 2 36-1s24-3 38 0 26 1 42-2"
                fill="none"
                stroke={ink}
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
            {subtitle && (
              <div style={{ display: "flex", marginTop: 26, fontSize: 27, lineHeight: 1.45, maxWidth: 620 }}>
                {subtitle}
              </div>
            )}
          </div>
          {/* Washi tape across the top edge. */}
          <div
            style={{
              position: "absolute",
              top: -18,
              left: "38%",
              width: 170,
              height: 40,
              backgroundColor: "rgba(226,211,178,0.85)",
              transform: "rotate(-4deg)",
            }}
          />
          {/* The smiley sticker. */}
          <div
            style={{
              position: "absolute",
              right: -26,
              bottom: -30,
              width: 104,
              height: 104,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 9999,
              backgroundColor: "#f1b9ae",
              boxShadow: "0 6px 12px -4px rgba(60,45,25,0.35)",
              transform: "rotate(12deg)",
            }}
          >
            <svg width="86" height="86" viewBox="0 0 48 48">
              <g fill="none" stroke={ink} strokeWidth="1.8" strokeLinecap="round">
                <circle cx="24" cy="24" r="21" />
                <path d="M17 18v4M28 21.5q3-3.5 6 0M13 28c5 9 17 9 22 0" />
              </g>
            </svg>
          </div>
        </div>

        {/* Photo print, taped on. */}
        {photo && (
          <div
            style={{
              display: "flex",
              position: "relative",
              padding: print?.wide ? "14px 14px 44px" : "16px 16px 60px",
              backgroundColor: "#ffffff",
              boxShadow: "0 22px 36px -18px rgba(60,45,25,0.5)",
              transform: "rotate(3deg)",
            }}
          >
            {/* Cropped window, so the art is zoomed in by `zoom`. */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                width: print?.wide ? 420 : 340,
                height: print?.wide ? 236 : 340,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
              <img
                src={photo}
                alt=""
                width={(print?.wide ? 420 : 340) * (print?.zoom ?? 1)}
                height={(print?.wide ? 236 : 340) * (print?.zoom ?? 1)}
                style={{ objectFit: "cover", flexShrink: 0 }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: -16,
                left: "32%",
                width: 130,
                height: 34,
                backgroundColor: "rgba(226,211,178,0.85)",
                transform: "rotate(3deg)",
              }}
            />
          </div>
        )}

        <div
          style={{
            position: "absolute",
            left: 70,
            bottom: 30,
            display: "flex",
            fontSize: 22,
            color: muted,
          }}
        >
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>
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
