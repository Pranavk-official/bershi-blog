import { ScrollProgress } from "@/components/ui/scroll-progress";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ScrollProgress className="h-1" />
            {children}
        </>
    );
}