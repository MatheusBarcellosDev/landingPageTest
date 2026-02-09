"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { useLayoutEffect } from "react";

export default function SmoothScrollProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    useLayoutEffect(() => {
        if (typeof window !== "undefined") {
            window.history.scrollRestoration = "manual";
            window.scrollTo(0, 0);
        }
    }, []);

    return (
        <ReactLenis root options={{
            duration: 1.2,
            smoothWheel: true,
            // smoothTouch: true, // Desativado para performance mobile
            touchMultiplier: 2,
        } as any}>
            {children as any}
        </ReactLenis>
    );
}
