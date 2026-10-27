"use client";

import { ProfileCard } from "@components/hero/ProfileCard";
import { Quote } from "@components/hero/Quote";

const HeroSection = () => {
  return (
    <section className="relative flex h-screen w-full items-center justify-center">
      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Profile Card */}
          <div className="flex justify-center">
            <ProfileCard />
          </div>

          {/* Quote */}
          <div className="flex items-center justify-center">
            <Quote />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
