import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/config/site";

export const alt = `Art — ${siteConfig.name}`;
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
    const bgData = await readFile(
        join(process.cwd(), "public/wallpapers/16x9/Goblin_16x9_1.png"),
    );
    const bgSrc = `data:image/png;base64,${bgData.toString("base64")}`;

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#09090b",
                    position: "relative",
                }}
            >
                {/* Background wallpaper preview */}
                <img
                    src={bgSrc}
                    alt=""
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.35,
                    }}
                />

                {/* Dark gradient overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(180deg, rgba(9,9,11,0.35) 0%, rgba(9,9,11,0.85) 100%)",
                    }}
                />

                {/* Content */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 24,
                        padding: 60,
                        textAlign: "center",
                        zIndex: 1,
                    }}
                >
                    <div
                        style={{
                            fontSize: 24,
                            padding: "8px 20px",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            borderRadius: 9999,
                            color: "#e4e4e7",
                            border: "1px solid rgba(255,255,255,0.2)",
                            fontWeight: 500,
                        }}
                    >
                        Art
                    </div>

                    <div
                        style={{
                            fontSize: 96,
                            fontWeight: 800,
                            lineHeight: 1.05,
                            color: "white",
                            textShadow: "0 4px 12px rgba(0,0,0,0.55)",
                        }}
                    >
                        Original art
                    </div>

                    <div
                        style={{
                            fontSize: 30,
                            color: "#e4e4e7",
                            lineHeight: 1.35,
                            maxWidth: 900,
                            textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                            opacity: 0.95,
                        }}
                    >
                        Original desktop and mobile artwork — free downloads for
                        personal use.
                    </div>
                </div>

                {/* Footer brand */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 50,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        zIndex: 1,
                    }}
                >
                    <div
                        style={{
                            fontSize: 24,
                            color: "#e4e4e7",
                            fontWeight: 600,
                            padding: "8px 16px",
                            backgroundColor: "rgba(0,0,0,0.45)",
                            borderRadius: 8,
                        }}
                    >
                        {`${siteConfig.url}/art`}
                    </div>
                </div>
            </div>
        ),
        { ...size },
    );
}
