import { NextResponse } from "next/server";
import { Configuration, SendApi, type V1SendRequest } from "hostinger-mail-api-sdk";

import { contactFormSchema } from "@/lib/schemas/contactSchema";
import { looksLikeSpam, rateLimited } from "@lib/contactGuards";
import { siteConfig } from "@config/site";

const TO = siteConfig.links.email.replace("mailto:", "");

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);

    // Honeypot: a real browser never fills a hidden field. Answer 200 so bots
    // cannot distinguish a drop from a delivery and retune.
    if (body && typeof body === "object" && body.website) {
        return NextResponse.json({ ok: true });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    if (rateLimited(ip)) {
        return NextResponse.json({ error: "Too many messages. Try again later." }, { status: 429 });
    }

    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const { name, email, subject, message } = parsed.data;

    if (looksLikeSpam(subject ?? "", message)) {
        return NextResponse.json({ ok: true });
    }

    const { HOSTINGER_MAIL_TOKEN, HOSTINGER_MAILBOX_ID } = process.env;
    if (!HOSTINGER_MAIL_TOKEN || !HOSTINGER_MAILBOX_ID) {
        console.error("Hostinger mail credentials missing");
        return NextResponse.json({ error: "Mail is not configured" }, { status: 500 });
    }

    const api = new SendApi(new Configuration({ accessToken: HOSTINGER_MAIL_TOKEN }));

    try {
        // Cast: generated type marks every field required, the API docs mark them all optional.
        await api.sendEmail(HOSTINGER_MAILBOX_ID, {
            to: [TO],
            subject: `[Portfolio] ${subject || "New message"} — ${name}`,
            text: `From: ${name} <${email}>\n\n${message}`,
        } as V1SendRequest);
    } catch (error) {
        console.error("Hostinger sendEmail failed:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
}
