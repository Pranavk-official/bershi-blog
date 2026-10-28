"use server";

import { redirect } from "next/navigation";

import { logIn, logOut } from "@lib/admin-auth";

export async function logInAction(form: FormData) {
  const ok = await logIn(String(form.get("password") ?? ""));
  redirect(ok ? "/admin" : "/admin/login?error=1");
}

export async function logOutAction() {
  await logOut();
  redirect("/admin/login");
}
