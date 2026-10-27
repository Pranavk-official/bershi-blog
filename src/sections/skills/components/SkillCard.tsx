"use client";

import type { Skill } from "../config/tools";

export function SkillCard({ skill }: { skill: Skill }) {
    const Icon = skill.icon;

    return (
        <div
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-border/60 bg-background/80 text-sm font-medium text-foreground/80 cursor-default"
        >
            <Icon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
            <span>{skill.name}</span>
        </div>
    );
}
