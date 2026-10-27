import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { achievements } from "@sections/achievements/config/achievements";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import { BlurFade } from "@components/ui/blur-fade";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { LinkedInEmbed } from "@components/shared/LinkedInEmbed";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all achievements
export async function generateStaticParams() {
  return achievements.map((achievement) => ({
    slug: achievement.slug,
  }));
}

// Generate dynamic metadata for each achievement
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const achievement = achievements.find((a) => a.slug === slug);

  if (!achievement) {
    return {
      title: "Achievement Not Found",
    };
  }

  return {
    title: achievement.title,
    description: achievement.shortDescription,
    alternates: {
      canonical: `/achievements/${slug}`,
    },
    openGraph: {
      title: `${achievement.title} | Pranav K`,
      description: achievement.shortDescription,
    },
  };
}

export default async function AchievementDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const achievement = achievements.find((a) => a.slug === slug);

  if (!achievement) {
    notFound();
  }

  const Icon = achievement.icon;

  // Find next and previous achievements
  const currentIndex = achievements.findIndex((a) => a.slug === slug);
  const prevAchievement =
    currentIndex > 0 ? achievements[currentIndex - 1] : null;
  const nextAchievement =
    currentIndex < achievements.length - 1
      ? achievements[currentIndex + 1]
      : null;

  return (
    <main className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative">
        {/* Gradient Background */}
        <div className="absolute inset-0 h-[50vh] overflow-hidden">
          <div
            className={`absolute inset-0 bg-linear-to-br ${achievement.accentColor} opacity-20`}
          />
          <div className="absolute inset-0 bg-linear-to-b from-background/60 via-background/80 to-background" />

          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-linear-to-br ${achievement.accentColor} opacity-10 blur-3xl`}
            />
            <div
              className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-linear-to-br ${achievement.accentColor} opacity-15 blur-3xl`}
            />
          </div>
        </div>

        {/* Content */}
        <div className="container relative mx-auto px-4 pb-12 pt-24">
          {/* Navigation */}
          <BlurFade delay={0.1} inView direction="up">
            <Link href="/#achievements-heading">
              <Button variant="ghost" size="sm" className="mb-8 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Achievements
              </Button>
            </Link>
          </BlurFade>

          {/* Title and Meta */}
          <div className="max-w-4xl">
            <BlurFade delay={0.2} inView direction="up">
              <div className="mb-6 flex items-center gap-4">
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 
                    rounded-2xl bg-linear-to-br ${achievement.accentColor} 
                    shadow-lg`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Number Badge */}
                <span
                  className={`text-6xl font-bold bg-linear-to-br ${achievement.accentColor} 
                    bg-clip-text text-transparent opacity-50`}
                >
                  {achievement.number}
                </span>
              </div>
            </BlurFade>

            <BlurFade delay={0.3} inView direction="up">
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {achievement.title}
              </h1>
            </BlurFade>

            <BlurFade delay={0.4} inView direction="up">
              <div className="mb-6 flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{achievement.date}</span>
                </div>
                {achievement.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{achievement.location}</span>
                  </div>
                )}
              </div>
            </BlurFade>

            <BlurFade delay={0.5} inView direction="up">
              <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
                {achievement.shortDescription}
              </p>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Embed */}
          {achievement.embedUrl && (
            <div className="mb-12">
              <BlurFade delay={0.15} inView direction="up">
                <h2 className="mb-4 text-2xl font-semibold">LinkedIn Post</h2>
              </BlurFade>
              <div className="flex justify-center">
                <LinkedInEmbed embedUrl={achievement.embedUrl} />
              </div>
              <Separator className="my-10" />
            </div>
          )}

          {/* About Section */}
          <BlurFade delay={0.1} inView direction="up">
            <div className="mb-12">
              <h2 className="mb-4 text-2xl font-semibold">About</h2>
              <p className="leading-relaxed text-muted-foreground">
                {achievement.fullDescription}
              </p>
            </div>
          </BlurFade>

          <Separator className="my-10" />

          {/* Highlights Section */}
          <BlurFade delay={0.2} inView direction="up">
            <div className="mb-12">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Key Highlights</h2>
              </div>
              <ul className="space-y-3">
                {achievement.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </BlurFade>

          <Separator className="my-10" />

          {/* Achievement Navigation */}
          <BlurFade delay={0.3} inView direction="up">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              {prevAchievement ? (
                <Link
                  href={`/achievements/${prevAchievement.slug}`}
                  className="group"
                >
                  <Button variant="outline" className="w-full gap-2 sm:w-auto">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span className="truncate">{prevAchievement.title}</span>
                  </Button>
                </Link>
              ) : (
                <div />
              )}
              {nextAchievement && (
                <Link
                  href={`/achievements/${nextAchievement.slug}`}
                  className="group"
                >
                  <Button variant="outline" className="w-full gap-2 sm:w-auto">
                    <span className="truncate">{nextAchievement.title}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              )}
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
