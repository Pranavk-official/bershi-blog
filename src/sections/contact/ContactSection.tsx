"use client";

import { HostingerContactForm } from "@components/shared/HostingerContactForm";
import { BlurFade } from "@components/ui/blur-fade";
import ScrollElement from "@components/ui/scroll-animation";
import { ArrowRight, Mail, MapPin } from "lucide-react";

const ContactSection = () => {
    return (
        <section
            className="relative py-20 overflow-hidden"
            aria-labelledby="contact-heading"
        >
            {/* Decorative gradient background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-linear-to-br from-primary/5 to-primary/10 blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-linear-to-br from-primary/10 to-primary/5 blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="mb-16 text-center">
                    <ScrollElement
                        viewport={{ amount: 0.5, margin: "0px 0px -100px 0px" }}
                        className="mx-auto max-w-3xl"
                    >
                        <h2
                            id="contact-heading"
                            className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl"
                        >
                            Get In Touch
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Have a project in mind or just want to say hello? I&apos;d love to hear from you.
                        </p>
                    </ScrollElement>
                </div>

                {/* Two column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
                    {/* Contact info */}
                    <BlurFade delay={0.1} inView direction="left">
                        <div className="space-y-8 text-center lg:text-left">
                            <div>
                                <h3 className="text-2xl font-semibold mb-4">
                                    Let&apos;s work together
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    I&apos;m always open to discussing new projects, creative ideas,
                                    or opportunities to be part of your vision. Drop me a message
                                    and I&apos;ll get back to you as soon as possible.
                                </p>
                            </div>

                            {/* Contact details */}
                            <div className="space-y-3">
                                <a
                                    href="mailto:me+portfolio@pranavk.site"
                                    className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/50 px-4 py-3 backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-card/80"
                                >
                                    <div className="flex items-center justify-center w-11 h-11 shrink-0 rounded-lg bg-primary/10">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</p>
                                        <p className="font-medium">me@pranavk.site</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 shrink-0 text-muted-foreground" />
                                </a>

                                <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/50 px-4 py-3 backdrop-blur-sm">
                                    <div className="flex items-center justify-center w-11 h-11 shrink-0 rounded-lg bg-primary/10">
                                        <MapPin className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Location</p>
                                        <p className="font-medium">Kerala, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BlurFade>

                    {/* Contact Form */}
                    <BlurFade delay={0.2} inView direction="right">
                        <HostingerContactForm />
                    </BlurFade>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
