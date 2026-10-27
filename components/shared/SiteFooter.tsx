import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

import { siteConfig } from "@config/site";
import { Smiley } from "@components/shared/Doodles";

const socials = [
  { label: "GitHub", href: siteConfig.links.github, Icon: FaGithub },
  { label: "LinkedIn", href: siteConfig.links.linkedin, Icon: FaLinkedin },
  { label: "Twitter", href: siteConfig.links.twitter, Icon: FaSquareXTwitter },
  { label: "Email", href: siteConfig.links.email, Icon: FaEnvelope },
];

// Page links live in the header and the phone tab bar, so the footer only signs off.
export function SiteFooter() {
  return (
    <footer className="mt-12 border-t-2 border-foreground bg-secondary sm:mt-28">
      <div className="page flex flex-col items-center gap-1 py-4 sm:flex-row sm:justify-between sm:gap-8 sm:py-6">
        <div className="flex items-center gap-3">
          <Smiley className="size-8 shrink-0 sm:size-10" />
          <p className="font-hand text-xl leading-none sm:text-2xl">{siteConfig.name}</p>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()}</p>
        </div>

        <ul className="-mx-2 flex items-center">
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-11 place-items-center text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon className="size-[18px]" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
