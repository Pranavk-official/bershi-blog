"use client";

// Art editor on fabric + perfect-freehand, the two libraries delphitools'
// substrata editor is built on. The slider-to-filter mapping and the freehand
// outline-to-path helper are adapted from delphitools
// (https://github.com/1612elphi/delphitools, © 2025-2026 Ruby Morgan Voigt, 0BSD).

import { useCallback, useEffect, useRef, useState } from "react";
import type * as Fabric from "fabric";
import { getStroke } from "perfect-freehand";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ClipboardPaste,
  Download,
  Eraser,
  FlipHorizontal2,
  FlipVertical2,
  ImageUp,
  Move,
  Italic,
  Pencil,
  Redo2,
  RotateCcw,
  RotateCw,
  Scan,
  Trash2,
  Type,
  Undo2,
  Upload,
} from "lucide-react";

import { Slider } from "@components/ui/slider";
import { cn } from "@lib/utils";

type Aspect = "16x9" | "9x16";
type Tool = "move" | "draw" | "erase" | "text";
type Format = "webp" | "jpeg" | "png";

// The frame is the export: whatever sits inside it is the wallpaper.
const FRAME: Record<Aspect, { w: number; h: number; widths: number[] }> = {
  "16x9": { w: 768, h: 432, widths: [1920, 2560, 3840] },
  "9x16": { w: 360, h: 640, widths: [1080, 1440, 2160] },
};
const MAX_UPLOAD = 4.3 * 1024 * 1024;
// Publish aims for this size so the art page stays quick to load.
const TARGET_UPLOAD = 1.5 * 1024 * 1024;

// Text faces the site already loads (next/font variables on <body>), plus a system serif.
const FONTS = {
  hand: { label: "Handwritten", css: "--font-patrick-hand", fallback: "cursive" },
  type: { label: "Typewriter", css: "--font-courier-prime", fallback: "monospace" },
  sans: { label: "Sans", css: "--font-geist-sans", fallback: "sans-serif" },
  display: { label: "Display", css: "--font-outfit", fallback: "sans-serif" },
  mono: { label: "Mono", css: "--font-jetbrains-mono", fallback: "monospace" },
  serif: { label: "Serif", css: "", fallback: "Georgia, serif" },
} as const;
type FontKey = keyof typeof FONTS;
const fontFamily = (key: FontKey) =>
  (FONTS[key].css && getComputedStyle(document.body).getPropertyValue(FONTS[key].css).trim()) ||
  FONTS[key].fallback;
/** CSS font-family for previews in the page (the canvas needs the resolved name instead). */
const fontFamilyCss = (key: FontKey) => (FONTS[key].css ? `var(${FONTS[key].css}), ${FONTS[key].fallback}` : FONTS[key].fallback);
type TextStyle = { font: FontKey; size: number; bold: boolean; italic: boolean; align: "left" | "center" | "right" };
const DEFAULT_TEXT: TextStyle = { font: "hand", size: 36, bold: false, italic: false, align: "left" };

/** One undo step: the drawings and text, where the picture sits, and the sliders. */
type Snapshot = {
  objects: Record<string, unknown>[];
  image: Pick<Fabric.FabricImage, "left" | "top" | "scaleX" | "scaleY" | "angle" | "flipX" | "flipY">;
  zoom: number;
  adjust: Adjust;
};

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
type Adjust = Record<keyof typeof ADJUST, number> & {
  grayscale: boolean;
  sepia: boolean;
};
const NO_ADJUST: Adjust = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  vibrance: 0,
  hue: 0,
  warmth: 0,
  blur: 0,
  grain: 0,
  grayscale: false,
  sepia: false,
};

