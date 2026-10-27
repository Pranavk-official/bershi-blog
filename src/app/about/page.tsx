import { Metadata } from "next";

import { siteConfig } from "@config/site";

export const metadata: Metadata = {
  title: "About",
  description: siteConfig.description,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const { subheading, intro, paragraphs } = siteConfig.about;

  return (
    <section className="wrap pt-14 sm:pt-20" aria-labelledby="about-heading">
      <h1
        id="about-heading"
        className="text-center text-[26px] font-bold leading-tight sm:text-[32px]"
      >
        {subheading}
      </h1>

      <div className="mt-8 space-y-6 text-[17px] leading-[1.75] text-muted-foreground sm:mt-10 [&_strong]:font-semibold [&_strong]:text-foreground">
        <p dangerouslySetInnerHTML={{ __html: intro }} />
        {paragraphs.map((paragraph) => (
          <p key={paragraph} dangerouslySetInnerHTML={{ __html: paragraph }} />
        ))}
      </div>
    </section>
  );
}
