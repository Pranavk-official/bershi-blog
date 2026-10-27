export interface Project {
  id: string;
  title: string;
  year: string;
  shortDescription: string;
  fullDescription: string;
  technologies: string[];
  features: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: "web-app" | "mobile" | "tool" | "community";
  imageUrl: string;
}

export const projects: Project[] = [
  {
    id: "rustylens",
    title: "RustyLens",
    year: "Apr 2026",
    shortDescription:
      "Lightweight open-source OCR tool for the Linux desktop — extract text from images with bounding-box overlays, similar to Google Lens.",
    fullDescription:
      "A lightweight, open-source OCR desktop application for Linux that uses Tesseract under the hood. Open an image or capture a screenshot via the XDG Portal and RustyLens extracts text with bounding-box word overlays, drag-to-select copying, and support for 100+ languages. Ships as a native binary, AppImage, or Flatpak.",
    technologies: ["Rust", "GTK4", "libadwaita", "Tesseract", "Cairo", "Flatpak", "AppImage", "XDG Portal"],
    features: [
      "OCR text extraction supporting 100+ languages with auto-detection of all installed Tesseract language packs",
      "Bounding-box overlay rendered via Cairo — click or drag across highlighted words to select and copy with Ctrl+C",
      "Screenshot mode via XDG Desktop Portal (`rustylens --capture`) for immediate in-context OCR",
      "Language selector dropdown with human-readable names; 'Auto (all)' uses every installed pack simultaneously",
      "Cross-distro installer (Arch, Ubuntu, Fedora) with native binary, AppImage, and Flatpak distribution formats",
    ],
    githubUrl: "https://github.com/Pranavk-official/rustylens",
    liveUrl: "https://pranavk-official.github.io/rustylens/",
    category: "tool",
    imageUrl: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1900&h=1080&fit=crop&q=80",
  },
  {
    id: "dil-se-bakery",
    title: "Dil Se Bakery",
    year: "Nov 2025",
    shortDescription:
      "Production-grade bakery e-commerce app with order queuing, inventory management, and Kanban admin dashboard.",
    fullDescription:
      "A full-stack, production-grade e-commerce application for a bakery, featuring sophisticated business logic for order queuing, real-time inventory control, and a comprehensive admin dashboard. Includes guest cart with automatic merging, intelligent pickup time scheduling, Redis-based concurrency control, and a Docker-ready deployment setup.",
    technologies: [
      "Next.js 16",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "Prisma",
      "Jotai",
      "TanStack Query",
      "Tailwind CSS",
      "Shadcn UI",
      "Zod",
      "Cloudinary",
      "Docker",
      "Bun",
    ],
    features: [
      "Smart guest cart with automatic merging upon login and real-time stock validation",
      "Intelligent pickup time slot scheduler using sequential order queuing with baking duration logic",
      "Kanban-style admin order management with status flow: Pending → Preparing → Ready → Completed",
      "Redis Mutex concurrency control to prevent race conditions and token bucket rate limiting for API protection",
      "Full CRUD inventory management with soft delete, image upload via Cloudinary, and bento grid admin dashboard",
    ],
    githubUrl: "https://github.com/Pranavk-official/dil_se",
    category: "web-app",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1900&h=1080&fit=crop&q=80",
  },
  {
    id: "decidr-backend",
    title: "Decidr — Backend for Mobile App",
    year: "Jun 2025 – Sep 2025",
    shortDescription:
      "TypeScript + Hono backend API powering real-time decision evaluation and adaptive personalization.",
    fullDescription:
      "High-performance backend API built with TypeScript and Hono framework, designed for mobile apps requiring real-time decision evaluation, feature gating, and adaptive personalization with optimized edge-friendly performance.",
    technologies: ["TypeScript", "Node.js (Hono)", "Zod", "PostgreSQL"],
    features: [
      "Designed and implemented RESTful endpoints optimized for low-latency mobile usage",
      "Built secure token-based authentication and multi-tenant authorization middleware",
      "Structured decision/rule models with validation, versioning, and serialization",
      "Optimized backend architecture for cold start reduction and edge-friendly performance",
    ],
    // githubUrl: "https://github.com/Pranavk-official",
    category: "mobile",
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1900&h=1080&fit=crop&q=80",
  },
  {
    id: "zrato-learning",
    title: "Zrato Learning Platform",
    year: "Feb 2025 – Jun 2025",
    shortDescription:
      "Modern full-stack e-learning platform with video lessons, quizzes, assignments, and analytics.",
    fullDescription:
      "A comprehensive e-learning platform built with Next.js 15 and React 19, featuring video lessons, interactive quizzes, assignments, learner analytics dashboards, and user assistance workflows. Includes video progress persistence, resource downloads, and complete learning continuity features.",
    technologies: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "TailwindCSS",
      "Cloudflare R2",
      "Vidstack",
      "Bun",
    ],
    features: [
      "Engineered learner analytics dashboards with progress charts, score gauges, and topic completion metrics",
      "Designed and implemented assistance request workflow with complete data model and migrations",
      "Enhanced quiz, assignment, onboarding, and topic progression flows with access guards",
      "Built video progress persistence and resource downloads for learning continuity",
      "Refactored schema and Prisma usage with seeding/migration workflows for fast iteration",
    ],
    liveUrl: "https://zrato.io",
    category: "web-app",
    imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1900&h=1080&fit=crop&q=80",
  },
  {
    id: "dr-dhruva-lms",
    title: "Dr. Dhruva's Learning Management System",
    year: "Nov 2024 – Jan 2025",
    shortDescription:
      "Medical e-learning platform for cardiac care, anaesthesiology, and intensive care courses.",
    fullDescription:
      "A specialized medical e-learning platform offering structured courses in cardiac care, anaesthesiology, and intensive care. Built with modern web technologies and containerized infrastructure for scalability and reliability.",
    technologies: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "TailwindCSS",
      "Docker",
      "Bun",
    ],
    features: [
      "Architected modular Next.js App Router codebase with separated auth, onboarding, and content flows",
      "Implemented secure authentication & authorization with protected routes",
      "Built course catalog, video delivery, and learner progress tracking features",
      "Created interactive quizzes, certificate workflows, and student dashboard for engagement",
      "Containerized PostgreSQL + Prisma ORM with migrations and cron jobs for maintenance",
    ],
    liveUrl: "https://drdhruva.com",
    category: "web-app",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1900&h=1080&fit=crop&q=80",
  },
  {
    id: "genexp",
    title: "genexp (Express Boilerplate Generator)",
    year: "Aug 2024",
    shortDescription:
      "CLI tool to generate Express.js boilerplate with TypeScript and best practices.",
    fullDescription:
      "A command-line tool that generates production-ready Express.js boilerplate code with TypeScript configuration, folder structure, and development best practices to accelerate project setup.",
    technologies: ["Node.js", "TypeScript"],
    features: [
      "Automated Express.js project scaffolding with TypeScript support",
      "Pre-configured folder structure following industry best practices",
      "Built-in development tooling and scripts",
      "Customizable templates for different project types",
    ],
    githubUrl: "https://github.com/Pranavk-official/genexp",
    liveUrl: "https://www.npmjs.com/package/genexp",
    category: "tool",
    imageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1900&h=1080&fit=crop&q=80",
  },
  {
    id: "solestride",
    title: "SoleStride",
    year: "2023 – 2024",
    shortDescription:
      "Full-stack e-commerce platform specializing in footwear with secure payments.",
    fullDescription:
      "A comprehensive e-commerce platform built with the MERN stack, specializing in footwear sales. Features secure authentication, payment processing, dynamic cart management, and optimized backend architecture for scalability.",
    technologies: ["Node.js", "Express.js", "MongoDB", "EJS", "Razorpay"],
    features: [
      "Developed full-stack e-commerce platform with seamless front-end and back-end integration",
      "Designed and implemented secure OAuth-based authentication for data protection",
      "Integrated Razorpay payment gateway for reliable and secure online transactions",
      "Built dynamic cart management and order tracking systems",
      "Optimized backend architecture for improved performance and scalability",
    ],
    githubUrl: "https://github.com/Pranavk-official/sole-stride",
    category: "web-app",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1900&h=1080&fit=crop&q=80",
  },
  {
    id: "signfy",
    title: "Signfy",
    year: "2021 – 2023",
    shortDescription:
      "Video chat platform with AI-based sign language detection for hearing-impaired users.",
    fullDescription:
      "An accessible video chat platform specifically designed for hearing-impaired users, featuring real-time AI-based sign language detection using TensorFlow.js and WebRTC for seamless peer-to-peer communication.",
    technologies: [
      "HTML",
      "CSS",
      "Bootstrap",
      "TensorFlow.js",
      "WebRTC",
      "Firebase",
    ],
    features: [
      "Designed video chat platform tailored for hearing-impaired users to improve accessibility",
      "Integrated TensorFlow.js for real-time sign language detection with AI-based gesture recognition",
      "Implemented WebRTC for seamless peer-to-peer video calling",
      "Used Firebase for real-time data synchronization",
      "Applied responsive design principles and optimized UI/UX for diverse devices",
    ],
    githubUrl: "https://github.com/Pranavk-official/signfy",
    category: "web-app",
    imageUrl: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1900&h=1080&fit=crop&q=80",
  },
  {
    id: "jdev-portal",
    title: "J-DEV Event Management Portal",
    year: "2021 – 2022",
    shortDescription:
      "Django-based event management system with RBAC for college activities.",
    fullDescription:
      "A robust backend system built with Django for streamlining event planning and management for college activities. Features role-based access control, dynamic content management, and responsive design.",
    technologies: ["Python", "Django", "HTML", "CSS", "Bootstrap"],
    features: [
      "Architected and deployed robust backend system using Django",
      "Implemented Role-Based Access Control (RBAC) for secure authentication",
      "Built CRUD functionalities for dynamic content management",
      "Designed responsive and user-friendly frontend with Bootstrap",
      "Enabled efficient event planning and management for college activities",
    ],
    githubUrl: "https://github.com/Pranavk-official/J-DEV_miniproject",
    category: "community",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1900&h=1080&fit=crop&q=80",
  },
];
