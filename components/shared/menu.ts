import { House, Mail, NotebookPen, Palette, User, type LucideIcon } from "lucide-react";

export const menu: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Home", href: "/", icon: House },
  { label: "Notes", href: "/notes", icon: NotebookPen },
  { label: "Art", href: "/art", icon: Palette },
  { label: "About", href: "/about", icon: User },
  { label: "Contact", href: "/contact", icon: Mail },
];
