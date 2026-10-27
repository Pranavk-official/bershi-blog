import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { siteConfig } from "@config/site";
import { getAllPublished } from "@lib/notion";
import { ListingPost } from "@components/blog/ListingPost";
import { Button } from "@components/ui/button";
import { Flower, Smiley, Squiggle, Star } from "@components/shared/Doodles";
import { wallpapers } from "@sections/wallpapers/config/wallpapers";

export const revalidate = 60;

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
};

const elsewhere = [
  { label: "GitHub", href: siteConfig.links.github },
  { label: "LinkedIn", href: siteConfig.links.linkedin },
  { label: "Twitter", href: siteConfig.links.twitter },
  { label: "Email me", href: siteConfig.links.email },
];

const filmstrip = wallpapers.slice(0, 3);

export default async function Home() {
  const posts = (await getAllPublished()).slice(0, 4);
  const latest = posts[0];

  return (
    <div className="page">
      {/* Hero collage: kraft note, polaroid, notepad, sage scrap. */}
      <section
        aria-labelledby="hero-heading"
        className="relative grid gap-10 pt-12 md:grid-cols-[auto_1.15fr_1fr_0.75fr] md:items-start md:gap-6"
      >
        <Flower className="hidden self-center md:block" />

        <div className="tape relative mt-4 -rotate-1">
          {/* Phones: the photo is taped on and overlaps the note, right above the name. */}
          <div className="relative z-10 mx-auto -mb-16 w-[72%] rotate-[3deg] bg-white p-2.5 pb-10 shadow-lg md:hidden dark:bg-ash-200">
            <Image
              src="/profile_.png"
              alt={siteConfig.name}
              width={560}
              height={560}
              priority
              className="aspect-square w-full object-cover"
            />
            {/* Sticker on the photo's corner, where it meets the note. */}
            <Smiley className="absolute -right-5 -bottom-5 size-16 -rotate-6 rounded-full bg-blush p-1 shadow-md" />
          </div>
          <div className="torn bg-kraft px-8 pt-12 pb-10 text-foreground max-md:pt-24 sm:px-10">
            <h1
              id="hero-heading"
              className="text-[clamp(2.5rem,12vw,3rem)] leading-[1.05] sm:text-6xl"
            >
              Hi, I&apos;m
              <br />
              <span className="whitespace-nowrap">{siteConfig.name}.</span>
            </h1>
            <Squiggle className="mt-2 w-40" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed">
              {siteConfig.tagline}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <Button asChild>
                <Link href="/blog">
                  Read my notes <ArrowRight />
                </Link>
              </Button>
              <Link
                href="/about"
                className="border-b-2 border-foreground text-sm font-bold uppercase tracking-wide"
              >
                About me
              </Link>
            </div>
          </div>
          <Smiley className="absolute -top-6 -right-4 size-16 rotate-12 rounded-full bg-blush p-1 shadow-md max-md:hidden" />
        </div>

        <div className="relative md:pt-2">
          <div className="tape relative rotate-2 bg-white p-3 pb-10 shadow-lg max-md:hidden dark:bg-ash-200">
            <Image
              src="/profile_.png"
              alt={siteConfig.name}
              width={480}
              height={480}
              priority
              className="aspect-square w-full object-cover"
            />
          </div>
          {latest && (
            <Link
              href={`/blog/${latest.slug}`}
              className="relative ml-6 block md:-mt-6 w-fit max-w-[16rem] -rotate-2 bg-sage px-5 py-3 text-sm shadow-md"
            >
              <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                Just posted
              </span>
              &ldquo;{latest.title}&rdquo;
            </Link>
          )}
        </div>

        <div className="relative md:mt-16">
          <Star className="absolute -top-14 left-1/2 hidden md:block" />
          {/* BottomNav pops up as this card comes onto the screen. */}
          <div data-bottom-nav-from className="lined rotate-3 px-6 pt-5 pb-8 font-hand text-xl shadow-md">
            <p className="text-2xl underline underline-offset-4">Elsewhere:</p>
            <ul className="mt-2 space-y-[0.2rem]">
              {elsewhere.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-ember-600"
                  >
                    <span className="inline-flex size-4 items-center justify-center border border-current">
                      <Check className="size-3" aria-hidden="true" />
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Squiggle className="mt-16 h-3 w-full text-foreground/70" />

      {/* Latest from the journal */}
      <section aria-labelledby="latest-heading" className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <h2 id="latest-heading" className="text-3xl leading-none">
            Latest from
            <br />
            the Journal
          </h2>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 border-b border-foreground text-xs font-bold uppercase tracking-wide"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No posts published yet — check back soon.
          </p>
        ) : (
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((post, index) => (
              <ListingPost key={post.id} post={post} index={index} isNew={index === 0} />
            ))}
          </div>
        )}
      </section>

      {/* Bottom row: art scrap, film strip, sticky note. */}
      <section
        aria-label="More"
        className="mt-20 grid gap-10 md:grid-cols-[1.4fr_0.7fr_1fr] md:items-center"
      >
        <div className="torn -rotate-1 bg-blush px-8 py-12 sm:px-12">
          <h2 className="text-3xl leading-tight">
            Art made
            <br />
            to be shared.
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Original desktop and mobile wallpapers, free to download for personal use.
          </p>
          <Link
            href="/art"
            className="mt-6 inline-flex items-center gap-2 border-b-2 border-foreground text-sm font-bold uppercase tracking-wide"
          >
            See the art <ArrowRight className="size-4" />
          </Link>
        </div>

        <Link
          href="/art"
          aria-label="Art gallery"
          className="mx-auto block w-full max-w-[14rem] rotate-2 space-y-2 bg-[#1a1714] px-6 py-4 shadow-lg"
        >
          {filmstrip.map((wallpaper, i) => (
            <span key={wallpaper.id} className="relative block">
              <Image
                src={wallpaper.src}
                alt=""
                width={320}
                height={180}
                className="aspect-video w-full object-cover grayscale"
              />
              <span className="absolute top-0 -right-5 text-[10px] text-white/70">
                {12 + i}
              </span>
            </span>
          ))}
        </Link>

        <div className="relative rotate-1 bg-sticky px-8 py-10 shadow-md">
          <span
            aria-hidden="true"
            className="graph absolute -top-3 -left-2 size-8 -rotate-6 opacity-90"
          />
          <h2 className="text-3xl">Say hello</h2>
          <Squiggle className="w-32" />
          <p className="mt-4 text-sm leading-relaxed">
            Have a project in mind or just want to say hello?
          </p>
          <Button asChild className="mt-6">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
