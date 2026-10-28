import { IconType } from "react-icons";
import {
  FaGithub,
  FaEnvelope,
  FaLinkedin,
  FaPenNib,
  FaFileAlt,
  FaHome,
  FaLaptopCode,
  FaImages,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

export interface DockItem {
  id: string;
  icon: IconType;
  label: string;
  href: string;
  external?: boolean;
  showOnlyWhenNotHome?: boolean;
  /** Paths (exact or prefix with trailing `/`) on which this item should be hidden. */
  hideOnPaths?: string[];
  /** Hide this item on the home page when viewport is mobile-sized. */
  hideOnMobileHome?: boolean;
}

export const dockItems: DockItem[] = [
  {
    id: "home",
    icon: FaHome,
    label: "Home",
    href: "/",
    showOnlyWhenNotHome: true,
  },
  {
    id: "blog",
    icon: FaPenNib,
    label: "Blog",
    href: "/notes",
  },
  {
    id: "projects",
    icon: FaLaptopCode,
    label: "My Works",
    href: "/#projects",
  },
  {
    id: "wallpapers",
    icon: FaImages,
    label: "Wallpapers",
    href: "/wallpapers",
  },
  {
    id: "resume",
    icon: FaFileAlt,
    label: "Resume",
    href: "/resume.pdf",
    external: true,
  },
  {
    id: "separator",
    icon: () => null,
    label: "separator",
    href: "#",
    hideOnPaths: ["/wallpapers"],
    hideOnMobileHome: true,
  },
  {
    id: "github",
    icon: FaGithub,
    label: "GitHub",
    href: "https://github.com/Pranavk-Official",
    external: true,
    hideOnPaths: ["/wallpapers"],
    hideOnMobileHome: true,
  },
  {
    id: "twitter",
    icon: FaSquareXTwitter,
    label: "Twitter",
    href: "https://x.com/@Arch_Lad_",
    external: true,
    hideOnPaths: ["/wallpapers"],
    hideOnMobileHome: true,
  },
  {
    id: "email",
    icon: FaEnvelope,
    label: "Email",
    href: "mailto:me@pranavk.site",
    external: true,
    hideOnPaths: ["/wallpapers"],
    hideOnMobileHome: true,
  },
  {
    id: "linkedin",
    icon: FaLinkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/pranav-k-cse",
    external: true,
    hideOnPaths: ["/wallpapers"],
    hideOnMobileHome: true,
  },
  // TODO: Create a Link Tree Page
];
