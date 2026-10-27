import { Code, Component, Database, Lock, Server } from "lucide-react";
import { ReactNode } from "react";
import { IconCloudDemo } from "@/components/shared/IconCloudDemo";

export const serviceItems = [
  {
    Icon: Code,
    name: "RESTful API Development & Integration",
    description:
      "Proficient in building and integrating RESTful APIs, ensuring seamless communication between front-end and back-end systems.",
    href: "/",
    cta: "Learn more",
    background: (<div />) as ReactNode,
    className:
      "col-span-1 sm:col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Component,
    name: "Microservices Architecture",
    description:
      "Practical experience in designing and implementing microservices architecture for building modular and independently deployable services.",
    href: "/",
    cta: "Learn more",
    background: (<div />) as ReactNode,
    className:
      "col-span-1 sm:col-span-1 lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Server,
    name: "Full Stack Web Development",
    description:
      "Expertise in designing, developing, and deploying scalable web applications using MongoDB, Express.js, React.js, and Node.js.",
    href: "/",
    cta: "Learn more",
    background: (<IconCloudDemo />) as ReactNode,
    className:
      "col-span-1 sm:col-span-2 lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: Lock,
    name: "Authentication & Security",
    description:
      "Skilled in implementing secure authentication mechanisms like OAuth and Role-Based Access Control (RBAC) to protect user data.",
    href: "/",
    cta: "Learn more",
    background: (<div />) as ReactNode,
    className:
      "col-span-1 sm:col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Database,
    name: "Containerization & Deployment",
    description:
      "Experience with Docker and Kubernetes for containerizing and deploying applications, ensuring consistency across different environments.",
    href: "/",
    cta: "Learn more",
    background: (<div />) as ReactNode,
    className:
      "col-span-1 sm:col-span-1 lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];
