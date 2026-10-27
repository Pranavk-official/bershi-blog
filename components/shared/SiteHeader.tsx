"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { siteConfig } from "@config/site";
import { cn } from "@lib/utils";
import { menu } from "@components/shared/menu";
import { AnimatedThemeToggler } from "@components/ui/animated-theme-toggler";

// Highlighter swipe behind a label: full on the current page, drawn in on hover.
const swipe =
  "relative z-0 before:absolute before:inset-x-[-0.3em] before:bottom-[0.12em] before:-z-10 before:h-[0.55em] before:-rotate-1 before:rounded-[2px] before:bg-(--sticky) before:origin-left before:transition-transform before:duration-300 motion-reduce:before:transition-none dark:before:bg-primary/45";

// Torn paper edges for the phone bars. Inline because a clip-path utility
// with a variant didn't reach the stylesheet.
const tornBottom =
  "polygon(0% 0%, 100% 0%, 100% 88%, 93% 97%, 86% 90%, 78% 99%, 70% 91%, 61% 98%, 53% 90%, 45% 100%, 37% 92%, 29% 98%, 21% 90%, 13% 99%, 6% 91%, 0% 97%)";
const tornTop =
  "polygon(0% 3%, 6% 0%, 13% 4%, 21% 1%, 29% 4.5%, 37% 0.5%, 45% 3.5%, 53% 0%, 61% 4%, 70% 1%, 78% 4.5%, 86% 0.5%, 93% 3.5%, 100% 0%, 100% 100%, 0% 100%)";

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
}

/** A pen stroke under the bar, slightly uneven like a ruled line drawn by hand. */
function InkLine() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 8"
      preserveAspectRatio="none"
      className="absolute inset-x-0 -bottom-1 h-2 w-full text-foreground max-md:hidden"
    >
      <path
        d="M1 4.6C120 3.4 210 5.2 340 4.1S560 3 690 4.4 880 5.3 999 3.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * Top bar. Desktop: wordmark, page links and theme toggle over a pen line.
 * Phones: a sticky paper strip with the wordmark and theme toggle; the page
 * links move to BottomNav.
 */
export function SiteHeader() {
  const isActive = useIsActive();

  return (
    // The shadow sits on the wrapper because the strip's clip-path would cut it off.
    <div className="z-40 max-md:sticky max-md:top-0 max-md:drop-shadow-[0_2px_3px_rgb(60_45_25/0.16)]">
      <header
        className="page pt-6 max-md:bg-card max-md:pt-[env(safe-area-inset-top)] max-md:pb-2 max-md:[clip-path:var(--torn)]"
        style={{ "--torn": tornBottom } as React.CSSProperties}
      >
        <div className="relative flex items-center gap-6 pb-3 max-md:h-14 max-md:pb-0">
          <Link
            href="/"
            aria-label={`${siteConfig.name} — home`}
            className="tape font-hand text-[1.7rem] leading-none whitespace-nowrap text-foreground before:-top-2 before:left-[30%] before:h-4 before:w-14 before:rotate-[4deg] md:text-[2rem]"
          >
            {siteConfig.name}
          </Link>

          <nav aria-label="Primary" className="ml-auto max-md:hidden">
            <ul className="flex items-center gap-5 lg:gap-7">
              {menu.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-block py-1 font-hand text-xl text-foreground transition-colors",
                        swipe,
                        active
                          ? "before:scale-x-100"
                          : "text-muted-foreground before:scale-x-0 hover:text-foreground hover:before:scale-x-100",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <AnimatedThemeToggler className="grid size-11 place-items-center text-foreground max-md:-mr-2 max-md:ml-auto [&_svg]:size-5" />

          <InkLine />
        </div>
      </header>
    </div>
  );
}

/**
 * Phone tab bar: a paper strip torn along its top edge, pinned above the home
 * indicator. On the home page it waits below the screen until the hero has
 * scrolled away.
 */
export function BottomNav() {
  const isActive = useIsActive();
  const pathname = usePathname();
  const [heroInView, setHeroInView] = useState(true);

  useEffect(() => {
    const hero = document.querySelector('[aria-labelledby="hero-heading"]');
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setHeroInView(entry.isIntersecting));
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  const hidden = pathname === "/" && heroInView;

  return (
    <nav
      aria-label="Primary"
      inert={hidden}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 drop-shadow-[0_-2px_3px_rgb(60_45_25/0.16)] transition-transform duration-300 ease-out motion-reduce:transition-none md:hidden",
        hidden && "translate-y-full",
      )}
    >
      <ul
        className="grid grid-cols-5 bg-card px-1 pt-2.5 pb-[max(env(safe-area-inset-bottom),0.25rem)]"
        style={{ clipPath: tornTop }}
      >
        {menu.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 transition-colors active:scale-95 motion-reduce:active:scale-100",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon aria-hidden="true" className="size-[22px]" strokeWidth={active ? 2 : 1.6} />
                <span
                  className={cn(
                    "font-hand text-[15px] leading-tight",
                    swipe,
                    active ? "before:scale-x-100" : "before:scale-x-0",
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
