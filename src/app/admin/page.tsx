import Image from "next/image";
import { redirect } from "next/navigation";

import { isAdmin } from "@lib/admin-auth";
import { githubConfigured } from "@lib/github-commit";
import { wallpapers } from "@sections/wallpapers/config/wallpapers";
import { Button } from "@components/ui/button";
import { logOutAction } from "./actions";
import { ArtEditor } from "./art-editor";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

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

      <section aria-labelledby="new-heading" className="flex flex-col gap-4">
        <h2 id="new-heading" className="text-3xl leading-none">
          Add a piece
        </h2>
        <ArtEditor />
      </section>

      <section aria-labelledby="live-heading" className="flex flex-col gap-4">
        <h2 id="live-heading" className="text-3xl leading-none">
          On the site ({wallpapers.length})
        </h2>
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {wallpapers.map((w) => (
            <li key={w.id} className="paper flex flex-col gap-2 p-2 pb-3">
              <div className={w.aspect === "16x9" ? "relative aspect-video" : "relative aspect-[9/16]"}>
                <Image src={w.src} alt={w.title} fill sizes="240px" className="object-cover" />
              </div>
              <p className="font-hand text-lg leading-tight">{w.title}</p>
              <p className="text-xs text-muted-foreground">
                {w.collection} · {w.resolution}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
