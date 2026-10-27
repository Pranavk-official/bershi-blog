import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getPostMetadataBySlug, type PostMetadata } from '@/lib/notion';
import { siteConfig } from '@/config/site';

// Remove edge runtime to allow Node.js APIs
// export const runtime = 'edge';

export const alt = 'Blog Post';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Load background image from filesystem (Next.js project directory)
    const logoData = await readFile(join(process.cwd(), 'public/og-image.png'));
    const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`;

    // Fetch post metadata with error handling
    let post: PostMetadata | null = null;
    try {
        post = await getPostMetadataBySlug(slug);
    } catch (error) {
        console.error('Error fetching post metadata for OG image:', error);
    }

    if (!post) {
        return new ImageResponse(
            (
                <div
                    style={{
                        fontSize: 48,
                        background: 'white',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    Post not found
                </div>
            ),
            {
                ...size,
            }
        );
    }

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#09090b',
                    position: 'relative',
                }}
            >
                {/* Background Image with Overlay Effect */}
                <img
                    src={logoSrc}
                    alt="Background"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.2,
                    }}
                />

                {/* Content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                        padding: '60px',
                        zIndex: 1,
                        textAlign: 'center',
                    }}
                >
                    {post.tags && post.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {post.tags.map((tag) => (
                                <div
                                    key={tag}
                                    style={{
                                        fontSize: 20,
                                        padding: '8px 20px',
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        borderRadius: '9999px',
                                        color: '#e4e4e7',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        fontWeight: 500,
                                    }}
                                >
                                    {tag}
                                </div>
                            ))}
                        </div>
                    )}

                    <div
                        style={{
                            fontSize: 72,
                            fontWeight: 800,
                            lineHeight: 1.1,
                            marginTop: '20px',
                            marginBottom: '20px',
                            color: 'white',
                            textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                            maxWidth: '1000px',
                        }}
                    >
                        {post.title}
                    </div>

                    {post.description && (
                        <div
                            style={{
                                fontSize: 32,
                                color: '#e4e4e7',
                                lineHeight: 1.4,
                                maxWidth: '900px',
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                opacity: 0.9,
                            }}
                        >
                            {post.description}
                        </div>
                    )}
                </div>

                {/* Footer/Brand */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 50,
                        display: 'flex',
                        alignItems: 'center',
                        zIndex: 1,
                        gap: '12px',
                    }}
                >
                    <div style={{
                        fontSize: 24,
                        color: '#e4e4e7',
                        fontWeight: 600,
                        padding: '8px 16px',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        borderRadius: '8px',
                    }}>
                        {siteConfig.name}
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
