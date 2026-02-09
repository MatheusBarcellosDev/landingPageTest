"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

export default function SmoothScrollProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ReactLenis root options={{
            duration: 1.8,
            smoothWheel: true,
            smoothTouch: true,
            touchMultiplier: 1.5,
        } as any}>
            {children as any}
        </ReactLenis>
    );
}
