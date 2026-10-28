// Writes files to the repo as one commit through GitHub's Git Data API, so an
// upload and its list entry land (and deploy) together.
// Env: GITHUB_TOKEN (fine-grained, "Contents: read and write" on this repo),
// GITHUB_REPO ("owner/name"), GITHUB_BRANCH (default "main").

const repo = () => process.env.GITHUB_REPO;
const branch = () => process.env.GITHUB_BRANCH || "main";

async function gh<T>(path: string, init?: { method: string; body: unknown }): Promise<T> {
  const res = await fetch(`https://api.github.com/repos/${repo()}${path}`, {
    method: init?.method ?? "GET",
    body: init ? JSON.stringify(init.body) : undefined,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub ${init?.method ?? "GET"} ${path}: ${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

export const githubConfigured = () => Boolean(process.env.GITHUB_TOKEN && repo());

/** Reads a text file at the branch head. */
export async function readRepoFile(path: string): Promise<string> {
  const file = await gh<{ content: string }>(`/contents/${path}?ref=${branch()}`);
  return Buffer.from(file.content, "base64").toString("utf8");
}

type FileChange = { path: string } & ({ text: string } | { bytes: Buffer });

/** Commits `files` on top of the branch head. Fails (no force push) if the branch moved meanwhile. */
export async function commitFiles(message: string, files: FileChange[]): Promise<string> {
  const head = await gh<{ object: { sha: string } }>(`/git/ref/heads/${branch()}`);
  const parent = await gh<{ tree: { sha: string } }>(`/git/commits/${head.object.sha}`);

  const tree = await Promise.all(
    files.map(async (file) => {
      const sha =
        "bytes" in file
          ? (await gh<{ sha: string }>("/git/blobs", {
              method: "POST",
              body: { content: file.bytes.toString("base64"), encoding: "base64" },
            })).sha
          : undefined;
      return { path: file.path, mode: "100644", type: "blob", ...(sha ? { sha } : { content: (file as { text: string }).text }) };
    }),
  );

  const newTree = await gh<{ sha: string }>("/git/trees", { method: "POST", body: { base_tree: parent.tree.sha, tree } });
  const commit = await gh<{ sha: string; html_url: string }>("/git/commits", {
    method: "POST",
    body: { message, tree: newTree.sha, parents: [head.object.sha] },
  });
  await gh(`/git/refs/heads/${branch()}`, { method: "PATCH", body: { sha: commit.sha } });
  return commit.html_url;
}
