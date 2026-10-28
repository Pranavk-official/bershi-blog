import { NextResponse } from "next/server";
import { z } from "zod";

import { isAdmin } from "@lib/admin-auth";
import { commitFiles, githubConfigured, readRepoFile } from "@lib/github-commit";
import { WALLPAPERS_JSON_PATH, type Wallpaper } from "@sections/wallpapers/config/wallpapers";

// Vercel rejects request bodies over 4.5 MB; stay under it with room for the form fields.
const MAX_BYTES = 4.3 * 1024 * 1024;
const EXT: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" };

const Fields = z.object({
  title: z.string().trim().min(1).max(60),
  collection: z.string().trim().min(1).max(40),
  aspect: z.enum(["16x9", "9x16"]),
});

const slug = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "art";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!githubConfigured()) {
    return NextResponse.json({ error: "GITHUB_TOKEN and GITHUB_REPO aren't set." }, { status: 500 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const fields = Fields.safeParse(Object.fromEntries(form));
  if (!fields.success) return NextResponse.json({ error: "Title, collection and aspect are required." }, { status: 400 });
  if (!(file instanceof File) || !EXT[file.type]) {
    return NextResponse.json({ error: "The image must be WebP, JPEG or PNG." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "The image is over 4.3 MB. Lower the quality or the width." }, { status: 413 });
  }

  const { title, collection, aspect } = fields.data;
  const id = `${slug(title)}-${aspect}-${Date.now().toString(36)}`;
  const imagePath = `public/wallpapers/${aspect}/${id}.${EXT[file.type]}`;

  try {
    // Read the list from the repo, not this deployment: an earlier upload may not be live yet.
    const list = JSON.parse(await readRepoFile(WALLPAPERS_JSON_PATH)) as Wallpaper[];
    list.push({
      id,
      title,
      collection,
      aspect,
      src: imagePath.replace(/^public/, ""),
      resolution: aspect === "16x9" ? "Desktop · 16:9" : "Mobile · 9:16",
    });

    const commitUrl = await commitFiles(`feat(art): add ${title} (${aspect})`, [
      { path: imagePath, bytes: Buffer.from(await file.arrayBuffer()) },
      { path: WALLPAPERS_JSON_PATH, text: JSON.stringify(list, null, 2) + "\n" },
    ]);
    return NextResponse.json({ id, commitUrl });
  } catch (error) {
    console.error("Art upload failed:", error);
    return NextResponse.json({ error: "Couldn't commit to GitHub. Check the token and try again." }, { status: 502 });
  }
}
