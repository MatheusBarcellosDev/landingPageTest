"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { useLayoutEffect, useState, useEffect } from "react";

export default function SmoothScrollProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobile, setIsMobile] = useState(false);

    useLayoutEffect(() => {
        if (typeof window !== "undefined") {
            window.history.scrollRestoration = "manual";
            window.scrollTo(0, 0);

            const checkMobile = () => setIsMobile(window.innerWidth < 768);
            checkMobile();
            window.addEventListener('resize', checkMobile);
            return () => window.removeEventListener('resize', checkMobile);
        }
    }, []);

    return (
        <ReactLenis root options={{
            duration: 1.2,
            smoothWheel: true,
            smoothTouch: isMobile, // Ativa inércia customizada apenas no mobile
            touchMultiplier: isMobile ? 5 : 2, // 5x: "Uma roladinha rola muito"
        } as any}>
            {children as any}
        </ReactLenis>
    );
}
