import { unstable_cache, revalidateTag } from "next/cache";
import { BlobPreconditionFailedError, get, put } from "@vercel/blob";

import { wallpapers, type Wallpaper } from "@sections/wallpapers/config/wallpapers";

// Soft delete for art: the ids of hidden pieces live in one private JSON file in
// Vercel Blob. Nothing is removed from the repo, so a hidden piece can be
// restored at any time. Env: BLOB_READ_WRITE_TOKEN (Vercel adds it when a Blob
// store is connected to the project).

const PATH = "art/hidden.json";
const TAG = "art-hidden";

export const hiddenArtConfigured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/** The hidden ids and the file's ETag, read past the CDN so a write is seen at once. */
async function readHidden(): Promise<{ ids: string[]; etag: string | null }> {
  const file = await get(PATH, { access: "private", useCache: false });
  if (!file || file.statusCode !== 200) return { ids: [], etag: null };
  const ids = JSON.parse(await new Response(file.stream).text()) as unknown;
  return { ids: Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string") : [], etag: file.blob.etag };
}

/** Hidden ids, for the admin panel. Empty when Blob isn't set up. */
export async function hiddenIds(): Promise<string[]> {
  if (!hiddenArtConfigured()) return [];
  return (await readHidden()).ids;
}

// The public pages read through Next's data cache; every change expires it.
const cachedHiddenIds = unstable_cache(hiddenIds, [PATH], { tags: [TAG], revalidate: 3600 });

/** What the site shows: this deployment's art minus anything hidden. */
export async function visibleWallpapers(): Promise<Wallpaper[]> {
  try {
    const hidden = new Set(await cachedHiddenIds());
    return wallpapers.filter((w) => !hidden.has(w.id));
  } catch (error) {
    // Blob unreachable: show everything rather than an empty gallery.
    console.warn("Couldn't read hidden art; showing everything.", error);
    return wallpapers;
  }
}

/** Soft delete (`true`) or restore (`false`) one piece. Returns false for an unknown id. */
export async function setHidden(id: string, hidden: boolean): Promise<boolean> {
  if (!wallpapers.some((w) => w.id === id)) return false;

  // Read-modify-write guarded by the ETag: if another change lands in between,
  // the write is refused and we start again from the newer file.
  for (let attempt = 0; attempt < 3; attempt++) {
    const { ids, etag } = await readHidden();
    const next = hidden ? [...new Set([...ids, id])] : ids.filter((x) => x !== id);
    try {
      await put(PATH, JSON.stringify(next), {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
        // First write creates the file; after that, only overwrite the version we read.
        ...(etag ? { ifMatch: etag } : { allowOverwrite: true }),
        cacheControlMaxAge: 60,
      });
      revalidateTag(TAG, { expire: 0 });
      return true;
    } catch (error) {
      if (!(error instanceof BlobPreconditionFailedError) || attempt === 2) throw error;
    }
  }
  return true;
}
