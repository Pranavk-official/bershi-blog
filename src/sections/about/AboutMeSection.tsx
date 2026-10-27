"use client";

import { BlurFade } from "@components/ui/blur-fade";
import ScrollElement from "@components/ui/scroll-animation";
import { Highlighter } from "@/components/ui/highlighter";

const AboutMeSection = () => {
    return (
        <section
            className="relative py-20 min-h-screen flex items-center"
            aria-labelledby="about-heading"
        >
            <div className="container mx-auto px-4 md:px-8">
                {/* Section Header */}
                <div className="mb-16 text-center">
                    <ScrollElement
                        viewport={{ amount: 0.5, margin: "0px 0px -100px 0px" }}
                        className="mx-auto max-w-3xl"
                    >
                        <h2
                            id="about-heading"
                            className="text-4xl font-bold tracking-tight md:text-5xl"
                        >
                            <span className="text-foreground">About </span>
                            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Me
                            </span>
                        </h2>
                    </ScrollElement>
                </div>

                {/* Content - Centered Layout */}
                <div className="mx-auto max-w-4xl">
                    <BlurFade delay={0.2} inView direction="up">
                        <div className="space-y-8 text-center">

                            {/* Introduction with highlighted keywords */}
                            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                                I am{" "}
                                <Highlighter action="highlight" color="#ffd1dc" isView={true}>
                                    <strong>Pranav K</strong>
                                </Highlighter>
                                , a passionate{" "}
                                <Highlighter action="highlight" color="#87CEFA" isView={true}>
                                    <strong>Full Stack Developer</strong>
                                </Highlighter>{" "}
                                with deep expertise in{" "}
                                <Highlighter action="underline" color="#FF9800" isView={true}>
                                    <strong>MERN Stack</strong>
                                </Highlighter>{" "}
                                and modern web technologies. My journey in tech is defined by a relentless curiosity and a drive to build scalable, high-performance web applications.
                            </p>

                            {/* Additional paragraphs */}
                            <div className="space-y-6">
                                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                                    As a self-taught developer, I believe in the power of continuous learning. I don't just write code; I share knowledge through{" "}
                                    <Highlighter action="highlight" color="#90EE90" isView={true}>
                                        <strong>mentoring aspiring developers</strong>
                                    </Highlighter>
                                    , and contributing to the community.
                                </p>
                                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                                    When I'm not architecting software solutions, you can find me{" "}
                                    <Highlighter action="highlight" color="#FFB6C1" isView={true}>
                                        exploring new technologies
                                    </Highlighter>
                                    , optimizing developer workflows, or sharing insights on the latest trends in web development.
                                </p>
                            </div>
                        </div>
                    </BlurFade>
                </div>
            </div>
        </section>
    );
};

export default AboutMeSection;
