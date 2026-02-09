"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { useLayoutEffect, useState } from "react";

export default function SmoothScrollProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

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

    // Loading state
    if (isMobile === null) {
        return <>{children}</>;
    }

    // MOBILE: Use native scroll (no Lenis) - allows scroll-snap to work
    if (isMobile) {
        return <>{children}</>;
    }

    // DESKTOP: Use Lenis for smooth scroll-driven video experience
    return (
        <ReactLenis
            root
            options={{
                duration: 1.2,
                smoothWheel: true,
            }}
        >
            {children}
        </ReactLenis>
    );
}


