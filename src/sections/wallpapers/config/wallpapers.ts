export type WallpaperAspect = "16x9" | "9x16";

export interface Wallpaper {
  id: string;
  title: string;
  collection: string;
  aspect: WallpaperAspect;
  src: string;
  resolution: string;
}

export const wallpapers: Wallpaper[] = [
  {
    id: "goblin-16x9-1",
    title: "Goblin I",
    collection: "Goblin",
    aspect: "16x9",
    src: "/wallpapers/16x9/Goblin_16x9_1.png",
    resolution: "Desktop · 16:9",
  },
  {
    id: "goblin-16x9-2",
    title: "Goblin II",
    collection: "Goblin",
    aspect: "16x9",
    src: "/wallpapers/16x9/Goblin_16x9_2.png",
    resolution: "Desktop · 16:9",
  },
  {
    id: "goblin-9x16-1",
    title: "Goblin I",
    collection: "Goblin",
    aspect: "9x16",
    src: "/wallpapers/9x16/Goblin_9x16.jpg",
    resolution: "Mobile · 9:16",
  },
  {
    id: "goblin-9x16-2",
    title: "Goblin II",
    collection: "Goblin",
    aspect: "9x16",
    src: "/wallpapers/9x16/Goblin_9x16_2.png",
    resolution: "Mobile · 9:16",
  },
];
