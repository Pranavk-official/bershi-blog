import { redirect } from "next/navigation";

import { isAdmin } from "@lib/admin-auth";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { logInAction } from "../actions";

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className="tape mx-auto mt-10 max-w-sm">
      <form action={logInAction} className="paper flex flex-col gap-4 p-8">
        <h1 className="text-4xl leading-none">Admin</h1>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            aria-describedby={error ? "login-error" : undefined}
          />
          {error && (
            <p id="login-error" role="alert" className="text-sm text-destructive">
              That password didn&apos;t match.
            </p>
          )}
        </div>
        <Button type="submit">Sign in</Button>
      </form>
    </div>
  );
}
