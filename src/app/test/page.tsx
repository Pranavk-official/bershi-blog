import { Metadata } from "next";
import Lanyard from "@/components/Lanyard";

export const metadata: Metadata = {
    title: "Test Page",
};

export default function Page() {
    return (
        <>
            <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
        </>
    );
}