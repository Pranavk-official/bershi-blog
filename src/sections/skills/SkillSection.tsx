"use client";

import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";
import { skillCategories, tools } from "./config/tools";
import { SkillCategory } from "./components/SkillCategory";
import ScrollElement from "@/components/ui/scroll-animation";

const VELOCITIES = [3, 4, 2, 3, 4, 2, 3, 4, 2, 3] as const;
const DIRECTIONS = [1, -1, 1, -1, 1, -1, 1, -1, 1, -1] as const;

const SkillSection = () => {
  const rows = Array.from({ length: 5 }, (_, i) =>
    Array.from({ length: 10 }, (__, j) => tools[(i * 5 + j) % tools.length]),
  );

  return (
    <section
      className="relative w-full pt-20 overflow-hidden"
      aria-labelledby="skills-heading"
    >
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-12 text-center mx-auto max-w-3xl">
          <h2
            id="skills-heading"
            className="text-4xl font-bold tracking-tight md:text-5xl"
          >
            <span className="text-foreground">Technical </span>
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Skills.
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Here are some of the skills I have:
          </p>
        </div>

        {/* Cards area — marquee fills this block */}
        <div className="relative max-w-6xl mx-auto py-8 pb-16">
          {/* Background Scroll Velocity */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <ScrollVelocityContainer className="opacity-[0.07] h-full flex flex-col justify-between">
              {rows.map((row, i) => (
                <ScrollVelocityRow
                  key={i}
                  baseVelocity={VELOCITIES[i]}
                  direction={DIRECTIONS[i]}
                >
                  {row.map((tool, j) => {
                    const Icon = tool.icon;
                    return (
                      <div key={`${tool.name}-${j}`} className="mx-6">
                        <Icon className="w-10 md:w-12 lg:w-14 h-10 md:h-12 lg:h-14" />
                      </div>
                    );
                  })}
                </ScrollVelocityRow>
              ))}
            </ScrollVelocityContainer>
            {/* Gradient overlays */}
            <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r" />
            <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l" />
          </div>

          <div className="relative z-10 w-full flex flex-wrap justify-center gap-6">
            {skillCategories.map((category, index) => (
              <div key={category.id} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                <SkillCategory
                  category={category}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillSection;
