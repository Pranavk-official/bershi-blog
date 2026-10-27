"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { workExperiences } from "./config/workExperience";
import { TimelineItem } from "./components/TimelineItem";
import { TimelineConnector } from "./components/TimelineConnector";
import { validateWorkExperiences } from "./utils/validation";
import { useMemo } from "react";
import ScrollElement from "@/components/ui/scroll-animation";

const ExperienceSection = () => {
    // Validate work experiences and filter out invalid/future entries
    const { validExperiences, hasFutureHidden } = useMemo(() => {
        const validated = validateWorkExperiences(workExperiences);

        // Detect if any entries were hidden due to a future YYYY-MM-DD startDate
        const fullDateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const futureHidden = workExperiences.some(
            (exp) => fullDateRegex.test(exp.startDate) && new Date(exp.startDate) > today
        );

        // Log warning in development mode if any entries were filtered out
        if (process.env.NODE_ENV === 'development' && validated.length !== workExperiences.length) {
            console.warn(
                `ExperienceSection: ${workExperiences.length - validated.length} work experience entries were filtered out`
            );
        }

        return { validExperiences: validated, hasFutureHidden: futureHidden };
    }, []);

    return (
        <section className="py-10 min-h-screen relative overflow-hidden" aria-labelledby="experience-heading">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                {/* Section heading */}
                <div className="mb-12 text-center">
                    <ScrollElement
                        viewport={{ amount: 0.5, margin: "0px 0px -100px 0px" }}
                        className="mx-auto max-w-3xl"
                    >
                        <h2
                            id="experience-heading"
                            className="text-4xl font-bold tracking-tight md:text-5xl"
                        >
                            <span className="text-foreground">My </span>
                            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Experience
                            </span>
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Professional journey and key achievements
                        </p>
                    </ScrollElement>
                </div>


                {/* Timeline container */}
                <div className="relative pt-8">
                    {/* Timeline connector line */}
                    <TimelineConnector />

                    {/* Experience items with staggered animations */}
                    <div role="list" aria-label="Timeline of work experiences">
                        {validExperiences.map((experience, index) => (
                            <BlurFade
                                key={experience.id}
                                delay={0.25 * index}
                                inView
                                direction="up"
                            >
                                <TimelineItem
                                    experience={experience}
                                    isAlternating={index % 2 === 1}
                                    isEffectivelyPresent={index === 0 && hasFutureHidden}
                                />
                            </BlurFade>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExperienceSection;
