import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// One password (ADMIN_PASSWORD) and a signed, expiring cookie. The password is
// also the signing key, so changing it signs every session out.

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // a week, in seconds

const password = () => process.env.ADMIN_PASSWORD ?? "";
const sign = (value: string) => createHmac("sha256", password()).update(value).digest("base64url");
const sha = (value: string) => createHash("sha256").update(value).digest();

export async function isAdmin(): Promise<boolean> {
  if (!password()) return false;
  const [expires, signature] = ((await cookies()).get(COOKIE)?.value ?? "").split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  const given = Buffer.from(signature);
  const expected = Buffer.from(sign(expires));
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Starts a session when `attempt` matches ADMIN_PASSWORD. Unset password: nobody gets in. */
export async function logIn(attempt: string): Promise<boolean> {
  // Hash both sides so the comparison takes the same time whatever the length.
  if (!password() || !timingSafeEqual(sha(attempt), sha(password()))) return false;
  const expires = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE,
  });
  return true;
}

export async function logOut() {
  (await cookies()).delete(COOKIE);
}
