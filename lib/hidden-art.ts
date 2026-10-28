import { unstable_cache, revalidateTag } from "next/cache";
import { Redis } from "@upstash/redis";

import { wallpapers, type Wallpaper } from "@sections/wallpapers/config/wallpapers";

// Soft delete for art: the ids of hidden pieces live in one Redis set. Nothing
// is removed from the repo, so a hidden piece can be restored at any time.
// Env: UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or Vercel's
// KV_REST_API_URL + KV_REST_API_TOKEN, which fromEnv also reads).

const KEY = "art:hidden";
const TAG = "art-hidden";

export const hiddenArtConfigured = () =>
  Boolean(
    (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
      (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN),
  );

let client: Redis | null = null;
const redis = () => (client ??= Redis.fromEnv());

/** Hidden ids straight from Redis, for the admin panel. Empty when Redis isn't set up. */
export async function hiddenIds(): Promise<string[]> {
  if (!hiddenArtConfigured()) return [];
  return redis().smembers(KEY);
}

// The public pages read through Next's data cache; every change expires it.
const cachedHiddenIds = unstable_cache(hiddenIds, [KEY], { tags: [TAG], revalidate: 3600 });

/** What the site shows: this deployment's art minus anything hidden. */
export async function visibleWallpapers(): Promise<Wallpaper[]> {
  try {
    const hidden = new Set(await cachedHiddenIds());
    return wallpapers.filter((w) => !hidden.has(w.id));
  } catch (error) {
    // Redis down: show everything rather than an empty gallery.
    console.warn("Couldn't read hidden art; showing everything.", error);
    return wallpapers;
  }
}

/** Soft delete (`true`) or restore (`false`) one piece. Returns false for an unknown id. */
export async function setHidden(id: string, hidden: boolean): Promise<boolean> {
  if (!wallpapers.some((w) => w.id === id)) return false;
  if (hidden) await redis().sadd(KEY, id);
  else await redis().srem(KEY, id);
  revalidateTag(TAG, { expire: 0 });
  return true;
}
