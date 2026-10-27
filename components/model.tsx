// Model.tsx
"use client";

import { useGLTF } from "@react-three/drei";

export function Model({ path }: { path: string }) {
    const { scene } = useGLTF(path);
    return <primitive object={scene} />;
}   