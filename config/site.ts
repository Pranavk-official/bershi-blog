export type SiteConfig = typeof siteConfig;

// Get base URL from environment variable or use production URL as fallback
const getBaseUrl = () => {
  // In production (Vercel), use the environment variable or fallback to the production URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Default production URL
  return "https://bershi-blog.vercel.app";
};

const baseUrl = getBaseUrl();

export const siteConfig = {
  name: "Pranav K",
  title: "Pranav K - Full Stack Developer",
  tagline: "Full stack developer. Notes on code, craft and the web.",
  description:
    "Pranav K, full stack developer. Notes on code, craft and the web, plus original art and free wallpapers.",
  url: baseUrl,
  ogImage: `${baseUrl}/og-image.png`, // Use dynamic base URL
  links: {
    github: "https://github.com/Pranavk-official",
    linkedin: "https://linkedin.com/in/pranav-k-cse",
    twitter: "https://twitter.com/@Arch_Lad_",
    email: "mailto:me@pranavk.site",
  },
  author: {
    name: "Pranav K",
    url: baseUrl,
  },
  creator: "Pranav K",
  keywords: [
    "Full Stack Developer",
    "Web Developer",
    "React Developer",
    "Node.js Developer",
    "MongoDB",
    "Express.js",
    "MERN Stack",
    "JavaScript",
    "TypeScript",
    "Next.js",
    "Portfolio",
  ],
};
