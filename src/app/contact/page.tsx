import { Metadata } from "next";

import { pageMeta } from "@lib/seo";

import { HostingerContactForm } from "@components/shared/HostingerContactForm";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description: "Have a project in mind or just want to say hello? Get in touch with Pranav K.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="wrap pt-14 sm:pt-20" aria-labelledby="contact-heading">
      <h1
        id="contact-heading"
        className="text-center text-[26px] font-bold leading-tight sm:text-[32px]"
      >
        Get In Touch
      </h1>
      <p className="mx-auto mt-3 max-w-[34rem] text-center text-[17px] leading-[1.75] text-muted-foreground">
        Have a project in mind or just want to say hello? Drop a message and
        I&apos;ll get back to you.
      </p>

      <div className="mt-10">
        <HostingerContactForm />
      </div>
    </section>
  );
}
