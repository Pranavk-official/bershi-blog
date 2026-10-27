import { Trophy, Code, Zap, Rocket, Award, ShieldCheck } from "lucide-react";

export interface Achievement {
  id: string;
  slug: string;
  number: string;
  title: string;
  organization: string;
  shortDescription: string;
  fullDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  date: string;
  location?: string;
  highlights: string[];
  image?: string;
  embedUrl?: string;
}

export const achievements: Achievement[] = [
  {
    id: "ksitm-esign-appreciation",
    slug: "ksitm-esign-certificate-of-appreciation",
    number: "01",
    title: "Certificate of Appreciation — KSITM",
    organization: "Kerala State IT Mission",
    shortDescription:
      "Recognized by the Kerala State IT Mission for contributions to the Aadhaar-based e-Sign Application, modernizing how government departments manage document signing.",
    fullDescription:
      "Honored to receive a Certificate of Appreciation from the Kerala State IT Mission (KSITM) for work on the Aadhaar-based e-Sign Application. Over several months, collaborated with Smt. Devi Thankappan and Shri. Ranjit V. (Implementation Manager, UIDAI), alongside colleague Milind Dinesh, to enhance how government departments manage document signing. Building software that influences real governance workflows for Kerala's digital infrastructure was an incredible experience.",
    icon: ShieldCheck,
    accentColor: "from-emerald-500 to-teal-600",
    gradientFrom: "emerald-500",
    gradientTo: "teal-600",
    date: "December 2025",
    location: "Thiruvananthapuram, Kerala",
    highlights: [
      "Certificate of Appreciation from Kerala State IT Mission",
      "Contributed to the Aadhaar-based e-Sign Application",
      "Collaborated with UIDAI Implementation Manager Shri. Ranjit V.",
      "Worked alongside Smt. Devi Thankappan and Milind Dinesh",
      "Enhanced document-signing workflows for government departments",
    ],
    embedUrl:
      "https://www.linkedin.com/embed/feed/update/urn:li:share:7406731722714914816",
  },
  {
    id: "yip-state-winner",
    slug: "yip-state-level-winner",
    number: "02",
    title: "YIP 4.0 State Level Winner",
    organization: "K-DISC",
    shortDescription:
      "Declared a State Level Winner at the Young Innovators Programme (YIP) 4.0 under the theme of 'Digital and Creative Art forms' and attended the CM - YIP Meet in Thiruvananthapuram.",
    fullDescription:
      "Thrilled to have been declared a State Level Winner at the Young Innovators Programme (YIP) 4.0 (Idea ID 3141) under the theme of 'Digital and Creative Art forms.' Attended the CM - YIP Meet in Thiruvananthapuram, a gathering of the state's top young innovators organized by K-DISC. Representing Jyothi Engineering College, Thrissur on such a prestigious platform and interacting with the innovation ecosystem of Kerala was an incredibly motivating experience.",
    icon: Award,
    accentColor: "from-yellow-500 to-amber-600",
    gradientFrom: "yellow-500",
    gradientTo: "amber-600",
    date: "January 2025",
    location: "Thiruvananthapuram, Kerala",
    highlights: [
      "State Level Winner at YIP 4.0 (Idea ID 3141)",
      "Theme: Digital and Creative Art forms",
      "Attended CM - YIP Meet organized by K-DISC",
      "Represented Jyothi Engineering College, Thrissur",
      "Interacted with Kerala's innovation ecosystem",
    ],
    embedUrl:
      "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7427974120681832448",
  },
  // {
  //   id: "young-innovators",
  //   slug: "young-innovators-programme",
  //   number: "02",
  //   title: "Young Innovators Programme",
  //   organization: "KSUM Initiative",
  //   shortDescription:
  //     "Got shortlisted for the second phase of the prestigious Young Innovators Programme.",
  //   fullDescription:
  //     "The Young Innovators Programme is a competitive initiative designed to identify and nurture young talent in technology and innovation. Being shortlisted for the second phase was a significant milestone, recognizing the potential and innovative thinking demonstrated through the initial submission. This programme provided exposure to industry mentors and fellow innovators from across the region.",
  //   icon: Trophy,
  //   accentColor: "from-amber-500 to-orange-600",
  //   gradientFrom: "amber-500",
  //   gradientTo: "orange-600",
  //   date: "2024",
  //   highlights: [
  //     "Selected from hundreds of applicants across the region",
  //     "Demonstrated innovative problem-solving approach",
  //     "Received mentorship from industry experts",
  //     "Networked with fellow young innovators",
  //   ],
  // },
  // {
  //   id: "technical-events",
  //   slug: "technical-events-participation",
  //   number: "03",
  //   title: "Technical Events",
  //   organization: "Multi-College Events",
  //   shortDescription:
  //     "Participated in several technical events from different colleges across the region.",
  //   fullDescription:
  //     "Active participation in various technical events organized by different colleges has been instrumental in expanding technical knowledge and networking with peers. These events ranged from coding competitions to technical symposiums, each providing unique learning opportunities and exposure to diverse problem-solving approaches.",
  //   icon: Code,
  //   accentColor: "from-blue-500 to-cyan-600",
  //   gradientFrom: "blue-500",
  //   gradientTo: "cyan-600",
  //   date: "2023-2024",
  //   location: "Various Colleges",
  //   highlights: [
  //     "Participated in coding competitions and hackathons",
  //     "Attended technical workshops and seminars",
  //     "Collaborated with students from diverse backgrounds",
  //     "Gained exposure to latest technology trends",
  //   ],
  // },
  // {
  //   id: "icefoss-hackathon",
  //   slug: "icefoss-hackathon-fisat",
  //   number: "04",
  //   title: "ICEFOSS Hackathon @ FISAT",
  //   organization: "FISAT Kerala",
  //   shortDescription:
  //     "Attended a 36-hour intensive hackathon conducted by ICEFOSS at FISAT.",
  //   fullDescription:
  //     "ICEFOSS (International Conference on Free and Open Source Software) organized an intensive 36-hour hackathon at FISAT (Federal Institute of Science and Technology). This marathon coding event pushed the limits of endurance and creativity, requiring participants to develop innovative solutions under time pressure while collaborating effectively with team members.",
  //   icon: Zap,
  //   accentColor: "from-purple-500 to-pink-600",
  //   gradientFrom: "purple-500",
  //   gradientTo: "pink-600",
  //   date: "2024",
  //   location: "FISAT, Kerala",
  //   highlights: [
  //     "36 hours of continuous coding and innovation",
  //     "Worked on open-source focused solutions",
  //     "Collaborated with diverse team members",
  //     "Developed practical solutions under time constraints",
  //   ],
  // },
  // {
  //   id: "scet-hackathon",
  //   slug: "scet-hackathon",
  //   number: "05",
  //   title: "SCET Hackathon",
  //   organization: "SCET Kerala",
  //   shortDescription:
  //     "Attended a 24-hour coding marathon hackathon conducted at SCET.",
  //   fullDescription:
  //     "The SCET Hackathon was an intensive 24-hour coding marathon that brought together talented developers to solve real-world problems. This event provided an excellent platform to test rapid development skills, work under pressure, and deliver functional prototypes within strict deadlines.",
  //   icon: Rocket,
  //   accentColor: "from-emerald-500 to-teal-600",
  //   gradientFrom: "emerald-500",
  //   gradientTo: "teal-600",
  //   date: "2024",
  //   location: "SCET, Kerala",
  //   highlights: [
  //     "24-hour intensive coding marathon",
  //     "Built functional prototype from scratch",
  //     "Applied agile development practices",
  //     "Presented solution to panel of judges",
  //   ],
  // },
];
