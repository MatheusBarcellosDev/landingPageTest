"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { useLayoutEffect, useState } from "react";

export default function SmoothScrollProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // Start with mobile settings (mobile-first) to ensure touch works immediately
    const [isMobile, setIsMobile] = useState(true);
    const [isClient, setIsClient] = useState(false);

    useLayoutEffect(() => {
        setIsClient(true);

        if (typeof window !== "undefined") {
            window.history.scrollRestoration = "manual";
            window.scrollTo(0, 0);

            const checkMobile = () => setIsMobile(window.innerWidth < 768);
            checkMobile();
            window.addEventListener('resize', checkMobile);
            return () => window.removeEventListener('resize', checkMobile);
        }
    }, []);

    // Key forces Lenis to completely reinitialize when device type changes
    const lenisKey = isClient ? `lenis-${isMobile ? 'mobile' : 'desktop'}` : 'lenis-init';

    return (
        <ReactLenis
            key={lenisKey}
            root
            options={{
                duration: isMobile ? 0.8 : 1.2, // Faster on mobile for responsiveness
                smoothWheel: true,
                smoothTouch: true, // Always true - enables inertia on touch
                touchMultiplier: isMobile ? 10 : 2, // 10x on mobile for aggressive scroll
                syncTouch: true, // Sync touch position with scroll (prevents jumpiness)
                syncTouchLerp: 0.1, // Smoothing for touch sync
            } as any}
        >
            {children as any}
        </ReactLenis>
    );
}

