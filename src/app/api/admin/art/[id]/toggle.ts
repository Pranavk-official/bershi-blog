import { NextResponse } from "next/server";

import { isAdmin } from "@lib/admin-auth";
import { hiddenArtConfigured, setHidden } from "@lib/hidden-art";

/** Shared by DELETE (soft delete) and POST ./restore. */
export async function toggleHidden(params: Promise<{ id: string }>, hidden: boolean) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!hiddenArtConfigured()) {
    return NextResponse.json({ error: "Vercel Blob isn't set up (BLOB_READ_WRITE_TOKEN)." }, { status: 500 });
  }
  const { id } = await params;
  try {
    if (!(await setHidden(id, hidden))) return NextResponse.json({ error: "No piece with that id." }, { status: 404 });
    return NextResponse.json({ id, hidden });
  } catch (error) {
    console.error("Art visibility change failed:", error);
    return NextResponse.json({ error: "Couldn't reach Vercel Blob. Try again." }, { status: 502 });
  }
}
