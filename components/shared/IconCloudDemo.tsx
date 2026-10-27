"use client"

import { useEffect, useState } from "react"
import { IconCloud } from "@components/ui/icon-cloud"
import {
    SiTypescript,
    SiJavascript,
    SiDart,
    SiReact,
    SiFlutter,
    SiAndroid,
    SiHtml5,
    SiCss3,
    SiNodedotjs,
    SiExpress,
    SiNextdotjs,
    SiPrisma,
    SiAmazon,
    SiPostgresql,
    SiFirebase,
    SiNginx,
    SiVercel,
    SiTestinglibrary,
    SiJest,
    SiCypress,
    SiDocker,
    SiGit,
    SiJira,
    SiGithub,
    SiGitlab,
    SiAndroidstudio,
    SiSonarqube,
    SiFigma,
} from "react-icons/si"
import { VscVscode } from "react-icons/vsc";


export function IconCloudDemo() {
    const [iconColor, setIconColor] = useState("#212121")
    const size = 95

    useEffect(() => {
        const updateIconColor = () => {
            const isDark = document.body.classList.contains("dark")
            // Light mode: dark color (foreground), Dark mode: light color (primary)
            setIconColor(isDark ? "#ebebeb" : "#212121")
        }

        // Set initial color
        updateIconColor()

        // Watch for theme changes
        const observer = new MutationObserver(updateIconColor)
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"],
        })

        return () => observer.disconnect()
    }, [])

    const icons = [
        <SiTypescript key="typescript" size={size} color={iconColor} />,
        <SiJavascript key="javascript" size={size} color={iconColor} />,
        <SiDart key="dart" size={size} color={iconColor} />,
        <SiReact key="react" size={size} color={iconColor} />,
        <SiFlutter key="flutter" size={size} color={iconColor} />,
        <SiAndroid key="android" size={size} color={iconColor} />,
        <SiHtml5 key="html5" size={size} color={iconColor} />,
        <SiCss3 key="css3" size={size} color={iconColor} />,
        <SiNodedotjs key="nodejs" size={size} color={iconColor} />,
        <SiExpress key="express" size={size} color={iconColor} />,
        <SiNextdotjs key="nextjs" size={size} color={iconColor} />,
        <SiPrisma key="prisma" size={size} color={iconColor} />,
        <SiAmazon key="aws" size={size} color={iconColor} />,
        <SiPostgresql key="postgresql" size={size} color={iconColor} />,
        <SiFirebase key="firebase" size={size} color={iconColor} />,
        <SiNginx key="nginx" size={size} color={iconColor} />,
        <SiVercel key="vercel" size={size} color={iconColor} />,
        <SiTestinglibrary key="testing" size={size} color={iconColor} />,
        <SiJest key="jest" size={size} color={iconColor} />,
        <SiCypress key="cypress" size={size} color={iconColor} />,
        <SiDocker key="docker" size={size} color={iconColor} />,
        <SiGit key="git" size={size} color={iconColor} />,
        <SiJira key="jira" size={size} color={iconColor} />,
        <SiGithub key="github" size={size} color={iconColor} />,
        <SiGitlab key="gitlab" size={size} color={iconColor} />,
        <VscVscode key="vscode" size={size} color={iconColor} />,
        <SiAndroidstudio key="androidstudio" size={size} color={iconColor} />,
        <SiSonarqube key="sonarqube" size={size} color={iconColor} />,
        <SiFigma key="figma" size={size} color={iconColor} />,
    ]

    return (
        <div className="absolute top-9 right-1 h-[300px] border-none mask-[linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-105">
            <div className="flex size-full items-center justify-center overflow-hidden">
                <IconCloud icons={icons} />
            </div>
        </div>
    )
}