import data from "./wallpapers.json";

export type WallpaperAspect = "16x9" | "9x16";

export interface Wallpaper {
  id: string;
  title: string;
  collection: string;
  aspect: WallpaperAspect;
  src: string;
  resolution: string;
}

// The list lives in JSON so an admin upload can rewrite it in a commit.
// Hidden (soft-deleted) pieces are tracked in Redis: see visibleWallpapers() in lib/hidden-art.ts.
export const wallpapers = data as Wallpaper[];

/** Path of the JSON file in the repo, for the admin upload. */
export const WALLPAPERS_JSON_PATH = "src/sections/wallpapers/config/wallpapers.json";
