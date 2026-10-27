"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { wallpapers } from "./config/wallpapers";
import { WallpaperCard } from "@components/shared/WallpaperCard";
import { Button } from "@components/ui/button";
import { BlurFade } from "@components/ui/blur-fade";
import ScrollElement from "@components/ui/scroll-animation";

const PREVIEW_LIMIT = 4;

const WallpapersSection = () => {
  const preview = wallpapers.slice(0, PREVIEW_LIMIT);

  return (
    <section id="wallpapers" className="relative py-20" aria-labelledby="wallpapers-heading">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <ScrollElement
            viewport={{ amount: 0.5, margin: "0px 0px -100px 0px" }}
            className="mx-auto max-w-3xl"
          >
            <h2
              id="wallpapers-heading"
              className="bg-linear-to-r from-primary to-primary/50 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl"
            >
              Wallpapers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Original artwork I&apos;ve made for my own desktop and phone — free to download and use.
            </p>
          </ScrollElement>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {preview.map((wp, index) => (
            <BlurFade
              key={wp.id}
              delay={0.1 * (index % PREVIEW_LIMIT)}
              inView
              direction="up"
              className={wp.aspect === "16x9" ? "sm:col-span-2" : ""}
            >
              <WallpaperCard wallpaper={wp} index={index} />
            </BlurFade>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/wallpapers" aria-label="View all wallpapers">
            <Button variant="outline" size="lg" className="group gap-2">
              View all wallpapers
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WallpapersSection;
