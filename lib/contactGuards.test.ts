import { expect, test } from "bun:test";

import { looksLikeSpam, rateLimited } from "./contactGuards";

test("rate limit allows 3 then blocks, and expires after the window", () => {
    const t = 1_000_000;
    expect([0, 1, 2].map((i) => rateLimited("1.1.1.1", t + i))).toEqual([false, false, false]);
    expect(rateLimited("1.1.1.1", t + 3)).toBe(true);
    expect(rateLimited("2.2.2.2", t)).toBe(false); // per-IP, not global
    expect(rateLimited("1.1.1.1", t + 11 * 60 * 1000)).toBe(false); // window rolled over
});

test("spam filter catches link floods and blocklisted terms, passes real messages", () => {
    expect(looksLikeSpam("", "https://a.com https://b.com https://c.com")).toBe(true);
    expect(looksLikeSpam("Cheap VIAGRA", "hi")).toBe(true);
    expect(looksLikeSpam("Job", "Loved your portfolio, see https://mycompany.com")).toBe(false);
});
