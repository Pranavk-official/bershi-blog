"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@config/site";
import { cn } from "@lib/utils";
import { menu } from "@components/shared/menu";


export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="page pt-6">
      <div className="flex flex-wrap items-center gap-x-10 gap-y-2 border-b-2 border-foreground pb-3 pr-12">
        <Link
          href="/"
          aria-label={`${siteConfig.name} — home`}
          className="font-hand text-3xl leading-none whitespace-nowrap text-foreground"
        >
          {siteConfig.name}
        </Link>

        <nav aria-label="Primary" className="mx-auto">
          <ul className="flex flex-wrap items-center gap-x-1 sm:gap-x-4">
            {menu.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "inline-block border-b border-transparent px-2 py-2 text-sm transition-colors",
                    isActive(item.href)
                      ? "border-foreground text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
