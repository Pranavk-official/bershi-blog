"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { Button } from "@components/ui/button";

interface LinkedInEmbedProps {
    embedUrl: string;
    height?: number;
    width?: number;
}

/**
 * LinkedIn embed with a Chrome-safe fallback.
 *
 * Chrome 84+ blocks LinkedIn iframes via SameSite cookie restrictions and
 * LinkedIn's `frame-ancestors 'none'` CSP directive. We detect Chrome on the
 * client and render a link-based fallback instead of an invisible broken iframe.
 */
export function LinkedInEmbed({
    embedUrl,
    height = 903,
    width = 504,
}: LinkedInEmbedProps) {
    const [chromeBlocked, setChromeBlocked] = useState(false);

    useEffect(() => {
        // Chrome (but not Edge/Opera which also include "Chrome" in UA)
        const ua = navigator.userAgent;
        const isChrome = /Chrome\//.test(ua) && !/Edg\/|OPR\//.test(ua);
        if (isChrome) {
            setChromeBlocked(true);
        }
    }, []);

    // Derive the public post URL from the embed URL:
    // https://www.linkedin.com/embed/feed/update/… → https://www.linkedin.com/feed/update/…
    const postUrl = embedUrl.replace(
        "linkedin.com/embed/feed/update/",
        "linkedin.com/feed/update/",
    );

    if (chromeBlocked) {
        return (
            <div
                className="mx-auto flex flex-col items-center justify-center gap-4 rounded-lg border border-border bg-muted/30 p-8 text-center"
                style={{ maxWidth: width }}
            >
                <SiLinkedin className="h-10 w-10 text-[#0A66C2]" />
                <div>
                    <p className="font-medium">LinkedIn embed unavailable in Chrome</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Chrome&apos;s SameSite cookie policy and LinkedIn&apos;s CSP
                        block this embed. View the post directly instead.
                    </p>
                </div>
                <Button asChild variant="outline" className="gap-2">
                    <a href={postUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        View on LinkedIn
                    </a>
                </Button>
            </div>
        );
    }

    return (
        <iframe
            src={embedUrl}
            height={height}
            width={width}
            // frameBorder={0}
            allowFullScreen
            title="Embedded LinkedIn post"
            loading="lazy"
            className="max-w-full rounded-lg border border-border"
        />
    );
}
