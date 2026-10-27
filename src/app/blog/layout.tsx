import { Metadata } from "next";
import { siteConfig } from "@config/site";
import { ScrollProgress } from "@/components/ui/scroll-progress";

export const metadata: Metadata = {
    title: {
        default: "Blog",
        template: `%s | ${siteConfig.name}`,
    },
    description: "Thoughts, tutorials, and insights about software development.",
    openGraph: {
        title: "Blog",
        description: "Thoughts, tutorials, and insights about software development.",
        type: "website",
        url: `${siteConfig.url}/blog`,
        siteName: siteConfig.name,
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ScrollProgress className="h-1" />
            {children}
        </>
    );
}