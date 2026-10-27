"use client";

import { Meteors } from "@components/ui/meteors";
import { dockItems } from "@/src/sections/config/dockItems";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";
import { siteConfig } from "@/src/config/site";

function FooterSection() {
  // Filter out separator and non-social items
  // const socialLinks = dockItems.filter(
  //   (item) =>
  //     item.id !== "separator" &&
  //     item.id !== "blog" &&
  //     item.id !== "resume" &&
  //     item.id !== "home",
  // );

  const socialLinks = dockItems.filter((item) =>
    ["github", "linkedin", "twitter", "email"].includes(item.id),
  );

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="footer-bg relative border w-full sm:w-[95%] mx-auto rounded-lg overflow-hidden radial-gradient-bg pb-14
                    [--gradient-center:#f3f4f6] [--gradient-edge:#f3f4f6]
                    dark:[--gradient-center:#02081765] dark:[--gradient-edge:#020817]"
    >
      {/* Meteors Background Effect */}
      <Meteors number={30} />

      <div className="gap-10 sm:flex justify-between p-5 2xl:py-10 py-5 bg-primary dark:bg-primary rounded-xs rounded-b-none text-primary-foreground">
        <div className="w-fit flex-col flex justify-center">
          <div className="w-16 sm:w-20 2xl:w-24 h-16 sm:h-20 2xl:h-24 ml-3 bg-background rounded-xs before:absolute relative before:w-full before:h-full before:bg-background/50 before:rounded-md before:-top-3 before:-left-3 p-2">
            <Image
              src="/avatar_.png"
              alt="Pranav K Avatar"
              width={96}
              height={96}
              className="w-full h-full object-cover rounded-sm relative z-10"
            />
          </div>
          <article className="py-2 w-full sm:w-64 2xl:w-80 space-y-1">
            <h1 className="newFont text-2xl sm:text-3xl font-bold">Pranav K</h1>
            <p className="text-xs sm:text-sm leading-[120%]">
              Building digital experiences with modern web technologies.
              Passionate about creating clean, responsive, and user-friendly
              interfaces that make a difference.
            </p>
          </article>
        </div>

        <div className="sm:block flex sm:mt-0 mt-4 gap-2 sm:w-auto w-full sm:space-y-2 relative z-10">
          {socialLinks.map((social) => (
            <Link
              key={social.id}
              href={social.href}
              target={social.external ? "_blank" : undefined}
              rel={social.external ? "noopener noreferrer" : undefined}
              className="bg-background sm:w-auto w-full grid place-content-center h-10 sm:h-12 p-2.5 rounded-lg hover:bg-muted transition-colors"
              aria-label={social.label}
            >
              <social.icon className="w-5 h-5 text-primary" />
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Credit */}
      <div className="absolute bottom-0 left-0 right-0 py-4 px-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-muted-foreground bg-gradient-to-t from-background/80 to-transparent">
        <p>
          © {currentYear} {siteConfig.name}. All rights reserved.
        </p>
        <Link
          href="https://github.com/Pranavk-Official"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors text-foreground font-medium"
        >
          <FaGithub className="w-4 h-4" />
          <span>Follow on GitHub</span>
        </Link>
      </div>
    </footer>
  );
}

export default FooterSection;
