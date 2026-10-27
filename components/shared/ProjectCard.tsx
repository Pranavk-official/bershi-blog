"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@sections/projects/config/projects";

// Category display configuration
const categoryConfig: Record<
    Project["category"],
    { label: string; className: string }
> = {
    "web-app": {
        label: "Web App",
        className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    mobile: {
        label: "Mobile",
        className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
    tool: {
        label: "Tool",
        className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    community: {
        label: "Community",
        className: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    },
};

interface ProjectCardProps {
    project: Project;
    className?: string;
    index?: number;
}

export function ProjectCard({ project, className, index = 0 }: ProjectCardProps) {
    const categoryInfo = categoryConfig[project.category];
    const slug = project.id;

    return (
        <Link href={`/projects/${slug}`} className="group/card block h-full">
            <div
                className={cn(
                    "relative z-10 h-full overflow-hidden rounded-lg bg-card",
                    className
                )}
            >
                <article className="flex h-full flex-col">
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden">
                        <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={index < 3}
                        />
                        {/* Category Badge Overlay */}
                        <div className="absolute left-3 top-3">
                            <Badge
                                variant="outline"
                                className={cn(
                                    "backdrop-blur-md border font-medium",
                                    categoryInfo.className
                                )}
                            >
                                {categoryInfo.label}
                            </Badge>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                        {/* Title */}
                        <h3 className="mb-2 text-lg font-semibold leading-tight text-foreground group-hover/card:text-primary transition-colors">
                            {project.title}
                        </h3>

                        {/* Description */}
                        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                            {project.shortDescription}
                        </p>

                        {/* Tech Stack */}
                        <div className="mb-4 flex flex-wrap gap-1.5">
                            {project.technologies.slice(0, 4).map((tech) => (
                                <Badge
                                    key={tech}
                                    variant="secondary"
                                    className="text-xs font-normal"
                                >
                                    {tech}
                                </Badge>
                            ))}
                            {project.technologies.length > 4 && (
                                <Badge variant="secondary" className="text-xs font-normal">
                                    +{project.technologies.length - 4}
                                </Badge>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="mt-auto flex items-center justify-between">
                            {/* Time Period */}
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{project.year}</span>
                            </div>

                            {/* View More */}
                            <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover/card:opacity-100">
                                View Case Study
                                <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                        </div>
                    </div>
                </article>
            </div>
        </Link>
    );
}
