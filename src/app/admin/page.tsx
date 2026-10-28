import { redirect } from "next/navigation";

import { isAdmin } from "@lib/admin-auth";
import { githubConfigured } from "@lib/github-commit";
import { wallpapers } from "@sections/wallpapers/config/wallpapers";
import { hiddenArtConfigured, hiddenIds } from "@lib/hidden-art";
import { Button } from "@components/ui/button";
import { logOutAction } from "./actions";
import { ArtEditor } from "./art-editor";
import { ArtList } from "./art-list";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const hidden = await hiddenIds().catch(() => []);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-5xl leading-none">Art admin</h1>
        <form action={logOutAction}>
          <Button type="submit" variant="outline" size="sm">
            Sign out
          </Button>
        </form>
      </div>

      {!githubConfigured() && (
        <p role="alert" className="paper p-4 text-sm">
          Uploads are off: set <code>GITHUB_TOKEN</code> and <code>GITHUB_REPO</code> to turn them on.
        </p>
      )}

      {!hiddenArtConfigured() && (
        <p role="alert" className="paper p-4 text-sm">
          Delete and restore are off: set <code>UPSTASH_REDIS_REST_URL</code> and <code>UPSTASH_REDIS_REST_TOKEN</code>.
        </p>
      )}

      <section aria-labelledby="new-heading" className="flex flex-col gap-4">
        <h2 id="new-heading" className="text-3xl leading-none">
          Add a piece
        </h2>
        <ArtEditor />
      </section>

      <section aria-labelledby="live-heading" className="flex flex-col gap-4">
        <h2 id="live-heading" className="text-3xl leading-none">
          Published ({wallpapers.length})
        </h2>
        <ArtList wallpapers={wallpapers} hidden={hidden} canHide={hiddenArtConfigured()} />
      </section>
    </div>
  );
}
