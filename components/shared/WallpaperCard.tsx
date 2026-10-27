"use client";

import Image from "next/image";
import { useState } from "react";
import { Download, Eye, Loader2 } from "lucide-react";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { cn } from "@/lib/utils";
import type { Wallpaper } from "@sections/wallpapers/config/wallpapers";

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  index?: number;
  onPreview?: (wallpaper: Wallpaper) => void;
}

const aspectClass: Record<Wallpaper["aspect"], string> = {
  "16x9": "aspect-video",
  "9x16": "aspect-[9/16]",
};

export function WallpaperCard({ wallpaper, index = 0, onPreview }: WallpaperCardProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    try {
      const res = await fetch(wallpaper.src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ext = wallpaper.src.split(".").pop() ?? "png";
      a.href = url;
      a.download = `${wallpaper.collection}-${wallpaper.title.replace(/\s+/g, "_")}-${wallpaper.aspect}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab so the user can save manually
      window.open(wallpaper.src, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <figure
      className={cn(
        "group/wp relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all",
        "hover:-translate-y-0.5 hover:shadow-lg focus-within:-translate-y-0.5 focus-within:shadow-lg",
      )}
    >
      <div className={cn("relative overflow-hidden", aspectClass[wallpaper.aspect])}>
        <Image
          src={wallpaper.src}
          alt={`${wallpaper.collection} ${wallpaper.title} wallpaper`}
          fill
          sizes={
            wallpaper.aspect === "16x9"
              ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          }
          className="object-cover transition-transform duration-500 group-hover/wp:scale-[1.03]"
          priority={index < 2}
        />

        {/* Gradient scrim on hover/focus for action contrast */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover/wp:opacity-100 group-focus-within/wp:opacity-100"
        />

        {/* Top-left badge */}
        <div className="absolute left-3 top-3 z-10">
          <Badge variant="outline" className="border-white/20 bg-black/40 text-white backdrop-blur-md">
            {wallpaper.aspect}
          </Badge>
        </div>

        {/* Hover action bar */}
        <div
          className={cn(
            "absolute inset-x-3 bottom-3 z-10 flex items-center justify-between gap-2",
            "translate-y-2 opacity-0 transition-all duration-300",
            "group-hover/wp:translate-y-0 group-hover/wp:opacity-100",
            "group-focus-within/wp:translate-y-0 group-focus-within/wp:opacity-100",
          )}
        >
          {onPreview ? (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-9 gap-1.5 bg-white/90 text-black hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                onPreview(wallpaper);
              }}
              aria-label={`Preview ${wallpaper.collection} ${wallpaper.title}`}
            >
              <Eye className="h-4 w-4" aria-hidden />
              Preview
            </Button>
          ) : (
            <span />
          )}
          <Button
            type="button"
            size="sm"
            className="h-9 gap-1.5"
            onClick={handleDownload}
            disabled={downloading}
            aria-label={`Download ${wallpaper.collection} ${wallpaper.title} wallpaper`}
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Download className="h-4 w-4" aria-hidden />
            )}
            {downloading ? "Saving" : "Download"}
          </Button>
        </div>
      </div>

      <figcaption className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {wallpaper.collection} — {wallpaper.title}
          </p>
          <p className="truncate text-xs text-muted-foreground">{wallpaper.resolution}</p>
        </div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="md:hidden"
          onClick={handleDownload}
          disabled={downloading}
          aria-label={`Download ${wallpaper.collection} ${wallpaper.title} wallpaper`}
        >
          {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        </Button>
      </figcaption>
    </figure>
  );
}
