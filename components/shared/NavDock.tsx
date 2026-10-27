"use client";

import { Dock, DockIcon } from "@/components/ui/dock";
import { dockItems } from "@/src/sections/config/dockItems";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export function NavDock() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isHidden, setIsHidden] = useState(false);
  // Track whether the viewport is mobile-sized (< 768px / Tailwind's md breakpoint)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      // Handle same-page anchor links (e.g. /#projects)
      const anchorMatch = href.match(/^\/?#(.+)$|^\/#(.+)$/);
      if (anchorMatch) {
        const id = anchorMatch[1] || anchorMatch[2];
        if (isHome) {
          e.preventDefault();
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
        // If not on home, let Next.js navigate normally — it will land with the hash
        return;
      }
    },
    [isHome],
  );

  useEffect(() => {
    // Footer-proximity hiding applies whenever the dock is at the bottom
    // (home page always, or any page on mobile)
    const dockIsBottom = isHome || isMobile;

    if (!dockIsBottom) {
      setIsHidden(false);
      return;
    }

    const handleScroll = () => {
      const footer = document.querySelector("footer");
      if (!footer) return;

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Dock sits ~40px from the bottom; hide with 100px buffer
      const dockBottomPosition = windowHeight - 40;
      setIsHidden(footerRect.top < dockBottomPosition + 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isHome, isMobile]);

  // Positioning:
  //   mobile (all pages)  → bottom-10
  //   desktop home        → bottom-10
  //   desktop non-home    → top-6
  // Slide direction when hiding follows the same rule.
  const dockIsBottom = isHome || isMobile;

  return (
    <nav
      className={cn(
        "fixed left-1/2 -translate-x-1/2 transition-all duration-300 motion-reduce:transition-none z-50",
        // Mobile: always bottom. Desktop: home → bottom, else → top.
        isHome ? "bottom-10" : "bottom-10 md:bottom-auto md:top-6",
        isHidden
          ? cn(
            "opacity-0 pointer-events-none",
            dockIsBottom ? "translate-y-20" : "-translate-y-20",
          )
          : "opacity-100",
      )}
      aria-label="Main navigation dock"
    >
      <TooltipProvider>
        <Dock direction="middle">
          {dockItems
            .filter((item) => !item.showOnlyWhenNotHome || !isHome)
            .filter((item) => !(item.hideOnMobileHome && isHome && isMobile))
            .filter((item) => {
              if (!item.hideOnPaths) return true;
              return !item.hideOnPaths.some(
                (p) => pathname === p || pathname.startsWith(`${p}/`),
              );
            })
            .filter((item) => {
              // Hide the dock item that points to the current page.
              // Skip externals, anchors, and the separator.
              if (item.external || item.id === "separator") return true;
              if (item.href.includes("#")) return true;
              return item.href !== pathname && !pathname.startsWith(`${item.href}/`);
            })
            .map((item) =>
              item.id === "separator" ? (
                <Separator
                  key={item.id}
                  orientation="vertical"
                  className="h-full"
                  role="separator"
                  aria-hidden="true"
                />
              ) : (
                <DockIcon key={item.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        aria-label={item.label}
                        onClick={(e) => handleClick(e, item.href)}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "icon" }),
                          "size-12 rounded-full focus-visible:ring-2 focus-visible:ring-ember-500 focus-visible:ring-offset-2",
                        )}
                      >
                        <item.icon className="size-4" aria-hidden="true" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </DockIcon>
              ),
            )}
        </Dock>
      </TooltipProvider>
    </nav>
  );
}
