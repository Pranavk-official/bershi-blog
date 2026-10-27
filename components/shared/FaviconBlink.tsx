"use client";

import { useEffect } from "react";

// Makes the smiley favicon blink every few seconds, and wink now and then.
// Frames are drawn to PNG at runtime and swapped into the icon links:
// browsers don't play animation inside SVG or GIF favicons consistently.

const face = (eyes: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#f1b9ae"/><g fill="none" stroke="#23201b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"><path d="${eyes}M12 28c6 10 18 10 24 0"/></g></svg>`;

const FRAMES = {
  open: face("M17 15v7M31 15v7"),
  closed: face("M14 19.5h6M28 19.5h6"),
  wink: face("M17 15v7M28 20q3-4 6 0"),
};

function toPng(svg: string) {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 64;
      canvas.getContext("2d")!.drawImage(img, 0, 0, 64, 64);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  });
}

export function FaviconBlink() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]'));
    const original = links.map((l) => l.href);
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;

    Promise.all([toPng(FRAMES.open), toPng(FRAMES.closed), toPng(FRAMES.wink)])
      .then(([open, closed, wink]) => {
        if (stopped) return;
        const show = (href: string) => links.forEach((l) => (l.href = href));
        let beat = 0;
        const tick = () => {
          // Every fourth beat is a wink, held a little longer than a blink.
          const isWink = ++beat % 4 === 0;
          show(isWink ? wink : closed);
          timer = setTimeout(() => {
            show(open);
            timer = setTimeout(tick, 2500 + Math.random() * 3000);
          }, isWink ? 600 : 180);
        };
        show(open);
        timer = setTimeout(tick, 2000);
      })
      .catch(() => {});

    return () => {
      stopped = true;
      clearTimeout(timer);
      links.forEach((l, i) => (l.href = original[i]));
    };
  }, []);

  return null;
}