/** Fabric filters for the sliders; the scaling follows delphitools' filter-factory. */
function buildFilters(
  f: typeof Fabric,
  a: Adjust,
  size: { width: number; height: number },
) {
  const F = f.filters;
  const list: InstanceType<typeof F.BaseFilter>[] = [];
  if (a.brightness)
    list.push(new F.Brightness({ brightness: a.brightness / 200 }));
  if (a.contrast) list.push(new F.Contrast({ contrast: a.contrast / 200 }));
  if (a.saturation)
    list.push(new F.Saturation({ saturation: a.saturation / 100 }));
  if (a.vibrance) list.push(new F.Vibrance({ vibrance: a.vibrance / 100 }));
  if (a.hue) list.push(new F.HueRotation({ rotation: a.hue / 180 }));
  if (a.warmth) {
    const t = a.warmth / 100;
    // Gain matrix: more red and less blue to warm, the reverse to cool.
    list.push(
      new F.ColorMatrix({
        matrix: [
          1 + 0.25 * t,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          0,
          1 - 0.25 * t,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
        ],
      }),
    );
  }
  if (a.grayscale) list.push(new F.Grayscale());
  if (a.sepia) list.push(new F.Sepia());
  // Fabric's blur is relative to the image, so convert a pixel radius.
  if (a.blur)
    list.push(
      new F.Blur({
        blur: Math.min(1, a.blur / (0.12 * Math.min(size.width, size.height))),
      }),
    );
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
    return Math.min(
      8192,
      (gl?.getParameter(gl.MAX_TEXTURE_SIZE) as number) || 4096,
    );
  } catch {
    return 4096;
  }
}

// Controls after delphitools' tool panels: a bordered panel with a header
// strip, rows split into cells, segmented toggles and a full-row fill slider.
const cellButton =
  "flex min-h-11 w-full items-center justify-center gap-2 px-2 text-sm transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-50";
const activeCell = "bg-primary text-primary-foreground hover:bg-primary/90";

