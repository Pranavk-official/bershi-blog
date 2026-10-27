import Hero from "@sections/hero/HeroSection";
import AboutMe from "@sections/about/AboutMeSection";
import Services from "@sections/services/ServicesSection";
import SkillsSection from "@sections/skills/SkillSection";
import ProjectsSection from "@sections/projects/ProjectsSection";
import ExperienceSection from "@sections/experience/ExperienceSection";
import AchievementsSection from "@sections/achievements/AchievementsSection";
import LatestArticles from "@sections/articles/LatestArticlesSection";
import ContactSection from "@sections/contact/ContactSection";
import WallpapersSection from "@sections/wallpapers/WallpapersSection";
import Footer from "@sections/footer/FooterSection";
import { BlurFade } from "@components/ui/blur-fade";

const Skill = () => {
    return <BlurFade delay={0.25 * 2} inView direction="up" > <SkillsSection /></BlurFade >;
}

const Project = () => {
    return <BlurFade delay={0.25 * 2} inView direction="up" > <ProjectsSection /></BlurFade >;
}

const Experience = () => {
    return <BlurFade delay={0.25 * 2} inView direction="up" > <ExperienceSection /></BlurFade >;
}

const Achievements = () => {
    return <BlurFade delay={0.25 * 2} inView direction="up" > <AchievementsSection /></BlurFade >;
}

const Contact = () => {
    return <BlurFade delay={0.25 * 2} inView direction="up" > <ContactSection /></BlurFade >;
}

const Wallpapers = () => {
    return <BlurFade delay={0.25 * 2} inView direction="up" > <WallpapersSection /></BlurFade >;
}

export {
    Hero,
    AboutMe,
    Services,
    Skill,
    Project,
    Experience,
    Achievements,
    LatestArticles,
    Contact,
    Wallpapers,
    Footer
};