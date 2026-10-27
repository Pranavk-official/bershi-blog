"use client";

import { PixelImage } from "../ui/pixel-image";
import { isChristmasHoliday } from "@/lib/utils";
// import { useEffect, useState } from "react";

export function ProfileCard() {
  // const [isDark, setIsDark] = useState(false);

  // useEffect(() => {
  //   const updateTheme = () => {
  //     setIsDark(document.body.classList.contains("dark"));
  //   };

  //   updateTheme();

  //   const observer = new MutationObserver(updateTheme);
  //   observer.observe(document.body, {
  //     attributes: true,
  //     attributeFilter: ["class"],
  //   });

  //   return () => observer.disconnect();
  // }, []);

  // const imgUrl = isDark ? "/profile_dark.png" : "/profile_img.png";

  const avatarSrc = isChristmasHoliday()
    ? "/xmas-avatar.png"
    : "/profile_dark.png";

  return (
    <div className="relative h-72 w-72 md:h-96 md:w-96 mx-auto">
      <PixelImage src={avatarSrc} grid="8x8" />

      {/* Text - Center Bottom of Image */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white whitespace-nowrap">
          Pranav K
        </h1>
        <p className="text-sm md:text-base text-white font-medium whitespace-nowrap">
          Full Stack Developer
        </p>
      </div>
    </div>
  );
}
