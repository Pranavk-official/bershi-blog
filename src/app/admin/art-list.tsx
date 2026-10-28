"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

import type { Wallpaper } from "@sections/wallpapers/config/wallpapers";
import { cn } from "@lib/utils";

type Change = { state: "busy"; hidden: boolean } | { state: "done"; hidden: boolean } | { state: "error"; text: string };

/**
 * Everything published, each with a soft delete / restore toggle.
 * DELETE /api/admin/art/:id hides a piece; POST /api/admin/art/:id/restore brings it back.
 */
export function ArtList({ wallpapers, hidden: initiallyHidden, canHide }: { wallpapers: Wallpaper[]; hidden: string[]; canHide: boolean }) {
  const [changes, setChanges] = useState<Record<string, Change>>({});

  const toggle = async (w: Wallpaper, hidden: boolean) => {
    setChanges((c) => ({ ...c, [w.id]: { state: "busy", hidden } }));
    const url = `/api/admin/art/${encodeURIComponent(w.id)}${hidden ? "" : "/restore"}`;
    const res = await fetch(url, { method: hidden ? "DELETE" : "POST" });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    setChanges((c) => ({
      ...c,
      [w.id]: res.ok ? { state: "done", hidden } : { state: "error", text: body.error ?? `That didn't work (${res.status}).` },
    }));
  };

  return (
    <ul className="grid grid-cols-2 items-start gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {wallpapers.map((w) => {
        const change = changes[w.id];
        const hidden = change && change.state !== "error" ? change.hidden : initiallyHidden.includes(w.id);
        const busy = change?.state === "busy";
        return (
          <li key={w.id} className="paper flex flex-col gap-2 p-2 pb-3">
            <div className={cn("relative", w.aspect === "16x9" ? "aspect-video" : "aspect-9/16", hidden && "opacity-40 grayscale")}>
              <Image src={w.src} alt={w.title} fill sizes="240px" className="object-cover" />
              {hidden && (
                <span className="absolute top-2 left-2 bg-foreground px-2 py-0.5 font-hand text-sm text-background">Hidden</span>
              )}
            </div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-hand text-lg leading-tight">{w.title}</p>
                <p className="text-xs text-muted-foreground">
                  {w.collection} · {w.resolution}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggle(w, !hidden)}
                disabled={busy || !canHide}
                aria-label={`${hidden ? "Restore" : "Delete"} ${w.title}`}
                title={canHide ? (hidden ? "Restore to the site" : "Delete from the site (can be restored)") : "Set up Redis to hide art"}
                className="grid size-11 shrink-0 place-items-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              >
                {hidden ? <Eye className="size-4" aria-hidden="true" /> : <EyeOff className="size-4" aria-hidden="true" />}
              </button>
            </div>
            {change && (
              <p role={change.state === "error" ? "alert" : "status"} className={cn("text-xs", change.state === "error" && "text-destructive")}>
                {change.state === "busy" && (change.hidden ? "Hiding…" : "Restoring…")}
                {change.state === "error" && change.text}
                {change.state === "done" && (change.hidden ? "Hidden from the site." : "Back on the site.")}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
