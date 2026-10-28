"use client";

// Art editor on fabric + perfect-freehand, the two libraries delphitools'
// substrata editor is built on. The slider-to-filter mapping and the freehand
// outline-to-path helper are adapted from delphitools
// (https://github.com/1612elphi/delphitools, © 2025-2026 Ruby Morgan Voigt, 0BSD).

import { useCallback, useEffect, useRef, useState } from "react";
import type * as Fabric from "fabric";
import { getStroke } from "perfect-freehand";
import {
  Download,
  FlipHorizontal2,
  FlipVertical2,
  ImageUp,
  Move,
  Pencil,
  RotateCcw,
  RotateCw,
  Scan,
  Trash2,
  Type,
  Upload,
} from "lucide-react";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Slider } from "@components/ui/slider";
import { Switch } from "@components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { cn } from "@lib/utils";

type Aspect = "16x9" | "9x16";
type Tool = "move" | "draw" | "text";
type Format = "webp" | "jpeg" | "png";

// The frame is the export: whatever sits inside it is the wallpaper.
const FRAME: Record<Aspect, { w: number; h: number; widths: number[] }> = {
  "16x9": { w: 768, h: 432, widths: [1920, 2560, 3840] },
  "9x16": { w: 360, h: 640, widths: [1080, 1440, 2160] },
};
const MAX_UPLOAD = 4.3 * 1024 * 1024;
// Publish aims for this size so the art page stays quick to load.
const TARGET_UPLOAD = 1.5 * 1024 * 1024;

const ADJUST = {
  brightness: { label: "Brightness", min: -100, max: 100 },
  contrast: { label: "Contrast", min: -100, max: 100 },
  saturation: { label: "Saturation", min: -100, max: 100 },
  vibrance: { label: "Vibrance", min: -100, max: 100 },
  hue: { label: "Hue", min: -180, max: 180 },
  warmth: { label: "Warmth", min: -100, max: 100 },
  blur: { label: "Blur", min: 0, max: 40 },
  grain: { label: "Grain", min: 0, max: 60 },
} as const;
type Adjust = Record<keyof typeof ADJUST, number> & { grayscale: boolean; sepia: boolean };
const NO_ADJUST: Adjust = {
  brightness: 0, contrast: 0, saturation: 0, vibrance: 0, hue: 0, warmth: 0, blur: 0, grain: 0,
  grayscale: false, sepia: false,
};

/** Fabric filters for the sliders; the scaling follows delphitools' filter-factory. */
function buildFilters(f: typeof Fabric, a: Adjust, size: { width: number; height: number }) {
  const F = f.filters;
  const list: InstanceType<typeof F.BaseFilter>[] = [];
  if (a.brightness) list.push(new F.Brightness({ brightness: a.brightness / 200 }));
  if (a.contrast) list.push(new F.Contrast({ contrast: a.contrast / 200 }));
  if (a.saturation) list.push(new F.Saturation({ saturation: a.saturation / 100 }));
  if (a.vibrance) list.push(new F.Vibrance({ vibrance: a.vibrance / 100 }));
  if (a.hue) list.push(new F.HueRotation({ rotation: a.hue / 180 }));
  if (a.warmth) {
    const t = a.warmth / 100;
    // Gain matrix: more red and less blue to warm, the reverse to cool.
    list.push(new F.ColorMatrix({ matrix: [1 + 0.25 * t, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 - 0.25 * t, 0, 0, 0, 0, 0, 1, 0] }));
  }
  if (a.grayscale) list.push(new F.Grayscale());
  if (a.sepia) list.push(new F.Sepia());
  // Fabric's blur is relative to the image, so convert a pixel radius.
  if (a.blur) list.push(new F.Blur({ blur: Math.min(1, a.blur / (0.12 * Math.min(size.width, size.height))) }));
  if (a.grain) list.push(new F.Noise({ noise: (a.grain / 100) * 255 }));
  return list;
}

