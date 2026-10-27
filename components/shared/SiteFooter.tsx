import Link from "next/link";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

import { siteConfig } from "@config/site";
import { menu } from "@components/shared/menu";
import { Smiley } from "@components/shared/Doodles";

const socials = [
  { label: "GitHub", href: siteConfig.links.github, Icon: FaGithub },
  { label: "LinkedIn", href: siteConfig.links.linkedin, Icon: FaLinkedin },
  { label: "Twitter", href: siteConfig.links.twitter, Icon: FaSquareXTwitter },
  { label: "Email", href: siteConfig.links.email, Icon: FaEnvelope },
];

const heading = "mb-2 inline-block border-b border-foreground text-xs font-bold uppercase tracking-wide";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t-2 border-foreground bg-secondary sm:mt-28">
      <div className="page grid gap-8 py-10 sm:grid-cols-[1.3fr_1fr_1fr] sm:divide-x sm:divide-foreground/30">
        <div className="flex items-start gap-4">
          <Smiley className="size-14 shrink-0" />
          <div>
            <p className="font-hand text-3xl leading-none whitespace-nowrap">
              {siteConfig.name}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              © {new Date().getFullYear()} {siteConfig.name}
              <br />
              All rights reserved
            </p>
          </div>
        </div>

        <nav aria-label="Footer" className="sm:pl-8">
          <p className={heading}>Explore</p>
          <ul className="space-y-1 text-sm">
            {menu.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sm:pl-8">
          <p className={heading}>Elsewhere</p>
          <ul className="space-y-1 text-sm">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-primary"
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