function Panel({
  title,
  disabled,
  children,
}: {
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset
      disabled={disabled}
      className="min-w-0 border-2 border-foreground/70 bg-card disabled:opacity-60"
    >
      {/* Floated so the legend sits inside the box as a header strip. */}
      <legend className="float-left w-full border-b-2 border-foreground/70 bg-secondary px-3 py-1.5 font-hand text-lg leading-none">
        {title}
      </legend>
      <div className="clear-both divide-y divide-foreground/20">{children}</div>
    </fieldset>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: React.ReactNode }[];
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="grid divide-x divide-foreground/20"
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(cellButton, value === o.value && activeCell)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SliderRow({
  label,
  value,
  display,
  min,
  max,
  step = 1,
  onChange,
  onCommit,
}: {
  label: string;
  value: number;
  display?: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  /** When the drag ends: one undo step per drag, not per pixel. */
  onCommit?: () => void;
}) {
  return (
    <div className="grid min-h-11 grid-cols-[6.5rem_minmax(0,1fr)_3.75rem]">
      <span className="flex items-center px-3 text-sm">{label}</span>
      <div className="relative flex border-x border-foreground/20">
        {/* Sliders that go negative get a centre mark instead of a fill, so 0 doesn't read as half. */}
        {min < 0 && (
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-foreground/15"
          />
        )}
        <Slider
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          onValueCommit={onCommit}
          className={cn(
            "self-stretch [&_[data-slot=slider-range]]:bg-primary/25 [&_[data-slot=slider-thumb]]:h-11 [&_[data-slot=slider-thumb]]:w-1.5 [&_[data-slot=slider-thumb]]:rounded-none [&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-thumb]]:bg-primary [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-track]]:h-full! [&_[data-slot=slider-track]]:rounded-none [&_[data-slot=slider-track]]:bg-transparent",
            min < 0 && "[&_[data-slot=slider-range]]:bg-transparent",
          )}
        />
      </div>
      <span className="flex items-center justify-end px-3 text-sm tabular-nums">
        {display ?? value}
      </span>
    </div>
  );
}

function TextRow({
  id,
  label,
  value,
  onChange,
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.ComponentProps<"input">, "onChange">) {
  return (
    <div className="grid min-h-11 grid-cols-[6.5rem_minmax(0,1fr)]">
      <label htmlFor={id} className="flex items-center px-3 text-sm">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="min-w-0 border-l border-foreground/20 bg-transparent px-3 text-sm outline-none focus-visible:bg-secondary"
        {...rest}
      />
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="px-3 py-2 text-xs text-muted-foreground">{children}</p>;
}

export function ArtEditor() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<typeof Fabric | null>(null);
  const canvasRef = useRef<Fabric.Canvas | null>(null);
  const imageRef = useRef<Fabric.FabricImage | null>(null);
  const coverRef = useRef(1);
  const fileRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [aspect, setAspect] = useState<Aspect>("16x9");
  const [tool, setTool] = useState<Tool>("move");
  const [zoom, setZoom] = useState(1);
  const [adjust, setAdjust] = useState<Adjust>(NO_ADJUST);
  const [ink, setInk] = useState("#23201b");
  const [textStyle, setTextStyle] = useState<TextStyle>(DEFAULT_TEXT);
  const [activeText, setActiveText] = useState<Fabric.IText | null>(null);
  const [steps, setSteps] = useState({ undo: 0, redo: 0 });
  // Refs mirror state the history reads, so a snapshot never sees a stale render.
  const zoomRef = useRef(1);
  const adjustRef = useRef<Adjust>(NO_ADJUST);
  const history = useRef<{ past: Snapshot[]; present: Snapshot | null; future: Snapshot[] }>({
    past: [],
    present: null,
    future: [],
  });
  const [brush, setBrush] = useState(8);
  const [format, setFormat] = useState<Format>("webp");
  const [quality, setQuality] = useState(90);
  const [width, setWidth] = useState(FRAME["16x9"].widths[1]);
  const [title, setTitle] = useState("");
  const [collection, setCollection] = useState("");
  const [status, setStatus] = useState<{
    kind: "busy" | "ok" | "error";
    text: string;
    href?: string;
  } | null>(null);

  const frame = FRAME[aspect];
  const render = () => canvasRef.current?.requestRenderAll();

  const changeZoom = (z: number) => {
    zoomRef.current = z;
    setZoom(z);
  };
  const changeAdjust = (next: Adjust) => {
    adjustRef.current = next;
    setAdjust(next);
  };

  const snapshot = (): Snapshot | null => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return null;
    return {
      objects: canvas.getObjects().filter((o) => o !== img).map((o) => o.toObject()),
      image: { left: img.left, top: img.top, scaleX: img.scaleX, scaleY: img.scaleY, angle: img.angle, flipX: img.flipX, flipY: img.flipY },
      zoom: zoomRef.current,
      adjust: adjustRef.current,
    };
  };
  const syncSteps = () => setSteps({ undo: history.current.past.length, redo: history.current.future.length });

  /** Records the canvas as it is now as one undo step. */
  const commit = () => {
    const now = snapshot();
    if (!now) return;
    const h = history.current;
    if (h.present) h.past.push(h.present);
    if (h.past.length > 100) h.past.shift(); // ponytail: 100 steps; a big image edit session never gets near it
    h.present = now;
    h.future = [];
    syncSteps();
  };

  const restore = async (s: Snapshot) => {
    const f = fabricRef.current;
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!f || !canvas || !img) return;
    canvas.discardActiveObject();
    canvas.getObjects().filter((o) => o !== img).forEach((o) => canvas.remove(o));
    const objects = await f.util.enlivenObjects<Fabric.FabricObject>(s.objects);
    objects.forEach((o) => {
      o.selectable = tool === "move";
      canvas.add(o);
    });
    img.set(s.image);
    img.setCoords();
    changeZoom(s.zoom);
    changeAdjust(s.adjust);
    render();
  };
  const undo = () => {
    const h = history.current;
    const prev = h.past.pop();
    if (!prev || !h.present) return;
    h.future.push(h.present);
    h.present = prev;
    syncSteps();
    restore(prev);
  };
  const redo = () => {
    const h = history.current;
    const next = h.future.pop();
    if (!next || !h.present) return;
    h.past.push(h.present);
    h.present = next;
    syncSteps();
    restore(next);
  };

  // Scale the picture so it covers the frame, then apply the zoom on top.
  const fit = useCallback(
    (z = zoom) => {
      const img = imageRef.current;
      const canvas = canvasRef.current;
      if (!img || !canvas) return;
      const quarterTurn = Math.round((img.angle ?? 0) / 90) % 2 !== 0;
      const w = quarterTurn ? img.height : img.width;
      const h = quarterTurn ? img.width : img.height;
      coverRef.current = Math.max(
        canvas.getWidth() / w,
        canvas.getHeight() / h,
      );
      img.scale(coverRef.current * z);
      canvas.centerObject(img);
      img.setCoords();
      render();
    },
    [zoom],
  );

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

  // Pen, eraser and click-to-place text, wired to the current tool.
  useEffect(() => {
    const f = fabricRef.current;
    const canvas = canvasRef.current;
    if (!f || !canvas) return;
    canvas.selection = tool === "move";
    canvas.forEachObject((o) => (o.selectable = tool === "move"));
    canvas.defaultCursor = tool === "move" ? "default" : "crosshair";
    canvas.hoverCursor = tool === "move" ? "move" : "crosshair";

    let points: [number, number, number][] = [];
    let live: Fabric.Path | null = null;
    let erasing = false;
    let erased = false;
    const strokePath = () =>
      new f.Path(
        outlineToPathD(getStroke(points, { size: brush, thinning: 0.6, smoothing: 0.5, streamline: 0.5, last: true })),
        { fill: ink, objectCaching: false, selectable: false },
      );
    // The eraser takes whole pen strokes, and only where the stroke's own pixels are under the pointer.
    const eraseAt = (e: Fabric.TPointerEventInfo) => {
      const { x, y } = e.viewportPoint;
      for (const o of canvas.getObjects()) {
        if (o instanceof f.Path && o.containsPoint(e.scenePoint) && !canvas.isTargetTransparent(o, x, y)) {
          canvas.remove(o);
          erased = true;
        }
      }
    };

    const down = (e: Fabric.TPointerEventInfo) => {
      const p = e.scenePoint;
      if (tool === "text") {
        const text = new f.IText("Your text", {
          left: p.x,
          top: p.y,
          fill: ink,
          fontSize: textStyle.size,
          fontFamily: fontFamily(textStyle.font),
          fontWeight: textStyle.bold ? "bold" : "normal",
          fontStyle: textStyle.italic ? "italic" : "normal",
          textAlign: textStyle.align,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        text.selectAll();
        setTool("move");
        commit();
      } else if (tool === "draw") {
        points = [[p.x, p.y, (e.e as PointerEvent).pressure || 0.5]];
      } else if (tool === "erase") {
        erasing = true;
        eraseAt(e);
      }
    };
    const move = (e: Fabric.TPointerEventInfo) => {
      if (tool === "erase" && erasing) return eraseAt(e);
      if (tool !== "draw" || !points.length) return;
      points.push([e.scenePoint.x, e.scenePoint.y, (e.e as PointerEvent).pressure || 0.5]);
      if (live) canvas.remove(live);
      live = strokePath();
      canvas.add(live);
    };
    const up = () => {
      if (tool === "erase") {
        erasing = false;
        if (erased) commit();
        erased = false;
        return;
      }
      if (tool !== "draw" || !points.length) return;
      if (live) canvas.remove(live);
      if (points.length > 1) {
        canvas.add(strokePath());
        commit();
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- commit reads refs only
  }, [tool, ink, brush, textStyle, ready]);

  // Moves, resizes and text edits each make one undo step; the text panel follows the selection.
  useEffect(() => {
    const f = fabricRef.current;
    const canvas = canvasRef.current;
    if (!f || !canvas) return;
    const onSelect = () => {
      const o = canvas.getActiveObject();
      const text = o instanceof f.IText ? o : null;
      setActiveText(text);
      if (!text) return;
      const font = (Object.keys(FONTS) as FontKey[]).find((k) => fontFamily(k) === text.fontFamily) ?? "hand";
      setTextStyle({
        font,
        size: Math.round(text.fontSize),
        bold: text.fontWeight === "bold",
        italic: text.fontStyle === "italic",
        align: (text.textAlign as TextStyle["align"]) ?? "left",
      });
      if (typeof text.fill === "string") setInk(text.fill);
    };
    const onCleared = () => setActiveText(null);
    const onChange = () => commit();
    canvas.on("selection:created", onSelect);
    canvas.on("selection:updated", onSelect);
    canvas.on("selection:cleared", onCleared);
    canvas.on("object:modified", onChange);
    canvas.on("text:editing:exited", onChange);
    return () => {
      canvas.off("selection:created", onSelect);
      canvas.off("selection:updated", onSelect);
      canvas.off("selection:cleared", onCleared);
      canvas.off("object:modified", onChange);
      canvas.off("text:editing:exited", onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- commit reads refs only
  }, [ready]);

  /** Applies a text style to the selected text box (if any) and to new text. */
  const styleText = (patch: Partial<TextStyle> & { fill?: string }) => {
    const { fill, ...style } = patch;
    if (fill) setInk(fill);
    const next = { ...textStyle, ...style };
    setTextStyle(next);
    if (!activeText) return;
    activeText.set({
      ...(fill ? { fill } : {}),
      fontSize: next.size,
      fontFamily: fontFamily(next.font),
      fontWeight: next.bold ? "bold" : "normal",
      fontStyle: next.italic ? "italic" : "normal",
      textAlign: next.align,
    });
    activeText.initDimensions();
    activeText.setCoords();
    render();
  };

  // Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y, except while typing in a field or a text box.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || !imageRef.current) return;
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [contenteditable]") || activeText?.isEditing) return;
      const key = e.key.toLowerCase();
      if (key === "z" && !e.shiftKey) undo();
      else if ((key === "z" && e.shiftKey) || key === "y") redo();
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Re-run the filters whenever a slider moves.
  useEffect(() => {
    const f = fabricRef.current;
    const img = imageRef.current;
    if (!f || !img) return;
    img.filters = buildFilters(f, adjust, {
      width: img.width,
      height: img.height,
    });
    img.applyFilters();
    render();
  }, [adjust, hasImage]);

  // Show the frame at the column's width. Only the CSS size changes: the
  // canvas keeps the frame's pixel size, so exports and pointer maths hold.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const fitDisplay = () => {
      const { w, h } = FRAME[aspect];
      const shown = Math.min(w, wrap.clientWidth - 16); // minus the paper's p-2
      canvas.setDimensions(
        { width: shown, height: (shown * h) / w },
        { cssOnly: true },
      );
      canvas.calcOffset();
    };
    fitDisplay();
    const observer = new ResizeObserver(fitDisplay);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [aspect, ready]);

  const changeAspect = (next: Aspect) => {
    setAspect(next);
    setWidth(FRAME[next].widths[1]);
    canvasRef.current?.setDimensions({
      width: FRAME[next].w,
      height: FRAME[next].h,
    });
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
    source
      .getContext("2d")!
      .drawImage(bitmap, 0, 0, source.width, source.height);

    if (imageRef.current) canvas.remove(imageRef.current);
    const img = new f.FabricImage(source, {
      originX: "center",
      originY: "center",
    });
    imageRef.current = img;
    canvas.insertAt(0, img);
    if (!title)
      setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
    changeZoom(1);
    setHasImage(true);
    fit(1);
    setStatus(null);
    history.current = { past: [], present: null, future: [] };
    commit();
  };

  // Paste an image straight from the clipboard.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const file = Array.from(e.clipboardData?.files ?? []).find((x) =>
        x.type.startsWith("image/"),
      );
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
    commit();
  };
  const flip = (axis: "flipX" | "flipY") => {
    const img = imageRef.current;
    if (!img) return;
    img.set(axis, !img[axis]);
    render();
    commit();
  };
  const deleteSelected = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas
      .getActiveObjects()
      .filter((o) => o !== imageRef.current)
      .forEach((o) => canvas.remove(o));
    canvas.discardActiveObject();
    render();
    commit();
  };
  const reset = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    canvas
      .getObjects()
      .filter((o) => o !== img)
      .forEach((o) => canvas.remove(o));
    img.set({ angle: 0, flipX: false, flipY: false });
    changeAdjust(NO_ADJUST);
    changeZoom(1);
    fit(1);
    commit(); // reset is a step too, so it can be undone
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
      const smallerWidth = [...frame.widths]
        .reverse()
        .find((w) => w < opts.width);
      if (blob.size <= TARGET_UPLOAD) return { blob, opts };
      if (opts.format === "png") opts.format = "webp";
      else if (opts.quality > 60)
        opts.quality = Math.max(60, opts.quality - 10);
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
      setStatus({
        kind: "error",
        text: `Even compressed it's ${(blob.size / 1048576).toFixed(1)} MB; the limit is 4.3 MB.`,
      });
      return;
    }
    const saved = `${opts.format.toUpperCase()}, ${opts.width}px${opts.format === "png" ? "" : `, quality ${opts.quality}`}`;
    const form = new FormData();
    form.set(
      "file",
      new File([blob], `art.${opts.format}`, { type: blob.type }),
    );
    form.set("title", title);
    form.set("collection", collection);
    form.set("aspect", aspect);
    setStatus({
      kind: "busy",
      text: `Committing ${(blob.size / 1048576).toFixed(1)} MB (${saved}) to GitHub…`,
    });
    const res = await fetch("/api/admin/art", { method: "POST", body: form });
    const body = (await res.json().catch(() => ({}))) as {
      error?: string;
      commitUrl?: string;
    };
    setStatus(
      res.ok
        ? {
            kind: "ok",
            text: `Committed ${(blob.size / 1048576).toFixed(1)} MB (${saved}). It goes live when the deploy finishes, in about a minute.`,
            href: body.commitUrl,
          }
        : {
            kind: "error",
            text: body.error ?? `Upload failed (${res.status}).`,
          },
    );
  };

  // Paste from the clipboard via the button (Ctrl+V works anywhere on the page too).
  const pasteImage = async () => {
    try {
      for (const item of await navigator.clipboard.read()) {
        const type = item.types.find((t) => t.startsWith("image/"));
        if (type)
          return load(new File([await item.getType(type)], "pasted", { type }));
      }
      setStatus({ kind: "error", text: "There's no image on the clipboard." });
    } catch {
      setStatus({
        kind: "error",
        text: "The browser blocked clipboard access. Press Ctrl+V instead.",
      });
    }
  };

  const iconCell = (label: string, Icon: typeof Move, onClick: () => void, disabled = false) => (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cellButton}
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );

  return (
    <form
      onSubmit={upload}
      className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"
    >
      <div className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-6">
        {/* The canvas is the export frame, shown scaled down to fit the column. */}
        <div
          ref={wrapRef}
          className="w-full"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) load(file);
          }}
        >
          <div className="paper relative mx-auto w-fit p-2">
            <canvas ref={canvasEl} />
            {!hasImage && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={!ready}
                className="absolute inset-2 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-foreground/30 p-4 text-center text-muted-foreground hover:text-foreground"
              >
                <ImageUp className="size-8" aria-hidden="true" />
                <span className="font-hand text-2xl">
                  Drop your artwork here
                </span>
              </button>
            )}
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => e.target.files?.[0] && load(e.target.files[0])}
        />
        <div className="mx-auto grid w-full max-w-sm grid-cols-2 divide-x divide-foreground/20 border-2 border-foreground/70 bg-card">
          <button
            type="button"
            className={cellButton}
            disabled={!ready}
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="size-4" aria-hidden="true" />{" "}
            {hasImage ? "Replace" : "Upload"}
          </button>
          <button
            type="button"
            className={cellButton}
            disabled={!ready}
            onClick={pasteImage}
          >
            <ClipboardPaste className="size-4" aria-hidden="true" /> Paste
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Panel title="Tools" disabled={!hasImage}>
          <Segmented
            label="Tool"
            value={tool}
            onChange={setTool}
            options={[
              {
                value: "move",
                label: (
                  <>
                    <Move className="size-4" aria-hidden="true" /> Move
                  </>
                ),
              },
              {
                value: "draw",
                label: (
                  <>
                    <Pencil className="size-4" aria-hidden="true" /> Draw
                  </>
                ),
              },
              {
                value: "erase",
                label: (
                  <>
                    <Eraser className="size-4" aria-hidden="true" /> Erase
                  </>
                ),
              },
              {
                value: "text",
                label: (
                  <>
                    <Type className="size-4" aria-hidden="true" /> Text
                  </>
                ),
              },
            ]}
          />
          <div className="grid grid-cols-8 divide-x divide-foreground/20">
            {iconCell("Undo (Ctrl+Z)", Undo2, undo, steps.undo === 0)}
            {iconCell("Redo (Ctrl+Shift+Z)", Redo2, redo, steps.redo === 0)}
            {iconCell("Rotate left", RotateCcw, () => rotate(-90))}
            {iconCell("Rotate right", RotateCw, () => rotate(90))}
            {iconCell("Flip horizontally", FlipHorizontal2, () =>
              flip("flipX"),
            )}
            {iconCell("Flip vertically", FlipVertical2, () => flip("flipY"))}
            {iconCell("Fit to frame", Scan, () => {
              changeZoom(1);
              fit(1);
              commit();
            })}
            {iconCell(
              "Delete selected text or drawing",
              Trash2,
              deleteSelected,
            )}
          </div>
          <SliderRow
            label="Zoom"
            value={zoom}
            display={`${Math.round(zoom * 100)}%`}
            min={1}
            max={4}
            step={0.01}
            onChange={(z) => {
              changeZoom(z);
              imageRef.current?.scale(coverRef.current * z);
              render();
            }}
            onCommit={commit}
          />
          {(tool === "draw" || tool === "text" || activeText) && (
            <div className="grid min-h-11 grid-cols-[6.5rem_minmax(0,1fr)]">
              <label htmlFor="ink" className="flex items-center px-3 text-sm">
                {tool === "draw" ? "Ink" : "Text colour"}
              </label>
              <input
                id="ink"
                type="color"
                value={ink}
                onChange={(e) => (tool === "draw" ? setInk(e.target.value) : styleText({ fill: e.target.value }))}
                onBlur={() => activeText && commit()}
                className="h-full w-full cursor-pointer border-l border-foreground/20 bg-transparent p-1.5"
              />
            </div>
          )}
          {tool === "draw" && (
            <SliderRow label="Pen size" value={brush} min={2} max={40} onChange={setBrush} />
          )}
          {(tool === "text" || activeText) && (
            <>
              <div className="grid min-h-11 grid-cols-[6.5rem_minmax(0,1fr)]">
                <label htmlFor="font" className="flex items-center px-3 text-sm">
                  Font
                </label>
                <select
                  id="font"
                  value={textStyle.font}
                  onChange={(e) => {
                    styleText({ font: e.target.value as FontKey });
                    if (activeText) commit();
                  }}
                  className="min-w-0 border-l border-foreground/20 bg-transparent px-3 text-sm outline-none focus-visible:bg-secondary"
                  style={{ fontFamily: fontFamilyCss(textStyle.font) }}
                >
                  {(Object.keys(FONTS) as FontKey[]).map((k) => (
                    <option key={k} value={k} style={{ fontFamily: fontFamilyCss(k) }}>
                      {FONTS[k].label}
                    </option>
                  ))}
                </select>
              </div>
              <SliderRow
                label="Text size"
                value={textStyle.size}
                min={12}
                max={160}
                onChange={(size) => styleText({ size })}
                onCommit={() => activeText && commit()}
              />
              <div className="grid grid-cols-5 divide-x divide-foreground/20">
                {([
                  ["Bold", Bold, { bold: !textStyle.bold }, textStyle.bold],
                  ["Italic", Italic, { italic: !textStyle.italic }, textStyle.italic],
                  ["Align left", AlignLeft, { align: "left" }, textStyle.align === "left"],
                  ["Align centre", AlignCenter, { align: "center" }, textStyle.align === "center"],
                  ["Align right", AlignRight, { align: "right" }, textStyle.align === "right"],
                ] as const).map(([label, Icon, patch, on]) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={label}
                    title={label}
                    aria-pressed={on}
                    onClick={() => {
                      styleText(patch);
                      if (activeText) commit();
                    }}
                    className={cn(cellButton, on && activeCell)}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </>
          )}
          <Hint>
            {tool === "move" && "Drag the picture to place it in the frame."}
            {tool === "draw" && "Draw on the frame; pressure works with a pen."}
            {tool === "erase" && "Drag over pen strokes to remove them. The picture and text stay."}
            {tool === "text" && "Click the frame where the text should go. Select text later with Move to restyle it."}
          </Hint>
        </Panel>

        <Panel title="Adjust" disabled={!hasImage}>
          {(Object.keys(ADJUST) as (keyof typeof ADJUST)[]).map((key) => (
            <SliderRow
              key={key}
              label={ADJUST[key].label}
              value={adjust[key]}
              min={ADJUST[key].min}
              max={ADJUST[key].max}
              onChange={(v) => changeAdjust({ ...adjustRef.current, [key]: v })}
              onCommit={commit}
            />
          ))}
          <div className="grid grid-cols-2 divide-x divide-foreground/20">
            {(["grayscale", "sepia"] as const).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={adjust[key]}
                onClick={() => {
                  changeAdjust({ ...adjustRef.current, [key]: !adjustRef.current[key] });
                  commit();
                }}
                className={cn(cellButton, adjust[key] && activeCell)}
              >
                {key === "grayscale" ? "Greyscale" : "Sepia"}
              </button>
            ))}
          </div>
          <button type="button" onClick={reset} className={cellButton}>
            <RotateCcw className="size-4" aria-hidden="true" /> Reset everything
          </button>
        </Panel>

        <Panel title="Details">
          <TextRow
            id="title"
            label="Title"
            value={title}
            onChange={setTitle}
            maxLength={60}
          />
          <TextRow
            id="collection"
            label="Collection"
            value={collection}
            onChange={setCollection}
            maxLength={40}
            placeholder="Goblin"
          />
          <Segmented
            label="Frame"
            value={aspect}
            onChange={changeAspect}
            options={[
              { value: "16x9", label: "Desktop 16:9" },
              { value: "9x16", label: "Mobile 9:16" },
            ]}
          />
        </Panel>

        <Panel title="Export">
          <Segmented
            label="Format"
            value={format}
            onChange={setFormat}
            options={[
              { value: "webp", label: "WebP" },
              { value: "jpeg", label: "JPEG" },
              { value: "png", label: "PNG" },
            ]}
          />
          <Segmented
            label="Width"
            value={String(width)}
            onChange={(w) => setWidth(Number(w))}
            options={frame.widths.map((w) => ({
              value: String(w),
              label: `${w}px`,
            }))}
          />
          {format !== "png" && (
            <SliderRow
              label="Quality"
              value={quality}
              min={40}
              max={100}
              onChange={setQuality}
            />
          )}
          <Hint>
            Publishing compresses to under 1.5 MB; Download keeps these
            settings.
          </Hint>
          <div className="grid grid-cols-2 divide-x divide-foreground/20">
            <button
              type="submit"
              disabled={!hasImage || status?.kind === "busy"}
              className={cn(
                cellButton,
                "min-h-14 font-hand text-xl",
                activeCell,
              )}
            >
              <Upload className="size-4" aria-hidden="true" /> Publish
            </button>
            <button
              type="button"
              disabled={!hasImage}
              onClick={download}
              className={cn(cellButton, "min-h-14 font-hand text-xl")}
            >
              <Download className="size-4" aria-hidden="true" /> Download
            </button>
          </div>
          {status && (
            <p
              role={status.kind === "error" ? "alert" : "status"}
              className={cn(
                "px-3 py-2.5 text-sm",
                status.kind === "error" && "text-destructive",
              )}
            >
              {status.text}{" "}
              {status.href && (
                <a
                  href={status.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  See the commit
                </a>
              )}
            </p>
          )}
        </Panel>
      </div>
    </form>
  );
}