/** perfect-freehand outline to an SVG path, from delphitools' freehand.ts. */
function outlineToPathD(outline: number[][]) {
  if (outline.length < 3) return "";
  let d = `M ${outline[0][0]} ${outline[0][1]} Q`;
  for (let i = 1; i < outline.length; i++) {
    const [x, y] = outline[i];
    const [nx, ny] = outline[(i + 1) % outline.length];
    d += ` ${x} ${y} ${(x + nx) / 2} ${(y + ny) / 2}`;
  }
  return d + " Z";
}

/** Largest WebGL texture this device takes; fabric's filters fail above it (delphitools' webgl-limits). */
function maxTexture() {
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    return Math.min(8192, (gl?.getParameter(gl.MAX_TEXTURE_SIZE) as number) || 4096);
  } catch {
    return 4096;
  }
}

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

export function ArtEditor() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<typeof Fabric | null>(null);
  const canvasRef = useRef<Fabric.Canvas | null>(null);
  const imageRef = useRef<Fabric.FabricImage | null>(null);
  const coverRef = useRef(1);
  const fileRef = useRef<HTMLInputElement>(null);

  const [ready, setReady] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [aspect, setAspect] = useState<Aspect>("16x9");
  const [tool, setTool] = useState<Tool>("move");
  const [zoom, setZoom] = useState(1);
  const [adjust, setAdjust] = useState<Adjust>(NO_ADJUST);
  const [ink, setInk] = useState("#23201b");
  const [brush, setBrush] = useState(8);
  const [format, setFormat] = useState<Format>("webp");
  const [quality, setQuality] = useState(90);
  const [width, setWidth] = useState(FRAME["16x9"].widths[1]);
  const [title, setTitle] = useState("");
  const [collection, setCollection] = useState("");
  const [status, setStatus] = useState<{ kind: "busy" | "ok" | "error"; text: string; href?: string } | null>(null);

  const frame = FRAME[aspect];
  const render = () => canvasRef.current?.requestRenderAll();

  // Scale the picture so it covers the frame, then apply the zoom on top.
  const fit = useCallback((z = zoom) => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const quarterTurn = Math.round((img.angle ?? 0) / 90) % 2 !== 0;
    const w = quarterTurn ? img.height : img.width;
    const h = quarterTurn ? img.width : img.height;
    coverRef.current = Math.max(canvas.getWidth() / w, canvas.getHeight() / h);
    img.scale(coverRef.current * z);
    canvas.centerObject(img);
    img.setCoords();
    render();
  }, [zoom]);

  useEffect(() => {
    let disposed = false;
    import("fabric").then((f) => {
      if (disposed || !canvasEl.current) return;
      f.config.configure({ textureSize: maxTexture() });
      fabricRef.current = f;
      canvasRef.current = new f.Canvas(canvasEl.current, {
        width: FRAME["16x9"].w,
        height: FRAME["16x9"].h,
        backgroundColor: "#f8f3ea",
        preserveObjectStacking: true,
      });
      setReady(true);
    });
    return () => {
      disposed = true;
      canvasRef.current?.dispose();
      canvasRef.current = null;
    };
  }, []);

  // Freehand pen and click-to-place text, wired to the current tool.
  useEffect(() => {
    const f = fabricRef.current;
    const canvas = canvasRef.current;
    if (!f || !canvas) return;
    canvas.selection = tool === "move";
    canvas.forEachObject((o) => (o.selectable = tool === "move"));
    canvas.defaultCursor = tool === "move" ? "default" : "crosshair";

    let points: [number, number, number][] = [];
    let live: Fabric.Path | null = null;
    const strokePath = () =>
      new f.Path(outlineToPathD(getStroke(points, { size: brush, thinning: 0.6, smoothing: 0.5, streamline: 0.5, last: true })), {
        fill: ink,
        objectCaching: false,
        selectable: false,
      });

    const down = (e: Fabric.TPointerEventInfo) => {
      const p = e.scenePoint;
      if (tool === "text") {
        const text = new f.IText("Your text", {
          left: p.x,
          top: p.y,
          fill: ink,
          fontSize: 36,
          fontFamily: getComputedStyle(document.body).getPropertyValue("--font-patrick-hand") || "cursive",
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        text.selectAll();
        setTool("move");
      } else if (tool === "draw") {
        points = [[p.x, p.y, (e.e as PointerEvent).pressure || 0.5]];
      }
    };
    const move = (e: Fabric.TPointerEventInfo) => {
      if (tool !== "draw" || !points.length) return;
      points.push([e.scenePoint.x, e.scenePoint.y, (e.e as PointerEvent).pressure || 0.5]);
      if (live) canvas.remove(live);
      live = strokePath();
      canvas.add(live);
    };
    const up = () => {
      if (tool !== "draw" || !points.length) return;
      if (live) canvas.remove(live);
      if (points.length > 1) canvas.add(strokePath());
      points = [];
      live = null;
    };
    canvas.on("mouse:down", down);
    canvas.on("mouse:move", move);
    canvas.on("mouse:up", up);
    return () => {
      canvas.off("mouse:down", down);
      canvas.off("mouse:move", move);
      canvas.off("mouse:up", up);
    };
  }, [tool, ink, brush, ready]);

  // Re-run the filters whenever a slider moves.
  useEffect(() => {
    const f = fabricRef.current;
    const img = imageRef.current;
    if (!f || !img) return;
    img.filters = buildFilters(f, adjust, { width: img.width, height: img.height });
    img.applyFilters();
    render();
  }, [adjust, hasImage]);

  const changeAspect = (next: Aspect) => {
    setAspect(next);
    setWidth(FRAME[next].widths[1]);
    canvasRef.current?.setDimensions({ width: FRAME[next].w, height: FRAME[next].h });
    fit();
  };

  const load = async (file: File) => {
    const f = fabricRef.current;
    const canvas = canvasRef.current;
    if (!f || !canvas || !file.type.startsWith("image/")) return;
    const bitmap = await createImageBitmap(file);
    // Shrink anything bigger than the GPU's texture limit before filtering.
    const cap = maxTexture();
    const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
    const source = document.createElement("canvas");
    source.width = Math.round(bitmap.width * scale);
    source.height = Math.round(bitmap.height * scale);
    source.getContext("2d")!.drawImage(bitmap, 0, 0, source.width, source.height);

    if (imageRef.current) canvas.remove(imageRef.current);
    const img = new f.FabricImage(source, { originX: "center", originY: "center" });
    imageRef.current = img;
    canvas.insertAt(0, img);
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
    setZoom(1);
    setHasImage(true);
    fit(1);
    setStatus(null);
  };

  // Paste an image straight from the clipboard.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const file = Array.from(e.clipboardData?.files ?? []).find((x) => x.type.startsWith("image/"));
      if (file) load(file);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  });

  const rotate = (deg: number) => {
    const img = imageRef.current;
    if (!img) return;
    img.rotate(((img.angle ?? 0) + deg + 360) % 360);
    fit();
  };
  const flip = (axis: "flipX" | "flipY") => {
    const img = imageRef.current;
    if (!img) return;
    img.set(axis, !img[axis]);
    render();
  };
  const deleteSelected = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getActiveObjects().filter((o) => o !== imageRef.current).forEach((o) => canvas.remove(o));
    canvas.discardActiveObject();
    render();
  };
  const reset = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    canvas.getObjects().filter((o) => o !== img).forEach((o) => canvas.remove(o));
    img.set({ angle: 0, flipX: false, flipY: false });
    setAdjust(NO_ADJUST);
    setZoom(1);
    fit(1);
  };

  const exportBlob = async (opts = { format, quality, width }) => {
    const canvas = canvasRef.current!;
    canvas.discardActiveObject();
    const url = canvas.toDataURL({
      format: opts.format,
      quality: opts.quality / 100,
      multiplier: opts.width / canvas.getWidth(),
    });
    return (await fetch(url)).blob();
  };

  /** Steps down until the file fits TARGET_UPLOAD: PNG to WebP, then quality to 60, then width. */
  const compressedBlob = async () => {
    const opts = { format, quality, width };
    for (;;) {
      const blob = await exportBlob(opts);
      const smallerWidth = [...frame.widths].reverse().find((w) => w < opts.width);
      if (blob.size <= TARGET_UPLOAD) return { blob, opts };
      if (opts.format === "png") opts.format = "webp";
      else if (opts.quality > 60) opts.quality = Math.max(60, opts.quality - 10);
      else if (smallerWidth) opts.width = smallerWidth;
      else return { blob, opts }; // smallest settings; the 4.3 MB check below decides
    }
  };

  const download = async () => {
    const blob = await exportBlob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${title || "art"}-${aspect}.${format === "jpeg" ? "jpg" : format}`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const upload = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ kind: "busy", text: "Compressing…" });
    const { blob, opts } = await compressedBlob();
    if (blob.size > MAX_UPLOAD) {
      setStatus({ kind: "error", text: `Even compressed it's ${(blob.size / 1048576).toFixed(1)} MB; the limit is 4.3 MB.` });
      return;
    }
    const saved = `${opts.format.toUpperCase()}, ${opts.width}px${opts.format === "png" ? "" : `, quality ${opts.quality}`}`;
    const form = new FormData();
    form.set("file", new File([blob], `art.${opts.format}`, { type: blob.type }));
    form.set("title", title);
    form.set("collection", collection);
    form.set("aspect", aspect);
    setStatus({ kind: "busy", text: `Committing ${(blob.size / 1048576).toFixed(1)} MB (${saved}) to GitHub…` });
    const res = await fetch("/api/admin/art", { method: "POST", body: form });
    const body = (await res.json().catch(() => ({}))) as { error?: string; commitUrl?: string };
    setStatus(
      res.ok
        ? { kind: "ok", text: `Committed ${(blob.size / 1048576).toFixed(1)} MB (${saved}). It goes live when the deploy finishes, in about a minute.`, href: body.commitUrl }
        : { kind: "error", text: body.error ?? `Upload failed (${res.status}).` },
    );
  };

  const toolButton = (id: Tool, label: string, Icon: typeof Move) => (
    <Button
      type="button"
      size="sm"
      variant={tool === id ? "default" : "outline"}
      aria-pressed={tool === id}
      onClick={() => setTool(id)}
      disabled={!hasImage}
    >
      <Icon aria-hidden="true" /> {label}
    </Button>
  );

  return (
    <form onSubmit={upload} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {toolButton("move", "Move", Move)}
          {toolButton("draw", "Draw", Pencil)}
          {toolButton("text", "Text", Type)}
          <span className="mx-1 w-px self-stretch bg-border" aria-hidden="true" />
          <Button type="button" size="icon-sm" variant="outline" aria-label="Rotate left" disabled={!hasImage} onClick={() => rotate(-90)}><RotateCcw /></Button>
          <Button type="button" size="icon-sm" variant="outline" aria-label="Rotate right" disabled={!hasImage} onClick={() => rotate(90)}><RotateCw /></Button>
          <Button type="button" size="icon-sm" variant="outline" aria-label="Flip horizontally" disabled={!hasImage} onClick={() => flip("flipX")}><FlipHorizontal2 /></Button>
          <Button type="button" size="icon-sm" variant="outline" aria-label="Flip vertically" disabled={!hasImage} onClick={() => flip("flipY")}><FlipVertical2 /></Button>
          <Button type="button" size="icon-sm" variant="outline" aria-label="Fit to frame" disabled={!hasImage} onClick={() => { setZoom(1); fit(1); }}><Scan /></Button>
          <Button type="button" size="icon-sm" variant="outline" aria-label="Delete selected text or drawing" disabled={!hasImage} onClick={deleteSelected}><Trash2 /></Button>
        </div>

        {/* The canvas is the export frame; scroll sideways on narrow screens. */}
        <div
          className="relative max-w-full overflow-auto"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) load(file);
          }}
        >
          <div className="paper inline-block p-2">
            <canvas ref={canvasEl} />
          </div>
          {!hasImage && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={!ready}
              className="absolute inset-2 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-foreground/30 text-muted-foreground hover:text-foreground"
              style={{ width: frame.w, height: frame.h }}
            >
              <ImageUp className="size-8" aria-hidden="true" />
              <span className="font-hand text-2xl">Drop, paste or pick an image</span>
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && load(e.target.files[0])} />

        <div className="flex flex-wrap items-center gap-4">
          <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={!ready}>
            <Upload aria-hidden="true" /> {hasImage ? "Replace image" : "Choose image"}
          </Button>
          <div className="flex min-w-48 flex-1 items-center gap-3">
            <Label htmlFor="zoom" className="shrink-0">Zoom</Label>
            <Slider
              id="zoom"
              min={1}
              max={4}
              step={0.01}
              value={[zoom]}
              disabled={!hasImage}
              onValueChange={([z]) => {
                setZoom(z);
                imageRef.current?.scale(coverRef.current * z);
                render();
              }}
            />
          </div>
          {tool === "draw" || tool === "text" ? (
            <div className="flex items-center gap-3">
              <Label htmlFor="ink">Ink</Label>
              <input id="ink" type="color" value={ink} onChange={(e) => setInk(e.target.value)} className="size-8 cursor-pointer" />
              {tool === "draw" && (
                <>
                  <Label htmlFor="brush">Size</Label>
                  <Slider id="brush" className="w-28" min={2} max={40} value={[brush]} onValueChange={([b]) => setBrush(b)} />
                </>
              )}
            </div>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          Drag the picture to place it in the frame. Text: pick the Text tool and click where it goes.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-4" disabled={!hasImage}>
          <legend className="mb-2 font-hand text-2xl">Adjust</legend>
          {(Object.keys(ADJUST) as (keyof typeof ADJUST)[]).map((key) => (
            <div key={key} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm">
                <Label htmlFor={key}>{ADJUST[key].label}</Label>
                <span className="text-muted-foreground tabular-nums">{adjust[key]}</span>
              </div>
              <Slider
                id={key}
                min={ADJUST[key].min}
                max={ADJUST[key].max}
                value={[adjust[key]]}
                onValueChange={([v]) => setAdjust((a) => ({ ...a, [key]: v }))}
              />
            </div>
          ))}
          <div className="flex gap-6">
            {(["grayscale", "sepia"] as const).map((key) => (
              <div key={key} className="flex items-center gap-2">
                <Switch id={key} checked={adjust[key]} onCheckedChange={(v) => setAdjust((a) => ({ ...a, [key]: v }))} />
                <Label htmlFor={key}>{key === "grayscale" ? "Greyscale" : "Sepia"}</Label>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={reset}>
            <RotateCcw aria-hidden="true" /> Reset everything
          </Button>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 font-hand text-2xl">Details</legend>
          <Field label="Title" htmlFor="title">
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} required />
          </Field>
          <Field label="Collection" htmlFor="collection">
            <Input id="collection" value={collection} onChange={(e) => setCollection(e.target.value)} maxLength={40} placeholder="Goblin" required />
          </Field>
          <Field label="Frame">
            <Select value={aspect} onValueChange={(v) => changeAspect(v as Aspect)}>
              <SelectTrigger aria-label="Frame"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="16x9">Desktop, 16:9</SelectItem>
                <SelectItem value="9x16">Mobile, 9:16</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 font-hand text-2xl">Export</legend>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Format">
              <Select value={format} onValueChange={(v) => setFormat(v as Format)}>
                <SelectTrigger aria-label="Format"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="webp">WebP</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Width">
              <Select value={String(width)} onValueChange={(v) => setWidth(Number(v))}>
                <SelectTrigger aria-label="Width"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {frame.widths.map((w) => (
                    <SelectItem key={w} value={String(w)}>{w}px</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          {format !== "png" && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm">
                <Label htmlFor="quality">Quality</Label>
                <span className="text-muted-foreground tabular-nums">{quality}</span>
              </div>
              <Slider id="quality" min={40} max={100} value={[quality]} onValueChange={([q]) => setQuality(q)} />
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={!hasImage || status?.kind === "busy"}>
              <Upload aria-hidden="true" /> Publish to the site
            </Button>
            <Button type="button" variant="outline" disabled={!hasImage} onClick={download}>
              <Download aria-hidden="true" /> Download
            </Button>
          </div>
          {status && (
            <p role={status.kind === "error" ? "alert" : "status"} className={cn("text-sm", status.kind === "error" && "text-destructive")}>
              {status.text}{" "}
              {status.href && (
                <a href={status.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  See the commit
                </a>
              )}
            </p>
          )}
        </fieldset>
      </div>
    </form>
  );
}
