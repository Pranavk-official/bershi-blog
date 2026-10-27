export interface WorkExperience {
  id: string;
  company: string;
  location: string;
  position: string;
  employmentType: "Full-time" | "Part-time" | "Internship" | "Contract";
  startDate: string; // Format: "YYYY-MM" or "YYYY-MM-DD" (full date hides entry until that date is reached)
  endDate: string | "Present"; // Format: "YYYY-MM" or "Present"
  achievements: string[];
  technologies: string[];
  companyUrl?: string; // Optional
  logo?: string; // Optional path to company logo
}

export const workExperiences: WorkExperience[] = [
  {
    id: "parinaamaa-ai",
    company: "Parinaamaa.ai Pvt Ltd",
    location: "Kadavanthra, Kochi, Kerala",
    position: "Developer — Platform Engineering Team",
    employmentType: "Full-time",
    startDate: "2026-03-10",
    endDate: "Present",
    achievements: [
      "Building Naamaa.in — a mobile-first commerce microsite that lets SMEs publish service catalogs, accept bookings, and process payments in hours instead of weeks",
      "Owning platform modules end-to-end from design through production, with a focus on accessibility for first-time digital users aged 60+",
      "Integrating AI-driven discovery and recommendation flows into the booking experience to surface relevant local services",
      "Collaborating with product, design, and data teams in daily stand-ups, code reviews, and architecture discussions to ship the early product roadmap",
    ],
    technologies: [
      "AI/ML",
      "Next.js",
      "Node.js",
      "React",
      "TypeScript",
    ],
    companyUrl: "https://parinaamaa.ai",
  },
  {
    id: "kerala-it-mission",
    company: "Kerala State IT Mission",
    location: "Thiruvananthapuram, Kerala",
    position: "Graduate Software Development Intern",
    employmentType: "Internship",
    startDate: "2025-09-10",
    endDate: "2026-03-09",
    achievements: [
      "Developed an Aadhaar eSign application utilizing the C-DAC eSign API for secure document authentication",
      "Built a middleware backend system for handling eSign 2.1 integration between services",
      "Developed a frontend management gateway for the eSign middleware system",
      "Built a government-wide full-stack application to facilitate digital signing of PDF documents across departments in the Government of Kerala",
    ],
    technologies: [
      "Aadhaar eSign",
      "C-DAC eSign API",
      "FastAPI",
      "Next.js",
      "PostgreSQL",
      "Python",
      "React",
    ],
    companyUrl: "https://itmission.kerala.gov.in",
  },
  {
    id: "cofount-labs",
    company: "Cofount Labs",
    location: "Kozhikode, India",
    position: "Backend Developer",
    employmentType: "Full-time",
    startDate: "2024-10",
    endDate: "2025-09",
    achievements: [
      "Designed, developed, and deployed multiple web applications tailored to client needs using the MERN stack",
      "Delivered end-to-end technical solutions for startups and established businesses, ensuring high performance and scalability",
      "Conducted comprehensive testing, debugging, and performance tuning, ensuring high-quality deliverables with minimal downtime",
      "Integrated payment systems, authentication modules, and database solutions to support business workflows",
      "Managed client communications, project requirements, and technical delivery to achieve customer satisfaction",
    ],
    technologies: [
      "Authentication",
      "Bun.js",
      "MongoDB",
      "Next.js",
      "Payment Integration",
      "PostgreSQL",
      "React.js",
      "TypeScript",
    ],
    companyUrl: "https://cofount.com",
  },
  {
    id: "brototype",
    company: "Brototype",
    location: "Payyannur, India",
    position: "Intern",
    employmentType: "Internship",
    startDate: "2023-08",
    endDate: "2024-10",
    achievements: [
      "Contributed to the development of full-stack web applications using the MERN stack, ensuring scalability, maintainability, and efficiency",
      "Assisted senior developers in designing modular and reusable codebases that improved development speed and reduced errors",
      "Actively participated in peer code reviews to identify bugs, suggest improvements, and uphold coding standards",
      "Debugged, optimized, and enhanced application performance, resulting in smoother user interactions and reduced load times",
      "Collaborated closely with team members in an agile environment, consistently meeting project timelines",
    ],
    technologies: [
      "Agile Development",
      "Express.js",
      "JavaScript",
      "MongoDB",
      "Node.js",
      "React.js",
    ],
    companyUrl: "https://www.brototype.com",
  },
];
