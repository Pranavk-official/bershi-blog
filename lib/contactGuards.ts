const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;

// ponytail: in-memory, so the limit is per server instance and resets on deploy.
// Swap for Upstash/Redis only if the site ever runs on more than one instance.
const hits = new Map<string, number[]>();

export function rateLimited(ip: string, now = Date.now()) {
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
    recent.push(now);
    if (hits.size > 5000) hits.clear(); // crude bound, the Map is not allowed to grow forever
    hits.set(ip, recent);
    return recent.length > RATE_LIMIT;
}

const SPAM_TERMS =
    /\b(viagra|casino|crypto\s*invest|seo\s*service|backlink|loan\s*offer|bitcoin\s*doubl)/i;

export function looksLikeSpam(subject: string, message: string) {
    const body = `${subject} ${message}`;
    const links = body.match(/https?:\/\//gi)?.length ?? 0;
    return links > 2 || SPAM_TERMS.test(body);
}
