import {
  // SiHtml5,   // frontend only
  // SiCss3,    // frontend only
  // SiSass,    // frontend only
  SiTailwindcss, // frontend only
  // SiBootstrap,   // frontend only
  // SiJavascript,  // frontend only
  SiTypescript,  // frontend only
  SiReact,       // frontend only
  SiNextdotjs,   // frontend only
  // SiRedux,       // frontend only
  SiFigma,       // frontend only
  SiNodedotjs,
  SiExpress,
  SiPassport,
  SiJsonwebtokens,
  SiSocketdotio,
  SiFirebase,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiPrisma,
  SiDocker,
  SiKubernetes,
  SiAmazonec2,
  SiNginx,
  SiVercel,
  SiRender,
  SiFastapi,
  SiPython,
  SiPhp,
  // SiCanva,   // genai only (commented out)
} from "react-icons/si";
import { TbApi, TbHexagons, TbNetwork } from "react-icons/tb";
import { VscServerProcess } from "react-icons/vsc";
import { FaCode, FaCubes, FaLayerGroup } from "react-icons/fa";
import { LuWorkflow, LuDatabase } from "react-icons/lu";
import { BiGitBranch } from "react-icons/bi";
import { HiOutlineCubeTransparent } from "react-icons/hi";
// import { MdOutlineArchitecture } from "react-icons/md";
import type { IconType } from "react-icons";
import { FaJava } from "react-icons/fa6";

export interface Skill {
  name: string;
  icon: IconType;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: IconType;
  accentColor: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    name: "Frontend",
    icon: FaCode,
    accentColor: "from-blue-500 to-cyan-500",
    skills: [
      // { name: "HTML", icon: SiHtml5 },
      // { name: "CSS", icon: SiCss3 },
      // { name: "SCSS", icon: SiSass },
      { name: "Tailwind", icon: SiTailwindcss },
      // { name: "Bootstrap", icon: SiBootstrap },
      { name: "TypeScript", icon: SiTypescript },
      { name: "React", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      // { name: "Redux", icon: SiRedux },
      { name: "Zustand", icon: FaCubes },
      // { name: "EJS", icon: FaCode },
      // { name: "Figma", icon: SiFigma },
    ],
  },
  {
    id: "backend",
    name: "Backend",
    icon: VscServerProcess,
    accentColor: "from-emerald-500 to-teal-500",
    skills: [
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express.js", icon: SiExpress },
      // { name: "REST API", icon: TbApi },
      // add FastAPI in here since i know python use proper fastapi icon instead of generic api icon
      { name: "FastAPI", icon: SiFastapi },
      // { name: "gRPC", icon: TbNetwork },
      // { name: "Microservices", icon: TbHexagons },
      // { name: "Passport", icon: SiPassport },
      // { name: "JWT", icon: SiJsonwebtokens },
      // { name: "WebSockets", icon: SiSocketdotio },
      { name: "Firebase", icon: SiFirebase },
    ],
  },
  {
    id: "database",
    name: "Database",
    icon: LuDatabase,
    accentColor: "from-orange-500 to-amber-500",
    skills: [
      { name: "MongoDB", icon: SiMongodb },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Redis", icon: SiRedis },
      { name: "Prisma", icon: SiPrisma },
    ],
  },
  {
    id: "devops",
    name: "DevOps & Cloud",
    icon: LuWorkflow,
    accentColor: "from-purple-500 to-pink-500",
    skills: [
      { name: "Docker", icon: SiDocker },
      { name: "Kubernetes", icon: SiKubernetes },
      { name: "AWS EC2", icon: SiAmazonec2 },
      // { name: "Nginx", icon: SiNginx },
      // { name: "CI/CD", icon: BiGitBranch },
      // { name: "Vercel", icon: SiVercel },
      // { name: "Render", icon: SiRender },
      // { name: "Buf", icon: HiOutlineCubeTransparent },
    ],
  },
  {
    id: "languages",
    name: "Languages",
    icon: FaLayerGroup,
    accentColor: "from-green-500 to-lime-500",
    skills: [
      { name: "TypeScript", icon: SiTypescript },
      { name: "Python", icon: SiPython },
      { name: "PHP", icon: SiPhp },
      { name: "Java", icon: FaJava },
    ],
  }
  // {
  //   id: "genai",
  //   name: "Gen AI & Tools",
  //   icon: LuBrainCircuit,
  //   accentColor: "from-violet-500 to-indigo-500",
  //   skills: [
  //     { name: "OpenAI", icon: SiOpenai },
  //     { name: "Gemini", icon: SiGooglegemini },
  //     { name: "LangChain", icon: LuWand },
  //     { name: "GitHub", icon: SiGithub },
  //     { name: "Postman", icon: SiPostman },
  //     { name: "Hoppscotch", icon: TbApi },
  //     // { name: "Antigravity", icon: LuWand },
  //     // { name: "Cursor", icon: FaCode },
  //     // { name: "Canva", icon: SiCanva },
  //   ],
  // },
  // {
  //   id: "architecture",
  //   name: "Architecture & Design",
  //   icon: MdOutlineArchitecture,
  //   accentColor: "from-rose-500 to-red-500",
  //   skills: [
  //     { name: "DSA", icon: VscSymbolStructure },
  //     { name: "OOP", icon: FaCubes },
  //     { name: "System Design", icon: FaProjectDiagram },
  //     { name: "MVC", icon: FaLayerGroup },
  //     { name: "Clean Architecture", icon: MdOutlineArchitecture },
  //     { name: "SOLID", icon: FaSitemap },
  //     { name: "Hexagonal", icon: TbHexagons },
  //     { name: "Repository Pattern", icon: LuDatabase },
  //     { name: "SEO", icon: TbSeo },
  //   ],
  // },
];

// Flat list for backward compatibility (if needed elsewhere)
export const tools = skillCategories.flatMap((cat) => cat.skills);
